import { Component, Input, OnChanges } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";

import { CharacterField, CharacterGroup, CharacterGuideGroup } from "../characters.model";

@Component({
    selector: "cb-character-edit-group",
    templateUrl: "character-edit-group.component.html",
    styleUrls: [],
})
export class CharacterEditGroupComponent implements OnChanges {
    @Input() public group: FormGroup;
    @Input() public name: string;
    @Input() public universeGroup: CharacterGuideGroup;

    public getFields() {
        return this.group.get("fields") as FormGroup;
    }

    public getFormField(name: string) {
        return this.getFields().get(name);
    }

    public ngOnChanges() {
        if (!this.universeGroup.required && this.isGroupEmpty()) {
            this.group.disable();
        }
    }

    public toggleGroup() {
        if (this.group.enabled) {
            this.group.disable();
        } else {
            this.group.enable();
        }
        this.group.markAsDirty();
    }

    public toggleGroupHidden() {
        this.group.get("hidden").setValue(!this.group.get("hidden").value);
        this.group.markAsDirty();
    }

    private getGroupValues() {
        return this.group.get("fields").value as { [key: string]: CharacterField };
    }

    private isGroupEmpty() {
        const fields = this.getGroupValues();
        let empty = true;
        for (const f of Object.values(fields)) {
            if (f.value) {
                empty = false;
                break;
            }
        }
        return empty;
    }
}
