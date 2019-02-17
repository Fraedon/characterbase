import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize, first } from "rxjs/operators";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { UniverseEditService } from "../../shared/universe-edit.service";
import { Universe } from "../../shared/universe.model";

@Component({
    selector: "cb-universe-edit-settings",
    templateUrl: "./universe-edit-settings.component.html",
    styleUrls: [],
})
export class UniverseEditSettingsComponent implements OnInit, CanComponentDeactivate {
    public modalRef: BsModalRef;
    public settingsForm = new FormGroup({
        titleField: new FormControl("Name", [Validators.required]),
        allowAvatars: new FormControl(true),
        allowLexicographicalOrdering: new FormControl(false),
    });
    public status: FormStatus = { loading: false };
    public universe: Universe;

    public constructor(
        private route: ActivatedRoute,
        private universeEditService: UniverseEditService,
        private modalService: BsModalService,
        private router: Router,
    ) {}

    public canDeactivate() {
        if (this.settingsForm.dirty) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public deleteCharacters() {
        this.modalRef.hide();
        this.universeEditService.deleteCharacters(this.universe).subscribe(
            () => {
                this.status.success = "All characters successfully deleted";
            },
            (err) => {
                this.status.error = err;
            },
        );
    }

    public deleteUniverse() {
        this.modalRef.hide();
        this.universeEditService.deleteUniverse(this.universe).subscribe(
            () => {
                this.router.navigate([""]);
                alert("Universe deleted");
            },
            (err) => {
                this.status.error = err;
            },
        );
    }

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.settingsForm.valid && this.settingsForm.dirty) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public ngOnInit() {
        this.universeEditService.getUniverse().subscribe((u) => {
            this.universe = u;
            this.settingsForm.patchValue(this.universe.settings);
        });
    }

    public onSubmit() {
        this.status = { loading: false, error: undefined, success: undefined };

        const payload = { settings: this.settingsForm.value } as Partial<Universe>;
        this.universeEditService
            .update(this.universe.id, payload)
            .pipe(
                finalize(() => {
                    this.status.loading = false;
                    this.settingsForm.markAsPristine();
                }),
            )
            .subscribe(
                (u) => {
                    this.status.success = "Successfully updated settings";
                    this.universeEditService.setUniverse(u);
                    this.settingsForm.patchValue(u.settings);
                },
                (err) => {
                    this.status.error = err;
                },
            );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
}
