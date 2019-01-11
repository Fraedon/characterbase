import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormStatus } from "src/app/shared/form-status.model";
import { noWhitespaceValidator } from "src/app/shared/validators/no-whitespace.directive";
import { Universe } from "src/app/universes/universe.model";
import {
    Character,
    CharacterFieldType,
    CharacterFieldValue,
    CharacterGuideFieldType,
    CharacterGuideGroup,
    CharacterGuideNumberField,
    CharacterGuideOptionsField,
    CharacterGuideTextField,
} from "../characters.model";

export interface CharacterFormGroup extends FormGroup {
    type: CharacterFieldType;
}

export interface CharacterFormField extends FormControl {
    guideMeta: CharacterGuideFieldType;
}

export enum CharacterEditMode {
    Create = 0,
    Edit = 1,
}

@Component({
    selector: "cb-character-edit-form",
    templateUrl: "./character-edit-form.component.html",
    styleUrls: ["./character-edit-form.component.scss"],
})
export class CharacterEditFormComponent implements OnInit {
    @Input() preload: Character;
    @Input() universe: Universe;
    @Input() status: FormStatus;
    @Input() mode: CharacterEditMode;
    @Input() editSuccess: EventEmitter<null>;
    @Output() edited = new EventEmitter<{ character: Partial<Character>; images: { [key: string]: File } }>();
    @Output() created = new EventEmitter<{ character: Partial<Character>; images: { [key: string]: File } }>();
    @Output() changes = new EventEmitter<boolean>();

    public CharacterEditMode = CharacterEditMode;
    public CharacterFieldType = CharacterFieldType;
    public characterForm = new FormGroup({
        fieldGroups: new FormArray([]),
        name: new FormControl("", [Validators.required, noWhitespaceValidator()]),
    });
    private _characterImages = {};
    public characterImages = {};
    public avatarImgPreview: SafeResourceUrl;
    public avatarImgFile: File;
    public avatarImgColor: string;
    public initialFieldDisplay = [];
    public formReady = false;

    public constructor(public _DomSanitizationService: DomSanitizer) {}

    public get canSubmit() {
        return this.characterForm.valid && !this.status.loading && this.characterForm.dirty;
    }

    private preloadControls(universe: Universe) {
        this.universe.guide.groups.forEach((group, i) => {
            this.fieldGroups.push(
                new FormGroup({
                    fields: new FormGroup({}),
                    name: new FormControl(group.name),
                })
            );
            group.fields.forEach((field) => {
                const validators = [];
                let normalDefault;
                if (field.required) {
                    validators.push(Validators.required);
                }
                switch (field.type) {
                    case CharacterFieldType.Reference:
                    case CharacterFieldType.List:
                        normalDefault = "";
                        break;
                    case CharacterFieldType.Progress:
                    case CharacterFieldType.Number:
                        normalDefault = (field as CharacterGuideNumberField).min;
                        validators.push(Validators.min((field as CharacterGuideNumberField).min));
                        validators.push(Validators.max((field as CharacterGuideNumberField).max));
                        break;
                    case CharacterFieldType.Options:
                        normalDefault = (field as CharacterGuideOptionsField).options[0];
                        break;
                    case CharacterFieldType.Description:
                    case CharacterFieldType.Text:
                        normalDefault = "";
                        validators.push(Validators.minLength((field as CharacterGuideTextField).minLength));
                        validators.push(Validators.maxLength((field as CharacterGuideTextField).maxLength));
                        break;
                    case CharacterFieldType.Toggle:
                        normalDefault = false;
                }
                const control = new FormGroup({
                    value: new FormControl(
                        field.default ? field.default : normalDefault,
                        validators
                    ) as CharacterFormField,
                }) as CharacterFormGroup;
                (control.get("value") as CharacterFormField).guideMeta = field;
                control.type = (control.get("value") as CharacterFormField).guideMeta.type;
                ((this.fieldGroups.controls[i] as FormGroup).controls["fields"] as FormGroup).addControl(
                    field.name,
                    control
                );
            });
        });
    }

    public entries(object: Object) {
        return Object.entries(object);
    }

    public genInputId(a: number, b: number) {
        return `cf-${a}-${b}`;
    }

    public trackFields(index: any, item: any) {
        return index;
    }

    public splitOptions(options: string) {
        return options.split(",");
    }

    public get fieldGroups() {
        return this.characterForm.controls.fieldGroups as FormArray;
    }

    public getFieldGroupControls() {
        return this.fieldGroups.controls as FormGroup[];
    }

    public getInnerGroupFieldsKV(group: FormGroup) {
        return Object.entries((group.get("fields") as FormGroup).controls).map((kv) => {
            return {
                key: kv[0],
                value: kv[1].get("value") as CharacterFormField,
            };
        });
    }

    public hideEmptyFields(sanitized: { name: string; fields: CharacterFieldValue[] }[]) {
        this.universe.guide.groups.forEach((group, i) => {
            group.fields.forEach((field, j) => {
                const inputGroup = sanitized.find((g) => g.name === group.name);
                if (!inputGroup) {
                    return;
                }
                const inputValue = inputGroup.fields[field.name];
                if (inputValue === undefined && !field.required) {
                    const fieldsControl = (this.fieldGroups.controls[i] as FormGroup).controls.fields as FormGroup;
                    fieldsControl.controls[field.name].disable();
                    // @ts-ignore
                    this.initialFieldDisplay[[i, j]] = true;
                }
            });
        });
    }

