import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "firebase";
import { CharacterFormGroup } from "src/app/characters/character-edit/character-edit-form.component";
import { CharacterFieldType, CharacterGuideOptionsField, ProgressBarColor } from "src/app/characters/characters.model";
import { FormStatus } from "src/app/shared/form-status.model";
import { uniqueControlNamesValidator } from "src/app/shared/validators/unique-groups.directive";
import { Universe } from "../universe.model";
import { UniverseEditPage } from "./universe-edit.component";

@Component({
    selector: "cb-universe-edit-form",
    templateUrl: "./universe-edit-form.component.html",
    styleUrls: ["./universe-edit-form.component.scss"],
})
export class UniverseEditFormComponent implements OnInit {
    @Input() status: FormStatus;
    @Input() preloadedUniverse: Universe;
    @Input() page: UniverseEditPage;
    @Input() user: User;
    @Input() saved = new EventEmitter();
    @Output() savedChanges = new EventEmitter<Universe>();
    @Output() universeDeleted = new EventEmitter<null>();
    @Output() charactersDeleted = new EventEmitter<null>();
    @Output() changes = new EventEmitter<boolean>();

    public UniverseEditPage = UniverseEditPage;
    public CharacterFieldType = CharacterFieldType;
    public ProgressBarColor = Object.values(ProgressBarColor);
    public universeOwner: string;
    public guideSettingsDisplay = {};

    public universeForm = new FormGroup({
        advanced: new FormGroup({
            allowAvatar: new FormControl(true),
            titleField: new FormControl("Name", [Validators.required]),
        }),
        collaborators: new FormArray([]),
        description: new FormControl(""),
        guide: new FormGroup({
            groups: new FormArray([], uniqueControlNamesValidator()),
        }),
        name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });

    public constructor() {}

    public get canSubmit() {
        return this.universeForm.valid && !this.status.loading && this.universeForm.dirty;
    }

    public get collaborators() {
        return this.universeForm.get("collaborators") as FormArray;
    }

    public get guide() {
        return this.universeForm.get("guide") as FormGroup;
    }

    public get groups() {
        return this.guide.get("groups") as FormArray;
    }

    public deleteUniverse() {
        this.universeDeleted.emit();
    }

    public deleteAllCharacters() {
        this.charactersDeleted.emit();
    }

    private createGuideGroup(name?: string) {
        return new FormGroup({
            fields: new FormArray([], uniqueControlNamesValidator()),
            name: new FormControl(name, [Validators.required]),
        });
    }

