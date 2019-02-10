import { FormArray, FormGroup, ValidatorFn } from "@angular/forms";

// This validator ensures control names remain unique
export function uniqueControlNamesValidator(): ValidatorFn {
    return (groups: FormArray) => {
        const groupNames = new Set();
        let failedName: string;
        groups.controls.forEach((group: FormGroup) => {
            const name = group.get("name").value;
            if (groupNames.has(name)) {
                failedName = name;
            }
            groupNames.add(name);
        });
        return failedName ? { uniqueGroups: failedName } : null;
    };
}