    public ngOnInit() {
        this.preloadControls(this.universe);
        if (this.preload) {
            const sanitized = this.serializePreload(this.preload);
            this.characterForm.patchValue(sanitized);
            this.hideEmptyFields(sanitized.fieldGroups);
        }

        this.formReady = true;

        this.characterForm.valueChanges.subscribe(() => {
            if (this.characterForm.dirty) {
                this.changes.emit(true);
            }
        });

        if (this.editSuccess) {
            this.editSuccess.subscribe(() => {
                this.characterForm.markAsPristine();
                this.characterImages = {};
            });
        }
    }

    public serializePreload(preload: Character) {
        return {
            ...preload,
            fieldGroups: preload.fieldGroups.map((g, i) => {
                const newFields = Object.assign(
                    {},
                    ...Object.keys(g.fields).map((k) => {
                        let v: { value: any } = g.fields[k] as any;
                        if (Array.isArray(v.value)) {
                            v.value = v.value.join(", ");
                        }
                        const fieldMeta = this.universe.guide.groups[i].fields.find(
                            (fieldGroup) => fieldGroup.name === k
                        );
                        if (fieldMeta) {
                            if (
                                fieldMeta.type === CharacterFieldType.Options &&
                                (fieldMeta as CharacterGuideOptionsField).multiple
                            ) {
                                v = { value: (v as { value: string }).value.split(", ").map((value) => value.trim()) };
                            }
                        }
                        return { [k]: v };
                    })
                );
                return { fields: newFields, name: g.name };
            }),
        };
    }

    public uploadPicture(key: string, image: File) {
        this.characterImages[key] = image;
        this._characterImages[key] = image;
        this.characterForm.markAsDirty();
    }

    public generatePictureKey(group: FormGroup, control: CharacterFormField) {
        return `${group.controls.name.value}_${control.guideMeta.name}`;
    }

    public uploadFormPicture(group: FormGroup, control: CharacterFormField, image: File) {
        const key = this.generatePictureKey(group, control);
        if (image === null) {
            control.parent.reset();
        } else {
            if (control.parent.disabled) {
                control.parent.enable();
            }
            control.setValue(key);
        }
        control.markAsDirty();
        this.uploadPicture(key, image);
    }

    public sanitizeSubmission(character: Character) {
        return Object.assign(character, {
            fieldGroups: character.fieldGroups.map((g, i) => {
                return {
                    ...g,
                    fields: Object.entries(g.fields)
                        .map((f, j) => {
                            let nv;
                            if (f[1]) {
                                if (this.universe.guide.groups[i] && this.universe.guide.groups[i].fields[j]) {
                                    const type = this.universe.guide.groups[i].fields[j].type;
                                    if (type === CharacterFieldType.List) {
                                        if (f[1].value instanceof String || typeof f[1].value === "string") {
                                            nv = {
                                                value: (f[1].value as string)
                                                    .split(",")
                                                    .map((v) => v.trim())
                                                    .filter((v) => v),
                                            };
                                        }
                                    }
                                }
                            }
                            return { [f[0]]: nv ? nv : f[1] };
                        })
                        .reduce((acc, x) => {
                            for (const key in x) {
                                if (x.hasOwnProperty(key)) {
                                    acc[key] = x[key];
                                }
                            }
                            return acc;
                        }, {}),
                };
            }),
            name: character.name.trim(),
        });
    }

    public onSubmit(e) {
        e.preventDefault();
        let character = this.characterForm.value as Partial<Character>;
        character = this.sanitizeSubmission(character as Character);
        if (this.mode === CharacterEditMode.Edit) {
            this.edited.emit({ character, images: this.characterImages });
        } else if (this.mode === CharacterEditMode.Create) {
            this.created.emit({ character, images: this.characterImages });
        }
    }

    public toggleFieldHidden(event: { target: HTMLInputElement }, index: number, fieldName: string) {
        const fields = (this.fieldGroups.controls[index] as FormGroup).controls.fields as FormGroup;
        fields.controls[fieldName].markAsDirty();
        if (event.target.checked) {
            if ((fields.controls[fieldName] as CharacterFormGroup).type === CharacterFieldType.Picture) {
                const key = this.generatePictureKey(
                    fields.parent as FormGroup,
                    fields.controls[fieldName].get("value") as CharacterFormField
                );
                this.characterImages[key] = this._characterImages[key];
            }
            fields.controls[fieldName].enable();
        } else {
            if ((fields.controls[fieldName] as CharacterFormGroup).type === CharacterFieldType.Picture) {
                this.characterImages[
                    this.generatePictureKey(
                        fields.parent as FormGroup,
                        fields.controls[fieldName].get("value") as CharacterFormField
                    )
                ] = null;
            }
            fields.controls[fieldName].disable();
        }
    }
}
