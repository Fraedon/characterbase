import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { Universe } from "src/app/universes/universe.model";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {
    CharacterFieldType,
    CharacterGuideTextField,
    CharacterGuideNumberField,
    CharacterGuideFieldType,
    CharacterGuideOptionsField,
} from "../characters.model";

export interface CharacterFormGroup extends FormGroup {
    type: CharacterFieldType;
}

export interface CharacterFormField extends FormControl {
    guideMeta: CharacterGuideFieldType;
}

@Component({
    selector: "cb-character-edit-form",
    templateUrl: "./character-edit-form.component.html",
    styleUrls: ["./character-edit-form.component.scss"],
})
export class CharacterEditFormComponent implements OnInit {
    @Input() universe: Universe;

    public CharacterFieldType = CharacterFieldType;
    public characterForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        fieldGroups: new FormArray([]),
    });
    public avatarImgSrc: SafeResourceUrl;

    public constructor(public _DomSanitizationService: DomSanitizer) {}

    private preloadControls(universe: Universe) {
        if (universe.advanced.allowAvatar) {
            this.characterForm.addControl("avatarUrl", new FormControl(null));
        }
        this.universe.guide.groups.forEach((group, i) => {
            this.fieldGroups.push(
                new FormGroup({
                    name: new FormControl(group.name),
                    fields: new FormGroup({}),
                })
            );
            group.fields.forEach((field) => {
                const validators = [];
                let normalDefault;
                if (field.required) {
                    validators.push(Validators.required);
                }
                switch (field.type) {
                    case CharacterFieldType.Text:
                    case CharacterFieldType.Description:
                        normalDefault = "";
                        validators.push(
                            Validators.minLength(
                                (field as CharacterGuideTextField).minLength
                            )
                        );
                        validators.push(
                            Validators.maxLength(
                                (field as CharacterGuideTextField).maxLength
                            )
                        );
                        break;
                    case CharacterFieldType.Options:
                        normalDefault = (field as CharacterGuideOptionsField).options.split(
                            ","
                        )[0];
                        break;
                    case CharacterFieldType.List:
                    case CharacterFieldType.Reference:
                        normalDefault = "";
                        break;
                    case CharacterFieldType.Number:
                    case CharacterFieldType.Progress:
                        normalDefault = 0;
                        validators.push(
                            Validators.min(
                                (field as CharacterGuideNumberField).min
                            )
                        );
                        validators.push(
                            Validators.max(
                                (field as CharacterGuideNumberField).max
                            )
                        );
                        break;
                    case CharacterFieldType.Toggle:
                        normalDefault = false;
                }
                const control = new FormControl(
                    field.default ? field.default : normalDefault,
                    validators
                ) as CharacterFormField;
                control.guideMeta = field;
                ((this.fieldGroups.controls[i] as FormGroup).controls[
                    "fields"
                ] as FormGroup).addControl(field.name, control);
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

    public ngOnInit() {
        this.preloadControls(this.universe);
        console.log(this.characterForm);
    }

    public onUploadAvatar(e: Event) {
        if (this.avatarImgSrc) {
            URL.revokeObjectURL(this.avatarImgSrc as string);
        }
        const files = (e.target as HTMLInputElement).files;
        if (files[0]) {
            const file = files[0];
            this.avatarImgSrc = this._DomSanitizationService.bypassSecurityTrustResourceUrl(
                URL.createObjectURL(file)
            );
        }
    }

    public toggleFieldHidden(
        event: { target: HTMLInputElement },
        index: number,
        fieldName: string
    ) {
        const fields = (this.fieldGroups.controls[index] as FormGroup).controls
            .fields as FormGroup;
        fields.controls[fieldName].markAsDirty();
        if (event.target.checked) {
            fields.controls[fieldName].enable();
        } else {
            fields.controls[fieldName].disable();
        }
    }
}
