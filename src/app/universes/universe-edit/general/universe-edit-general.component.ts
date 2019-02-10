import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { finalize, first } from "rxjs/operators";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { UniverseEditService } from "../../shared/universe-edit.service";
import { Universe } from "../../shared/universe.model";

@Component({
    selector: "cb-universe-edit-general",
    templateUrl: "./universe-edit-general.component.html",
    styleUrls: [],
})
export class UniverseEditGeneralComponent implements OnInit, CanComponentDeactivate {
    public generalForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        description: new FormControl(""),
    });
    public status: FormStatus = { loading: false, error: undefined };
    public universe: Universe;

    public constructor(private route: ActivatedRoute, private universeEditService: UniverseEditService) {}

    public canDeactivate() {
        if (this.generalForm.dirty) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.generalForm.valid && this.generalForm.dirty) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public ngOnInit() {
        this.universeEditService.getUniverse().subscribe((u) => {
            this.universe = u;
            this.generalForm.patchValue(this.universe);
        });
    }

    public onSubmit() {
        this.status = { loading: true, error: undefined, success: undefined };

        const payload = this.generalForm.value as Partial<Universe>;
        this.universeEditService
            .update(this.universe.id, payload)
            .pipe(
                finalize(() => {
                    this.status.loading = false;
                    this.generalForm.markAsPristine();
                }),
            )
            .subscribe(
                (u) => {
                    this.universeEditService.setUniverse(u);
                    this.status.success = "Changes saved successfully";
                },
                (err) => {
                    this.status.error = err;
                },
            );
    }
}
