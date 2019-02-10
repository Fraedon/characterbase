import { Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: "cb-title-divider",
    templateUrl: "./title-divider.component.html",
})
export class TitleDividerComponent {
    @Input() public dividerToolbar: TemplateRef<any>;
    @Input() public text: string;
}
