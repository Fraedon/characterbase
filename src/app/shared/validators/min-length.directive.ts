import { AbstractControl } from "@angular/forms";

export const minLengthArray = (min: number) => {
    return (c: AbstractControl): { [key: string]: any } => {
        if (c.value.length >= min) {
            return null;
        }
        return { minLengthArray: { valid: false } };
    };
};
