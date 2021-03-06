import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { parseFullName } from "parse-full-name";
import { Subscription } from "rxjs";
import { CharacterService } from "src/app/core/character.service";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";
import { factorable } from "src/app/shared/validators/factorable.directive";
import { maxLengthArray } from "src/app/shared/validators/max-length.directive";
import { minLengthArray } from "src/app/shared/validators/min-length.directive";
import { Universe } from "src/app/universes/shared/universe.model";

import {
    Character,
    CharacterFieldType,
    CharacterGuideDescriptionField,
    CharacterGuideField,
    CharacterGuideListField,
    CharacterGuideNumberField,
    CharacterGuideOptionsField,
    CharacterGuideProgressField,
    CharacterGuideTextField,
    getFormattedCharacterName,
    ParsedName,
} from "../characters.model";

@Component({
    selector: "cb-character-edit",
    templateUrl: "./character-edit.component.html",
    styleUrls: ["./character-edit.component.scss"],
})
export class CharacterEditComponent implements OnInit {
    public avatar: File | null | undefined = undefined;
    @Input() public character: Character;
    public characterForm: FormGroup;
    @Output() public deleted = new EventEmitter<null>();
    public deleteModalRef: BsModalRef;
    @Input() public mode: "create" | "edit";
    @Input() public reset: EventEmitter<null>;
    @Output() public saved = new EventEmitter<{ avatar?: File; data: Partial<Character> }>();
    @Output() public stateChange = new EventEmitter<string>();
    @Input() public status: FormStatus;
    @Input() public universe: Universe;

    public constructor(private modalService: BsModalService) {}

    public createFieldScaffold(field: CharacterGuideField) {
        const defaultValue = this.generateDefaultValue(field);
        return new FormGroup({
            value: new FormControl(defaultValue, this.generateValueValidators(field)),
            hidden: new FormControl(false),
            type: new FormControl(field.type),
        });
    }

    public createGroupScaffold() {
        return new FormGroup({
            fields: new FormGroup({}),
            hidden: new FormControl(false),
        });
    }

    public generateDefaultValue(field: CharacterGuideField) {
        switch (field.type) {
            case CharacterFieldType.Number:
                return (field.meta as CharacterGuideNumberField).min || 0;
            case CharacterFieldType.Toggle:
                return false;
            case CharacterFieldType.Progress:
                return (field.meta as CharacterGuideProgressField).min || 0;
            case CharacterFieldType.Options:
                return (field.meta as CharacterGuideOptionsField).multiple ? [] : "";
            case CharacterFieldType.List:
                return [];
            default:
                return "";
        }
    }

