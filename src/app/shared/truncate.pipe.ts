import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "truncate",
})
export class TruncatePipe implements PipeTransform {
    public transform(value: string, limit: number): string {
        if (value.length > limit) {
            return value.substr(0, limit) + "…";
        }
        return value;
    }
}
