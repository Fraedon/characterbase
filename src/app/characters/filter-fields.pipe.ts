import { Pipe, PipeTransform } from "@angular/core";

import { CharacterFieldType, CharacterGuideGroup } from "./characters.model";

@Pipe({
    name: "filterFields",
})
export class FilterFieldsPipe implements PipeTransform {
    public transform(groups: CharacterGuideGroup[]): any {
        return groups.reduce((acc, group) => {
            const fields = group.fields
                .filter(
                    (field) =>
                        field.type === CharacterFieldType.Number ||
                        field.type === CharacterFieldType.Progress ||
                        field.type === CharacterFieldType.Options ||
                        field.type === CharacterFieldType.Toggle
                )
                .reduce((acc2: string[], field) => {
                    acc2.push(field.name);
                    return acc2;
                }, []);
            acc[group.name] = fields;
            return acc;
        }, {});
    }
}
