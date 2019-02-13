import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { finalize, first } from "rxjs/operators";
import { CharacterFieldType, CharacterGuide, ProgressBarColor } from "src/app/characters/characters.model";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";
import { minLengthArray } from "src/app/shared/validators/min-length.directive";
import { uniqueControlNamesValidator } from "src/app/shared/validators/unique-groups.directive";

import { UniverseEditService } from "../../shared/universe-edit.service";
import { Universe } from "../../shared/universe.model";

@Component({
    selector: "cb-universe-edit-guide",
    templateUrl: "./universe-edit-guide.component.html",
    styleUrls: ["./universe-edit-guide.component.scss"],
})
export class UniverseEditGuideComponent implements OnInit, CanComponentDeactivate {
    public guideForm = new FormGroup({
        groups: new FormArray([], [uniqueControlNamesValidator()]),
    });
    public status: FormStatus = { loading: false };
    public universe: Universe;

    public constructor(private route: ActivatedRoute, private universeEditService: UniverseEditService) {}

    public addField(type: CharacterFieldType, group: FormGroup) {
        const field = this.createFieldScaffold(type);
        (group.get("fields") as FormArray).push(field);
        this.guideForm.markAsDirty();
    }

    public addGroup() {
        const group = this.createGroupScaffold();
        this.getGuideGroups().push(group);
        this.guideForm.markAsDirty();
    }

    public canDeactivate() {
        if (this.guideForm.dirty) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public deleteField(group: FormGroup, index: number) {
        (group.get("fields") as FormArray).removeAt(index);
        this.guideForm.markAsDirty();
    }

    public deleteGroup(index: number) {
        this.getGuideGroups().removeAt(index);
        this.guideForm.markAsDirty();
    }

    public getGuideGroups() {
        return this.guideForm.get("groups") as FormArray;
    }

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.guideForm.valid && this.guideForm.dirty) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public moveField(group: FormGroup, currentIndex: number, toIndex: number) {
        const fields = group.get("fields") as FormArray;
        const old = fields.at(currentIndex);
        fields.removeAt(currentIndex);
        fields.insert(toIndex, old);
        this.guideForm.markAsDirty();
    }

    public moveGroup(currentIndex: number, toIndex: number) {
        const old = this.getGuideGroups().at(currentIndex);
        this.getGuideGroups().removeAt(currentIndex);
        this.getGuideGroups().insert(toIndex, old);
        this.guideForm.markAsDirty();
    }

    public ngOnInit() {
        this.universeEditService.getUniverse().subscribe((u) => {
            this.universe = u;
            this.patchGuide(this.universe.guide);
        });
    }

    public onSubmit() {
        this.status = { loading: true, error: undefined, success: undefined };

        const payload = { guide: this.guideForm.value } as Partial<Universe>;
        this.universeEditService
            .update(this.universe.id, payload)
            .pipe(
                finalize(() => {
                    this.status.loading = false;
                    this.guideForm.markAsPristine();
                }),
            )
            .subscribe(
                (u) => {
                    this.status.success = "Successfully updated guide";
                    this.universeEditService.setUniverse(u);
                    this.universe.guide = u.guide;
                    this.patchGuide(this.universe.guide);
                },
                (err) => {
                    this.status.error = err;
                },
            );
    }

    private createFieldScaffold(type: CharacterFieldType) {
        const field = new FormGroup({
            name: new FormControl("", [Validators.required]),
            description: new FormControl(""),
            type: new FormControl(type, [Validators.required]),
            required: new FormControl(true),
        });
        switch (type) {
            case CharacterFieldType.Text:
                field.addControl(
                    "meta",
                    new FormGroup({
                        pattern: new FormControl(""),
                        minLength: new FormControl(0, [Validators.minLength(0)]),
                        maxLength: new FormControl(80),
                    }),
                );
                break;
            case CharacterFieldType.Description:
                field.addControl(
                    "meta",
                    new FormGroup({
                        markdown: new FormControl(true),
                        minLength: new FormControl(0, [Validators.minLength(0)]),
                        maxLength: new FormControl(2000),
                    }),
                );
                break;
            case CharacterFieldType.Number:
                field.addControl(
                    "meta",
                    new FormGroup({
                        float: new FormControl(false),
                        min: new FormControl(0),
                        max: new FormControl(100),
                        tick: new FormControl(0, [Validators.min(0)]),
                    }),
                );
                break;
            case CharacterFieldType.Progress:
                field.addControl(
                    "meta",
                    new FormGroup({
                        bar: new FormControl(true),
                        color: new FormControl(ProgressBarColor.Blue),
                        min: new FormControl(0),
                        max: new FormControl(100),
                        tick: new FormControl(0, [Validators.min(0)]),
                    }),
                );
                break;
            case CharacterFieldType.Options:
                field.addControl(
                    "meta",
                    new FormGroup({
                        multiple: new FormControl(false),
                        options: new FormControl([]),
                    }),
                );
                break;
            case CharacterFieldType.List:
                field.addControl(
                    "meta",
                    new FormGroup({
                        minElements: new FormControl(0, [Validators.min(0)]),
                        maxElements: new FormControl(10),
                    }),
                );
                break;
            default:
                field.addControl("meta", new FormGroup({}));
        }
        return field;
    }

    private createGroupScaffold() {
        return new FormGroup({
            name: new FormControl("", [Validators.required]),
            fields: new FormArray([], [uniqueControlNamesValidator(), minLengthArray(1)]),
            required: new FormControl(true),
        });
    }

    private patchGuide(guide: CharacterGuide) {
        this.getGuideGroups().controls = [];
        guide.groups.forEach((group) => {
            const guideGroup = this.createGroupScaffold();
            group.fields.forEach((field) => {
                const guideField = this.createFieldScaffold(field.type);
                (guideGroup.get("fields") as FormArray).push(guideField);
            });
            this.getGuideGroups().push(guideGroup);
        });

        this.guideForm.patchValue(guide);
    }
}
