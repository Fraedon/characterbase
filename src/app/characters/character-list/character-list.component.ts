import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Universe } from "src/app/universes/shared/universe.model";

import { environment } from "../../../environments/environment";
import { CharacterReference } from "../characters.model";

@Component({
    selector: "cb-character-list",
    templateUrl: "./character-list.component.html",
    styleUrls: ["./character-list.component.scss"],
})
export class CharacterListComponent {
    @Input() public characters: CharacterReference[];
    @Input() public flush: boolean;
    @Output() public page = new EventEmitter<number>();
    public pageLimit = environment.characterPageLimit;
    @Output() public search = new EventEmitter<string>();
    @Input() public total: number;
    @Input() public universe: Universe;

    public constructor(private sanitizer: DomSanitizer) {}

    public genListBackgroundCSS(url?: string) {
        return this.sanitizer.bypassSecurityTrustStyle(
            `linear-gradient(to right, rgba(255, 255, 255, 1.0) 25%, rgba(255, 255, 255, 0.8))${
                url ? `, url(${url}) right` : ""
            }`,
        );
    }

    public getPageCount() {
        console.log(this.total, this.pageLimit, this.total / this.pageLimit);
        return Math.ceil(this.total / this.pageLimit);
    }
}
