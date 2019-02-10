import { Component, HostBinding, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CharacterFieldType, ProgressBarColor } from "src/app/characters/characters.model";

@Component({
    selector: "cb-universe-edit-guide-field-settings",
    templateUrl: "./universe-edit-guide-field-settings.component.html",
    styleUrls: [],
})
export class UniverseEditGuideFieldSettingsComponent {
    public CharacterFieldType = CharacterFieldType;
    @Input() public field: FormGroup;
    @Input() public type: CharacterFieldType;
    @HostBinding("class") private classes = "card border-secondary card-body mb-2";

    public getDefaultType() {
        switch (this.type) {
            case CharacterFieldType.Number:
            case CharacterFieldType.Progress:
                return "number";
            default:
                return "text";
        }
    }

    public getProgressColors() {
        return Object.values(ProgressBarColor);
    }
}