    public generateValueValidators(field: CharacterGuideField): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (field.required) {
            validators.push(Validators.required);
        }
        switch (field.type) {
            case CharacterFieldType.Text: {
                const meta = field.meta as CharacterGuideTextField;
                validators.push(Validators.minLength(meta.minLength));
                validators.push(Validators.maxLength(meta.maxLength));
                if (meta.pattern) {
                    validators.push(Validators.pattern(meta.pattern));
                }
                break;
            }
            case CharacterFieldType.Description: {
                const meta = field.meta as CharacterGuideDescriptionField;
                validators.push(Validators.minLength(meta.minLength));
                validators.push(Validators.maxLength(meta.maxLength));
                break;
            }
            case CharacterFieldType.Number: {
                const meta = field.meta as CharacterGuideNumberField;
                validators.push(Validators.min(meta.min));
                validators.push(Validators.max(meta.max));
                if (meta.tick) {
                    validators.push(factorable(meta.tick));
                }
                break;
            }
            case CharacterFieldType.Progress: {
                const meta = field.meta as CharacterGuideProgressField;
                validators.push(Validators.min(meta.min));
                validators.push(Validators.max(meta.max));
                if (meta.tick) {
                    validators.push(factorable(meta.tick));
                }
                break;
            }
            case CharacterFieldType.List: {
                const meta = field.meta as CharacterGuideListField;
                validators.push(minLengthArray(meta.minElements));
                validators.push(maxLengthArray(meta.maxElements));
            }
        }
        return validators;
    }

    public getAvatar() {
        if (this.character && this.character.images && this.character.images["avatar"]) {
            return this.character.images["avatar"];
        } else {
            return "";
        }
    }

    public getFormGroup(name: string) {
        return this.getFormGroups().get(name);
    }

    public getFormGroups() {
        return this.characterForm.get("fields.groups") as FormGroup;
    }

    public getGuideGroup(name: string) {
        return this.universe.guide.groups.find((g) => g.name === name);
    }

    public getParsedName() {
        const parsed = this.getMetaName().value as ParsedName;
        return getFormattedCharacterName(parsed);
    }

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.characterForm.invalid || this.characterForm.pristine) {
            return SubmitButtonState.Disabled;
        } else {
            return SubmitButtonState.Allowed;
        }
    }

    public getUniverseGroups() {
        return this.universe.guide.groups;
    }

    public ngOnInit() {
        this.reset.subscribe(() => {
            this.patchCharacter();
        });
        this.patchCharacter();
    }

    public onAvatarUpload(file: File | null) {
        this.avatar = file;
        this.characterForm.markAsDirty();
    }

    public onDelete() {
        if (this.deleteModalRef) {
            this.deleteModalRef.hide();
        }
        this.deleted.emit();
    }

    public onNameChange(name: string) {
        const parsed = parseFullName(name);
        this.getMetaName().patchValue({
            firstName: parsed.first,
            middleName: parsed.middle,
            lastName: parsed.last,
            nickname: parsed.nick,
        });
    }

    public onSubmit() {
        this.saved.emit({ data: this.characterForm.value, avatar: this.avatar });
    }

    public openModal(template: TemplateRef<any>) {
        this.deleteModalRef = this.modalService.show(template);
    }

    private getMetaName() {
        return this.characterForm.get("meta").get("name") as FormGroup;
    }

    private normalizeCharacter() {
        if (this.character.fields.groups == null) {
            this.character.fields.groups = {};
        }
        if (this.character.meta.nameHidden == null) {
            this.character.meta.nameHidden = false;
        }
        if (this.character.meta.name == null) {
            this.character.meta.name = {} as any;
        }
        Object.keys(this.character.fields.groups).forEach((gk) => {
            if (this.character.fields.groups[gk].fields) {
                Object.keys(this.character.fields.groups[gk].fields).forEach((fk) => {
                    if (this.character.fields.groups[gk].fields[fk] === null) {
                        this.character.fields.groups[gk].fields[fk] = {} as any;
                    }
                });
            } else {
                this.character.fields.groups[gk].fields = {} as any;
            }
        });
    }

    private patchCharacter() {
        this.resetForm();
        this.universe.guide.groups.forEach((group) => {
            const gScaffold = this.createGroupScaffold();
            group.fields.forEach((field) => {
                const fScaffold = this.createFieldScaffold(field);
                (gScaffold.get("fields") as FormGroup).setControl(field.name, fScaffold);
            });
            this.getFormGroups().setControl(group.name, gScaffold);
        });
        if (this.character) {
            this.normalizeCharacter();
            this.characterForm.patchValue(this.character);
            this.onNameChange(this.character.name);
        }
    }

    private patchFormStatus() {
        const markAsPristine = this.characterForm.markAsPristine;
        const markAsDirty = this.characterForm.markAsDirty;
        this.characterForm.markAsPristine = (opts: { onlySelf?: boolean }) => {
            markAsPristine.apply(this.characterForm, opts);
            this.stateChange.emit("pristine");
        };
        this.characterForm.markAsDirty = (opts: { onlySelf?: boolean }) => {
            markAsDirty.apply(this.characterForm, opts);
            this.stateChange.emit("dirty");
        };
    }

    private resetForm() {
        this.characterForm = new FormGroup({
            name: new FormControl("", [Validators.required]),
            tag: new FormControl(""),
            fields: new FormGroup({
                groups: new FormGroup({}),
            }),
            meta: new FormGroup({
                hidden: new FormControl(false),
                nameHidden: new FormControl(false),
                name: new FormGroup({
                    firstName: new FormControl(""),
                    middleName: new FormControl(""),
                    lastName: new FormControl(""),
                    nickname: new FormControl(""),
                    preferredName: new FormControl(""),
                }),
            }),
        });
        this.patchFormStatus();
        this.characterForm.markAsPristine();
    }
}
