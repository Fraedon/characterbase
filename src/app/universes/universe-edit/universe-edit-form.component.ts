import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";
import { UniverseEditPage } from "./universe-edit.component";
import { User } from "firebase";
import { CharacterFieldType, ProgressBarColor } from "src/app/characters/characters.model";
import { Universe } from "../universe.model";
import { CharacterFormGroup } from "src/app/characters/character-create/character-create-form.component";

@Component({
    selector: "cb-universe-edit-form",
    templateUrl: "./universe-edit-form.component.html",
    styleUrls: ["./universe-edit-form.component.scss"],
})
export class UniverseEditFormComponent implements OnInit, OnChanges {
    @Input() error: string;
    @Input() loading: string;
    @Input() preloadedUniverse: Universe;
    @Input() page: UniverseEditPage;
    @Input() user: User;
    @Input() saved = new EventEmitter();
    @Output() savedChanges = new EventEmitter<Universe>();

    public UniverseEditPage = UniverseEditPage;
    public CharacterFieldType = CharacterFieldType;
    public ProgressBarColor = Object.values(ProgressBarColor);
    public universeOwner: string;
    public unsavedChanges = true;
    public guideSettingsDisplay = {};

    public universeForm = new FormGroup({
        name: new FormControl("", [Validators.required, Validators.minLength(3)]),
        description: new FormControl(""),
        collaborators: new FormArray([]),
        guide: new FormGroup({
            groups: new FormArray([]),
        }),
        advanced: new FormGroup({
            titleField: new FormControl("Name", [Validators.required]),
            allowAvatar: new FormControl(true),
        })
    });

    public constructor() { }

    get collaborators() { return this.universeForm.get("collaborators") as FormArray; }

    get guide() { return this.universeForm.get("guide") as FormGroup; }

    get groups() { return this.guide.get("groups") as FormArray; }

    private createGuideGroup(name?: string) {
        return new FormGroup({
            name: new FormControl(name, [Validators.required]),
            fields: new FormArray([]),
        });
    }

