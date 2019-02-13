import { AbstractControl } from "@angular/forms";

export const maxLengthArray = (min: number) => {
    return (c: AbstractControl): { [key: string]: any } => {
        if (c.value.length <= min) {
            return null;
        }
        return { maxLengthArray: { valid: false } };
    };
};
