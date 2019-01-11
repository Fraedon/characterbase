import { Component, Input } from "@angular/core";

export enum DynamicSizeType {
    String = 0,
    Number = 1,
}

@Component({
    selector: "cb-dynamic-size",
    templateUrl: "./dynamic-size.component.html",
    styleUrls: ["./dynamic-size.component.scss"],
})
export class DynamicSizeComponent {
    @Input() value: number | string;
    @Input() type: DynamicSizeType;

    public DynamicSizeType = DynamicSizeType;
}
