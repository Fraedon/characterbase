import { Pipe, PipeTransform } from "@angular/core";

import { CharacterGuideGroup } from "./characters.model";

@Pipe({
    name: "guideSort",
})
export class GuideSortPipe implements PipeTransform {
    public transform(value: Array<{ key: string; value: any }>, guideGroup?: CharacterGuideGroup, groupIndex?: number): any {
        const sortedValues = [];
        guideGroup[groupIndex].fields.forEach((f) => {
            let val = value.find((v) => v.key === f.name);
            if (!val) {
                if (f.required) {
                    val = { key: f.name, value: undefined };
                } else {
                    return;
                }
            }
            sortedValues.push(val);
        });
        return sortedValues;
    }
}
