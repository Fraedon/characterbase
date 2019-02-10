import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { CharacterGuideGroup } from "../characters.model";

@Component({
    selector: "cb-character-edit-group",
    templateUrl: "character-edit-group.component.html",
    styleUrls: [],
})
export class CharacterEditGroupComponent {
    @Input() public group: FormGroup;
    @Input() public name: string;
    @Input() public universeGroup: CharacterGuideGroup;

    public getFields() {
        return this.group.get("fields") as FormGroup;
    }

    public getFormField(name: string) {
        return this.getFields().get(name);
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
}
