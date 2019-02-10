import { Component, ElementRef, forwardRef, HostBinding, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "cb-textarea-control",
    templateUrl: "./textarea-control.component.html",
    styleUrls: ["./textarea-control.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaControlComponent),
            multi: true,
        },
    ],
})
export class TextAreaControlComponent implements ControlValueAccessor {
    public get controlId() {
        return `fc-${this.name.replace(" ", "-").toLowerCase()}`;
    }
    @Input() public autofocus: boolean;
    public disabled: boolean;
    @Input() public help: TemplateRef<any>;
    @Input() public horizontal: boolean;
    @Input() public labelToolbar: TemplateRef<any>;
    @Input() public labelToolbarContext: object;
    @Input() public name: string;
    @Input() public rows: number;
    @Input() public size: "large" | "normal" | "small";
    @Input() public value = "";

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
