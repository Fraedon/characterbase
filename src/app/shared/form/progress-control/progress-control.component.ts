import { Component, ElementRef, forwardRef, HostBinding, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "cb-progress-control",
    templateUrl: "./progress-control.component.html",
    styleUrls: ["./progress-control.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProgressControlComponent),
            multi: true,
        },
    ],
})
export class ProgressControlComponent implements ControlValueAccessor {
    public get controlId() {
        return `fc-${this.name.replace(" ", "-").toLowerCase()}`;
    }
    @Input() public autofocus: boolean;
    public disabled: boolean;
    @Input() public help: TemplateRef<any>;
    @Input() public labelToolbar: TemplateRef<any>;
    @Input() public labelToolbarContext: object;
    @Input() public max: number;
    @Input() public min: number;
    @Input() public name: string;
    @Input() public rows: number;
    @Input() public size: "large" | "normal" | "small";
    @Input() public step: number;
    @Input() public value = 0;

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
        this.value = Number.parseFloat(value);
        this.onChanged(this.value);
        this.onTouched();
    }

    public writeValue(obj: any): void {
        if (obj) {
            this.value = Number.parseFloat(obj);
        }
    }
}
