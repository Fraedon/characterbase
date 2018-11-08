import { Component, EventEmitter, Output, Input, OnChanges } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-create-form",
    templateUrl: "./universe-create-form.component.html",
    styleUrls: ["./universe-create-form.component.scss"],
})
export class UniverseCreateFormComponent implements OnChanges {
    @Input() loading: boolean;
    @Input() error: string;
    @Output() created = new EventEmitter<Universe>();

    public universeForm = new FormGroup({
        name: new FormControl("", [Validators.required, Validators.minLength(3)]),
        description: new FormControl(""),
    });

    public constructor() { }

    public ngOnChanges(changes) {
        if (changes["loading"]) {
            if (changes["loading"].currentValue) { this.universeForm.disable(); return; }
            this.universeForm.enable();
        }
    }

    public onCreate() {
        const universe = this.universeForm.value as Universe;
        this.created.emit(universe);
    }
}
