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
    public DynamicSizeType = DynamicSizeType;
    @Input() public type: DynamicSizeType;
    @Input() public value: number | string;
}
