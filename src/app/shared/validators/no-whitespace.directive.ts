import { AbstractControl, ValidatorFn } from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl) => {
        const trimmed = ((control.value as string) || "").trim();
        return trimmed.length === 0 ? { noWhitespace: true } : null;
    };
}
