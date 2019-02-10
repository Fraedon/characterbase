import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { Universe } from "../shared/universe.model";

@Component({
    selector: "cb-universe-create-form",
    templateUrl: "./universe-create-form.component.html",
    styleUrls: ["./universe-create-form.component.scss"],
})
export class UniverseCreateFormComponent {
    @Output() public created = new EventEmitter<Partial<Universe>>();
    @Input() public status: FormStatus;
    public universeForm = new FormGroup({
        description: new FormControl(""),
        name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.universeForm.invalid || this.universeForm.pristine) {
            return SubmitButtonState.Disabled;
        } else {
            return SubmitButtonState.Allowed;
        }
    }

    public onSubmit() {
        this.created.emit(this.universeForm.value);
    }
}
