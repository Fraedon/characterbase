import { Component, HostBinding, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { MarkdownComponent } from "ngx-markdown";
import { DynamicSizeType } from "src/app/shared/dynamic-size/dynamic-size.component";

import { CharacterField, CharacterFieldType, CharacterGuideField, ProgressBarColor } from "../characters.model";

@Component({
    selector: "cb-character-view-field",
    templateUrl: "./character-view-field.component.html",
    styleUrls: ["./character-view-field.component.scss"],
})
export class CharacterViewFieldComponent implements OnInit, OnChanges {
    @Input() public canViewHidden = false;
    @Input() public characterField: CharacterField;
    public CharacterFieldType = CharacterFieldType;
    @ViewChild("content") public content: HTMLParagraphElement | MarkdownComponent;
    public DynamicSizeType = DynamicSizeType;
    @Input() public guideField: CharacterGuideField;
    public hidden = false;
    @HostBinding("class") private classes = "card";

    public calculateProgressWidth() {
        return (this.characterField.value / this.guideField.meta["max"]) * 100;
    }

    public getProgressColor() {
        switch (this.guideField.meta["color"]) {
            case ProgressBarColor.Red:
                return "danger";
            case ProgressBarColor.Yellow:
                return "warning";
            case ProgressBarColor.Green:
                return "success";
            case ProgressBarColor.Teal:
                return "info";
            case ProgressBarColor.Gray:
                return "secondary";
            case ProgressBarColor.Dark:
                return "dark";
            default:
                return "primary";
        }
    }

    public ngOnChanges() {
        this.resetHidden();
    }

    public ngOnInit() {
        this.resetHidden();
        this.classes = `card field-${this.guideField.type} ${this.guideField.meta["bar"] ? "bar" : ""} ${
            this.guideField.meta["markdown"] ? "markdown" : ""
        }`;
    }

    public resetHidden() {
        if (this.characterField) {
            this.hidden = this.characterField.hidden;
        }
    }
}
