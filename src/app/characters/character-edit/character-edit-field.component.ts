import { Component, Input, OnChanges } from "@angular/core";
import { createEmbeddedView } from "@angular/core/src/view/view";
import { FormGroup } from "@angular/forms";

import { CharacterFieldType, CharacterGuideField } from "../characters.model";

@Component({
    selector: "cb-character-edit-field",
    templateUrl: "character-edit-field.component.html",
    styleUrls: [],
})
export class CharacterEditFieldComponent implements OnChanges {
    public CharacterFieldType = CharacterFieldType;
    @Input() public field: FormGroup;
    @Input() public name: string;
    @Input() public universeField: CharacterGuideField;

    public getType() {
        return this.field.get("type").value;
    }

    public ngOnChanges() {
        if (!this.universeField.required && !this.field.get("value").value) {
            this.field.disable();
        }
    }

    public toggleField() {
        if (this.field.enabled) {
            this.field.disable();
        } else {
            this.field.enable();
        }
        this.field.markAsDirty();
    }

    public toggleFieldHidden() {
        this.field.get("hidden").setValue(!this.field.get("hidden").value);
        this.field.markAsDirty();
    }
}
