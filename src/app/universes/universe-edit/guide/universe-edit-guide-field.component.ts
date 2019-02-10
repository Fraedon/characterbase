import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CharacterFieldType } from "src/app/characters/characters.model";

@Component({
    selector: "cb-universe-edit-guide-field",
    templateUrl: "./universe-edit-guide-field.component.html",
    styleUrls: ["./universe-edit-guide-field.component.scss"],
})
export class UniverseEditGuideFieldComponent {
    public CharacterFieldType = CharacterFieldType;
    @Output() public deleted = new EventEmitter();
    @Input() public field: FormGroup;
    public showSettings = false;

    public getType() {
        return this.field.get("type").value as CharacterFieldType;
    }
}
