import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { finalize, first } from "rxjs/operators";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { CollaboratorRole } from "../../shared/collaborator-role.enum";
import { Collaborator } from "../../shared/collaborator.model";
import { UniverseEditService } from "../../shared/universe-edit.service";
import { Universe } from "../../shared/universe.model";

@Component({
    selector: "cb-universe-edit-collaborators",
    templateUrl: "./universe-edit-collaborators.component.html",
    styleUrls: [],
})
export class UniverseEditCollaboratorsComponent implements OnInit, CanComponentDeactivate {
    public addCollaboratorForm = new FormGroup({
        input: new FormControl("", [Validators.required]),
    });
    public CollaboratorRole = CollaboratorRole;
    public collaborators: Collaborator[];
    public status: FormStatus = { loading: false };
    private universe: Universe;

    public constructor(private route: ActivatedRoute, private universeEditService: UniverseEditService) {}

    public canDeactivate() {
        if (this.addCollaboratorForm.dirty) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public editCollaborator(id: string, role: CollaboratorRole) {
        this.universeEditService.editCollaborator(this.universe.id, id, role).subscribe(
            () => {
                this.collaborators = this.collaborators.map((c) => {
                    if (c.user.id === id) {
                        c.role = role;
                    }
                    return c;
                });
            },
            (err) => {
                this.status.error = err;
            },
        );
    }

    public getCollaborators() {
        const owner = this.collaborators.find((c) => c.role === CollaboratorRole.Owner);
        const admins = this.collaborators.filter((c) => c.role === CollaboratorRole.Admin);
        const members = this.collaborators.filter((c) => c.role === CollaboratorRole.Member);
        const sorted = [owner].concat(...this.sortCollaborators(admins), ...this.sortCollaborators(members));
        return sorted;
    }

    public getRoleLabel(role: CollaboratorRole) {
        switch (role) {
            case CollaboratorRole.Owner:
                return "Owner";
            case CollaboratorRole.Admin:
                return "Admin";
            case CollaboratorRole.Member:
                return "Member";
        }
    }

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.addCollaboratorForm.valid) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public ngOnInit() {
        this.route.parent.data
            .pipe(first())
            .subscribe((data: { collaborators: Collaborator[]; universe: Universe }) => {
                this.collaborators = data.collaborators;
            });
        this.universeEditService.getUniverse().subscribe((u) => {
            this.universe = u;
        });
    }

    public onSubmit() {
        this.status = { loading: true, success: undefined, error: undefined };

        const input = this.addCollaboratorForm.value["input"];
        this.universeEditService
            .addCollaborator(this.universe.id, input)
            .pipe(
                finalize(() => {
                    this.status.loading = false;
                    this.addCollaboratorForm.markAsPristine();
                }),
            )
            .subscribe(
                (added) => {
                    this.collaborators.push(added);
                    this.status.success = `Successfully added ${added.user.displayName}`;
                    this.addCollaboratorForm.reset();
                },
                (err) => (this.status.error = err),
            );
    }

    public removeCollaborator(id: string) {
        this.universeEditService.removeCollaborator(this.universe.id, id).subscribe(
            () => {
                this.collaborators = this.collaborators.filter((c) => c.user.id !== id);
            },
            (err) => {
                this.status.error = err;
            },
        );
    }

    private sortCollaborators(collaborators: Collaborator[]) {
        return collaborators.sort((a, b) => {
            if (a.user.displayName > b.user.displayName) {
                return 1;
            } else if (a.user.displayName < b.user.displayName) {
                return -1;
            } else {
                return 0;
            }
        });
    }
}
