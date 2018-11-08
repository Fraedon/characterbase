import { Component, Input } from "@angular/core";

@Component({
    selector: "cb-title-divider",
    templateUrl: "./title-divider.component.html",
})
export class TitleDividerComponent {
    @Input() text: string;
}
