import { Component, ElementRef, forwardRef, HostBinding, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "cb-checkbox-control",
    templateUrl: "./checkbox-control.component.html",
    styleUrls: ["./checkbox-control.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxControlComponent),
            multi: true,
        },
    ],
})
export class CheckboxControlComponent implements ControlValueAccessor {
    public get controlId() {
        return `fc-${this.name.replace(" ", "-").toLowerCase()}`;
    }
    @Input() public autofocus: boolean;
    @Input() public compressed = false;
    public disabled: boolean;
    @Input() public help: string;
    @Input() public horizontal = false;
    @Input() public label: string;
    @Input() public labelToolbar: TemplateRef<any>;
    @Input() public labelToolbarContext: object;
    @Input() public name: string;
    @Input() public size: "large" | "normal" | "small";
    @Input() public value = false;

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
        console.log(value);
        this.value = value;
        this.onChanged(value);
        this.onTouched();
    }

    public writeValue(obj: any): void {
        if (obj) {
            this.value = obj;
        }
    }
}
