import { Component, ElementRef, forwardRef, HostBinding, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "cb-select-control",
    templateUrl: "./select-control.component.html",
    styleUrls: ["./select-control.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectControlComponent),
            multi: true,
        },
    ],
})
export class SelectControlComponent implements ControlValueAccessor {
    public get controlId() {
        return `fc-${this.name.replace(" ", "-").toLowerCase()}`;
    }
    @Input() public autofocus: boolean;
    public disabled: boolean;
    @Input() public help: string;
    @Input() public horizontal = false;
    @Input() public labelToolbar: TemplateRef<any>;
    @Input() public labelToolbarContext: object;
    @Input() public name: string;
    @Input() public options: string[];
    @Input() public value: any;

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
        console.log(this.value);
        this.onChanged(this.value);
        this.onTouched();
    }

    public writeValue(obj: any): void {
        this.value = obj;
    }
}
