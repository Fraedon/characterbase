import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { environment } from "src/environments/environment";

import { MetaUniverse } from "../universe.model";

@Component({
    selector: "cb-universe-sidebar",
    templateUrl: "./universe-sidebar.component.html",
    styleUrls: ["./universe-sidebar.component.scss"],
})
export class UniverseSidebarComponent {
    @HostBinding("class") public classes = "universe-list list-group list-group-flush";
    @Output() public logOut = new EventEmitter();
    @Input() public universes: MetaUniverse[];
    @Input() public userDisplayName: string;

    public version = environment.version;

    public constructor() {}

    public doLogOut() {
        this.logOut.emit();
    }
}
