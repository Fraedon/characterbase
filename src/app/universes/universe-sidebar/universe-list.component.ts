import { Component, Input } from "@angular/core";
import { MetaUniverse } from "../universe.model";

@Component({
    selector: "cb-universe-list",
    templateUrl: "./universe-list.component.html",
    styleUrls: ["./universe-list.component.scss"],
})
export class UniverseListComponent {
    @Input() universes: MetaUniverse[];

    public constructor() {}
}