    private preloadFormControls(preloaded: Universe) {
        if (!preloaded.guide.groups) {
            return;
        }
        preloaded.guide.groups.forEach((group, i) => {
            this.groups.push(this.createGuideGroup());
            group.fields.forEach((field, j) => {
                let disableDefault = false;
                if (typeof field.default === "undefined") {
                    field.default = "";
                    disableDefault = true;
                }
                switch (field.type) {
                    case CharacterFieldType.Description:
                        this.addField(
                            this.groups.controls[i] as FormGroup,
                            CharacterFieldType.Description,
                            disableDefault
                        );
                        break;
                    case CharacterFieldType.List:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.List, disableDefault);
                        break;
                    case CharacterFieldType.Number:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Number, disableDefault);
                        break;
                    case CharacterFieldType.Options:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Options, disableDefault);
                        break;
                    case CharacterFieldType.Picture:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Picture, disableDefault);
                        break;
                    case CharacterFieldType.Progress:
                        this.addField(
                            this.groups.controls[i] as FormGroup,
                            CharacterFieldType.Progress,
                            disableDefault
                        );
                        break;
                    case CharacterFieldType.Reference:
                        this.addField(
                            this.groups.controls[i] as FormGroup,
                            CharacterFieldType.Reference,
                            disableDefault
                        );
                        break;
                    case CharacterFieldType.Text:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Text, disableDefault);
                        break;
                    case CharacterFieldType.Toggle:
                        this.addField(this.groups.controls[i] as FormGroup, CharacterFieldType.Toggle, disableDefault);
                        break;
                }
            });
        });
    }

    public serializePreload(universe: Universe) {
        return Object.assign({}, universe, {
            guide: {
                groups: universe.guide.groups.map((g) => {
                    return {
                        fields: [
                            ...g.fields.map((f) => {
                                let nv;
                                const nf = Object.assign({}, f);
                                if (f.type === CharacterFieldType.Options) {
                                    nv = (f as CharacterGuideOptionsField).options.join(", ");
                                    (nf as CharacterGuideOptionsField).options = nv;
                                }
                                return nf;
                            }),
                        ],
                        name: g.name,
                    };
                }),
            },
        });
    }

    public ngOnInit() {
        this.universeOwner = this.preloadedUniverse.owner;
        delete this.preloadedUniverse.owner;
        this.preloadFormControls(this.preloadedUniverse);
        this.preloadedUniverse.collaborators.forEach(() =>
            this.collaborators.push(new FormControl("", [Validators.email]))
        );
        const preload = this.serializePreload(this.preloadedUniverse);
        this.universeForm.setValue(preload);
        // Add inputs if there are none
        if (this.collaborators.length === 0) {
            this.collaborators.push(new FormControl("", [Validators.email]));
        }
        if (this.groups.controls.length === 0) {
            this.groups.push(this.createGuideGroup("General"));
        }

        this.universeForm.valueChanges.subscribe(() => {
            if (this.universeForm.dirty) {
                this.changes.emit(true);
            }
        });
        this.saved.subscribe(() => {
            this.universeForm.markAsPristine();
        });
    }

    public splitOptions(options: string) {
        return options.split(",");
    }

    public onMoveGroup(event: { previousIndex: number; currentIndex: number }) {
        const from = event.previousIndex;
        const to = event.currentIndex;
        const control = this.groups.at(from);
        this.groups.removeAt(from);
        this.groups.insert(to, control);
        this.groups.markAsDirty();
    }

    public onMoveField(event: { previousIndex: number; currentIndex: number }, groupIndex: number) {
        const from = event.previousIndex;
        const to = event.currentIndex;
        const control = ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).at(from);
        ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).removeAt(from);
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        const previouslyOpen = this.guideSettingsDisplay[[groupIndex, from]];
        if (previouslyOpen) {
            // @ts-ignore   // It is safe to use an array as a JSON index in this case
            this.guideSettingsDisplay[[groupIndex, from]] = false;
        }
        ((this.groups.controls[groupIndex] as FormGroup).controls.fields as FormArray).insert(to, control);
        if (previouslyOpen) {
            // @ts-ignore   // It is safe to use an array as a JSON index in this case
            this.guideSettingsDisplay[[groupIndex, to]] = true;
        }
        this.groups.markAsDirty();
    }

    public numControls(control: FormGroup) {
        return Object.keys(control.controls).length;
    }

    public addGroup() {
        this.groups.push(this.createGuideGroup());
        this.groups.markAsDirty();
    }

    public addField(group: FormGroup, type: CharacterFieldType, disableDefault: boolean = true) {
        const fieldArray = group.controls["fields"] as FormArray;
        const control = new FormGroup({}) as CharacterFormGroup;
        control.addControl("name", new FormControl(null, [Validators.required]));
        control.addControl("required", new FormControl(true));
        control.addControl("default", new FormControl({ disabled: disableDefault, value: null }));
        control.addControl("info", new FormControl(""));
        control.type = type;
        switch (type) {
            case CharacterFieldType.Description:
                control.addControl("type", new FormControl(CharacterFieldType.Description));
                control.addControl("markdown", new FormControl(true));
                control.addControl("minLength", new FormControl(0, [Validators.min(0), Validators.max(7999)]));
                control.addControl("maxLength", new FormControl(8000, [Validators.min(0), Validators.max(8000)]));
                break;
            case CharacterFieldType.List:
                control.addControl("type", new FormControl(CharacterFieldType.List));
                control.addControl("items", new FormControl(CharacterFieldType.Text));
                control.addControl("options", new FormControl(null));
                control.addControl("min", new FormControl(0, [Validators.min(0), Validators.max(255)]));
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(256)]));
                break;
            case CharacterFieldType.Number:
                control.addControl("type", new FormControl(CharacterFieldType.Number));
                control.addControl("float", new FormControl(false));
                control.addControl(
                    "tick",
                    new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE / 2)])
                );
                control.addControl(
                    "min",
                    new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE - 1)])
                );
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(Number.MAX_VALUE)]));
                break;
            case CharacterFieldType.Options:
                control.addControl("type", new FormControl(CharacterFieldType.Options));
                control.addControl("options", new FormControl("", [Validators.required]));
                control.addControl("multiple", new FormControl(false));
                break;
            case CharacterFieldType.Picture:
                control.addControl("type", new FormControl(CharacterFieldType.Picture));
                break;
            case CharacterFieldType.Progress:
                control.addControl("type", new FormControl(CharacterFieldType.Progress));
                control.addControl("color", new FormControl(ProgressBarColor.Red));
                control.addControl("bar", new FormControl(true));
                control.addControl("tick", new FormControl(0));
                control.addControl(
                    "min",
                    new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_VALUE - 1)])
                );
                control.addControl("max", new FormControl(100, [Validators.min(0), Validators.max(Number.MAX_VALUE)]));
                break;
            case CharacterFieldType.Reference:
                control.addControl("type", new FormControl(CharacterFieldType.Reference));
                break;
            case CharacterFieldType.Text:
                control.addControl("type", new FormControl(CharacterFieldType.Text)); // TODO: Add validator to enforce type value
                control.addControl("minLength", new FormControl(0, [Validators.min(0), Validators.max(139)]));
                control.addControl("maxLength", new FormControl(140, [Validators.min(0), Validators.max(140)]));
                break;
            case CharacterFieldType.Toggle:
                control.addControl("type", new FormControl(CharacterFieldType.Toggle));
                break;
        }
        fieldArray.push(control);
    }

    public removeField(group: number, index: number) {
        // @ts-ignore   // It is safe to use an array as a JSON index in this case
        this.guideSettingsDisplay[[group, index]] = false;
        ((this.groups.controls[group] as FormGroup).controls["fields"] as FormArray).removeAt(index);
        ((this.groups.controls[group] as FormGroup).controls["fields"] as FormArray).markAsDirty();
    }

    public removeGroup(group: number) {
        this.groups.removeAt(group);
        this.groups.markAsDirty();
    }

    public toggleFieldDefault(event: { target: HTMLInputElement }, groupIndex: number, fieldIndex: number) {
        const field = ((this.groups.at(groupIndex) as FormGroup).get("fields") as FormArray).at(
            fieldIndex
        ) as FormGroup;
        field.markAsDirty();
        const checked = event.target.checked;
        if (checked) {
            field.get("default").enable();
        } else {
            field.get("default").disable();
        }
    }

    public sanitizeSubmission(universe: Universe) {
        return Object.assign(
            {},
            universe,
            {
                collaborators: universe.collaborators.filter((c) => c.trim() !== ""),
            },
            {
                guide: {
                    groups: universe.guide.groups.map((g) => {
                        return {
                            fields: [
                                ...g.fields.map((f) => {
                                    let nv;
                                    const nf = Object.assign({}, f);
                                    if (f.type === CharacterFieldType.Options) {
                                        nv = ((f as CharacterGuideOptionsField).options as any)
                                            .split(",")
                                            .map((v) => v.trim())
                                            .filter((v) => v);
                                        (nf as CharacterGuideOptionsField).options = nv;
                                    }
                                    return nf;
                                }),
                            ],
                            name: g.name,
                        };
                    }),
                },
            }
        );
    }

    public onSaveChanges() {
        let universe = {
            ...(this.universeForm.value as Universe),
            owner: this.universeOwner,
        };
        // Sanitize values
        universe = this.sanitizeSubmission(universe);
        this.savedChanges.emit(universe);
    }

    public addCollaborator() {
        this.collaborators.push(new FormControl("", [Validators.email]));
    }

    public removeCollaborator(i) {
        this.collaborators.removeAt(i);
    }
}
