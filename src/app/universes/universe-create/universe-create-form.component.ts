import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { FormStatus } from "src/app/shared/form-status.model";
import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-create-form",
    templateUrl: "./universe-create-form.component.html",
    styleUrls: ["./universe-create-form.component.scss"],
})
export class UniverseCreateFormComponent {
    @Input() status: FormStatus;
    @Output() created = new EventEmitter<Universe>();

    public universeForm = new FormGroup({
        description: new FormControl(""),
        name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });

    public constructor() {}

    public get canSubmit() {
        return this.universeForm.valid && !this.status.loading;
    }

    public onCreate() {
        const universe = this.universeForm.value as Universe;
        this.created.emit(universe);
    }
}
