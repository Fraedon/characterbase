import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { CharacterFieldType } from "src/app/characters/characters.model";

@Component({
    selector: "cb-universe-edit-guide-group",
    templateUrl: "./universe-edit-guide-group.component.html",
    styleUrls: ["./universe-edit-guide-group.component.scss"],
})
export class UniverseEditGuideGroupComponent {
    @Input() public canDelete: boolean;
    public CharacterFieldType = CharacterFieldType;
    @Output() public deleted = new EventEmitter();
    @Output() public fieldAdded = new EventEmitter<CharacterFieldType>();
    @Output() public fieldDeleted = new EventEmitter<number>();
    @Output() public fieldMoved = new EventEmitter<{ currentIndex: number; previousIndex: number }>();
    @Input() public group: FormGroup;
    public showSettings = false;
    @HostBinding("class") private classes = "card card-body mb-3";

    public getFields() {
        return this.group.get("fields") as FormArray;
    }

    public onMoveField(event: { currentIndex: number; previousIndex: number }) {
        this.fieldMoved.emit({ ...event });
    }
}
