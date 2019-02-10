import { Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: "cb-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    @Input() public content: TemplateRef<any>;
    @Input() public leading: TemplateRef<any>;
    @Input() public title: string;
    @Input() public trailing: TemplateRef<any>;
}
