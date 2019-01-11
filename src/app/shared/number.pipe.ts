import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "number",
})
export class NumberPipe implements PipeTransform {
    public transform(value: string): number {
        return Number.parseInt(value, 10);
    }
}
