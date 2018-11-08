import { Component, Input } from "@angular/core";
import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-list",
    templateUrl: "./universe-list.component.html",
})
export class UniverseListComponent {
    @Input() universes: Universe[];

    public constructor() { }
}
