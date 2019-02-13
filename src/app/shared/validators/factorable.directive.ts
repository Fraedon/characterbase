import { AbstractControl } from "@angular/forms";

export const factorable = (factor: number) => {
    return (c: AbstractControl): { [key: string]: any } => {
        if (c.value % factor === 0) {
            return null;
        }
        return { factorable: { valid: false } };
    };
};
