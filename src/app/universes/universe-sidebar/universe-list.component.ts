import { Component, Input } from "@angular/core";

import { Universe, UniverseReference } from "../shared/universe.model";

@Component({
    selector: "cb-universe-list",
    templateUrl: "./universe-list.component.html",
    styleUrls: ["./universe-list.component.scss"],
})
export class UniverseListComponent {
    @Input() public universes: UniverseReference[];

    public constructor() {}

    public getGlobe(i: number) {
        if (i % 4 === 0) {
            return "globe-americas";
        } else if (i % 3 === 0) {
            return "globe-asia";
        } else if (i % 2 === 0) {
            return "globe-europe";
        } else {
            return "globe-africa";
        }
    }
}
