import { Component, ElementRef, forwardRef, HostBinding, Input } from "@angular/core";
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
    @Input() public name: string;
    @Input() public type: string;
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
        throw new Error("Method not implemented.");
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