    private preloadFormControls(preloaded: Universe) {
        if (!preloaded.guide.groups) { return; }
        preloaded.guide.groups.forEach((group, i) => {
            this.addGroup();
            group.fields.forEach((field, j) => {
                switch (field.type) {
                    case CharacterFieldType.Text:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Text);
                        break;
                    case CharacterFieldType.Description:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Description);
                        break;
                    case CharacterFieldType.Number:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Number);
                        break;
                    case CharacterFieldType.Toggle:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Toggle);
                        break;
                    case CharacterFieldType.Progress:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Progress);
                        break;
                    case CharacterFieldType.Reference:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Reference);
                        break;
                    case CharacterFieldType.Options:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Options);
                        break;
                    case CharacterFieldType.List:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.List);
                        break;
                    case CharacterFieldType.Picture:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Picture);
                        break;
                }
            });
        });
    }

    public ngOnInit() {
        if (this.preloadedUniverse) {
            this.universeOwner = this.preloadedUniverse.owner;
            delete this.preloadedUniverse.owner;
            this.preloadFormControls(this.preloadedUniverse);
            this.preloadedUniverse.collaborators.forEach(() => this.collaborators.push(new FormControl("", [Validators.email])));
            this.universeForm.setValue(this.preloadedUniverse);
            // Add inputs if there are none
            if (this.collaborators.length === 0) { this.collaborators.push(new FormControl("", [Validators.email])); }
            if (this.groups.controls.length === 0) { this.groups.push(this.createGuideGroup("General")); }
        }
        this.universeForm.valueChanges.subscribe((v) => {
            if (this.universeForm.dirty) { this.unsavedChanges = true; }
        });
        this.saved.subscribe(() => {
            this.universeForm.markAsPristine();
            this.unsavedChanges = false;
        });
    }

    public ngOnChanges(changes) {
        if (changes["loading"]) {
            if (changes["loading"].currentValue) { this.universeForm.disable(); return; }
            this.universeForm.enable();
        }
    }

    public onMoveGroup(event: { previousIndex: number, currentIndex: number }) {
        const from = event.previousIndex;
        const to = event.currentIndex;
        const control = this.groups.at(from);
        this.groups.removeAt(from);
        this.groups.insert(to, control);
        this.unsavedChanges = true;
    }

    public onMoveField(event: { previousIndex: number, currentIndex: number }, groupIndex: number) {
        const from = event.previousIndex;
        const to = event.currentIndex;
        const control = ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).at(from);
        ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).removeAt(from);
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        const previouslyOpen = this.guideSettingsDisplay[[groupIndex, from]];
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        if (previouslyOpen) { this.guideSettingsDisplay[[groupIndex, from]] = false; }
        ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).insert(to, control);
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        if (previouslyOpen) { this.guideSettingsDisplay[[groupIndex, to]] = true; }
        this.unsavedChanges = true;
    }

    public numControls(control: FormGroup) {
        return Object.keys(control.controls).length;
    }

    public addGroup() {
        this.groups.push(this.createGuideGroup());
    }

    public addField(group: FormGroup, type: CharacterFieldType) {
        const fieldArray = group.controls["fields"] as FormArray;
        const control = new FormGroup({}) as CharacterFormGroup;
        control.addControl("name", new FormControl(null, [Validators.required]));
        control.addControl("required", new FormControl(true));
        control.addControl("info", new FormControl(""));
        control.type = type;
        switch (type) {
            case CharacterFieldType.Text:
                control.addControl("type", new FormControl(CharacterFieldType.Text));   // TODO: Add validator to enforce type value
                control.addControl("minLength", new FormControl(0, [Validators.min(0), Validators.max(139)]));
                control.addControl("maxLength", new FormControl(140, [Validators.min(0), Validators.max(140)]));
                break;
            case CharacterFieldType.Description:
                control.addControl("type", new FormControl(CharacterFieldType.Description));
                control.addControl("markdown", new FormControl(true));
                control.addControl("minLength", new FormControl(0, [Validators.min(0), Validators.max(7999)]));
                control.addControl("maxLength", new FormControl(8000, [Validators.min(0), Validators.max(8000)]));
                break;
            case CharacterFieldType.Number:
                control.addControl("type", new FormControl(CharacterFieldType.Number));
                control.addControl("float", new FormControl(false));
                control.addControl("tick", new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE / 2)]));
                control.addControl("min", new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE - 1)]));
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(Number.MAX_VALUE)]));
                break;
            case CharacterFieldType.Toggle:
                control.addControl("type", new FormControl(CharacterFieldType.Toggle));
                break;
            case CharacterFieldType.Progress:
                control.addControl("type", new FormControl(CharacterFieldType.Progress));
                control.addControl("color", new FormControl(ProgressBarColor.Red));
                control.addControl("bar", new FormControl(true));
                control.addControl("tick", new FormControl(0));
                control.addControl("min", new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE - 1)]));
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(Number.MAX_VALUE)]));
                break;
            case CharacterFieldType.Reference:
                control.addControl("type", new FormControl(CharacterFieldType.Reference));
                break;
            case CharacterFieldType.Options:
                control.addControl("type", new FormControl(CharacterFieldType.Options));
                control.addControl("options", new FormControl(""));
                control.addControl("multiple", new FormControl(false));
                break;
            case CharacterFieldType.List:
                control.addControl("type", new FormControl(CharacterFieldType.List));
                control.addControl("items", new FormControl(CharacterFieldType.Text));
                control.addControl("options", new FormControl(null));
                control.addControl("min", new FormControl(0, [Validators.min(0), Validators.max(255)]));
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(256)]));
                break;
            case CharacterFieldType.Picture:
                control.addControl("type", new FormControl(CharacterFieldType.Picture));
                break;
        }
        fieldArray.push(control);
    }

    public removeField(group: number, index: number) {
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        this.guideSettingsDisplay[[group, index]] = false;
        ((this.groups.controls[group] as FormGroup).controls["fields"] as FormArray).removeAt(index);
    }

    public removeGroup(group: number) {
        this.groups.removeAt(group);
    }

    public onSaveChanges() {
        const universe = { ...this.universeForm.value as Universe, owner: this.universeOwner };
        // Sanitize values
        universe.collaborators = universe.collaborators.filter((c) => c.trim() !== "");
        this.savedChanges.emit(universe);
    }

    public addCollaborator() {
        this.collaborators.push(new FormControl("", [Validators.email]));
    }

    public removeCollaborator(i) {
        this.collaborators.removeAt(i);
    }
}
