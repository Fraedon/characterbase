import { Pipe, PipeTransform } from "@angular/core";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Timestamp {
    toDate: () => Date;
}

@Pipe({
    name: "relativeTime",
})
export class RelativeTimePipe implements PipeTransform {
    transform(value: Timestamp): any {
        const date = value.toDate();
        // @ts-ignore
        return dayjs().to(dayjs(date));
    }
}
