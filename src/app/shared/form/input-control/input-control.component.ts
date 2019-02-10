import { Component, ElementRef, forwardRef, HostBinding, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "cb-input-control",
    templateUrl: "./input-control.component.html",
    styleUrls: ["./input-control.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputControlComponent),
            multi: true,
        },
    ],
})
export class InputControlComponent implements ControlValueAccessor {
    public get controlId() {
        return `fc-${this.name.replace(" ", "-").toLowerCase()}`;
    }
    @Input() public autofocus: boolean;
    public disabled: boolean;
    @Input() public help: string;
    @Input() public horizontal = false;
    public innerValue: any = "";
    @Input() public labelToolbar: TemplateRef<any>;
    @Input() public labelToolbarContext: object;
    @Input() public list = false;
    @Input() public name: string;
    @Input() public size: "large" | "normal" | "small";
    @Input() public type: string;
    @Input() public value: any;

    public getSize() {
        switch (this.size) {
            case "large":
                return "form-control-lg";
            case "small":
                return "form-control-sm";
            default:
                return "";
        }
    }

    public onChanged = (value: any) => {};
    public onTouched = () => {};

    public registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public setValue(value: any) {
        if (this.list) {
            this.value = (value as string).split(",").map((v) => v.trim());
        } else if (this.type === "number") {
            this.value = Number.parseInt(value, 10);
        } else {
            this.value = value;
        }
        this.onChanged(this.value);
        this.onTouched();
    }

    public writeValue(obj: any): void {
        if (this.list) {
            this.innerValue = (obj as string[]).join(", ");
        } else {
            this.innerValue = obj;
        }
        this.value = obj;
    }
}
