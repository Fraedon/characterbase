import { Component, HostBinding, Output, EventEmitter, Input } from "@angular/core";
import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-sidebar",
    templateUrl: "./universe-sidebar.component.html",
    styleUrls: ["./universe-sidebar.component.scss"],
})
export class UniverseSidebarComponent {
    @HostBinding("class.universe-list") _universeListClass = true;
    @HostBinding("class.list-group") _listGroupClass = true;
    @HostBinding("class.list-group-flush") _listGroupFlushClass = true;

    @Input() userEmail: string;
    @Input() userUniverses: Universe[];
    @Output() logOut = new EventEmitter();

    public constructor() { }

    public onLogOut() {
        this.logOut.emit();
    }
}
