import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Universe } from "src/app/universes/shared/universe.model";

import { environment } from "../../../environments/environment";
import { CharacterReference } from "../characters.model";

@Component({
    selector: "cb-character-list",
    templateUrl: "./character-list.component.html",
    styleUrls: ["./character-list.component.scss"],
})
export class CharacterListComponent implements OnInit {
    @Input() public characters: CharacterReference[];
    public currIncludeHidden = true;
    public currSort = "nominal";
    @Input() public flush: boolean;
    @Output() public includeHidden = new EventEmitter<boolean>();
    @Output() public page = new EventEmitter<number>();
    public pageLimit = environment.characterPageLimit;
    @Output() public search = new EventEmitter<string>();
    @Output() public sort = new EventEmitter<"lexicographical" | "nominal">();
    @Input() public total: number;
    @Input() public universe: Universe;

    public constructor(private sanitizer: DomSanitizer) {}

    /*public genListBackgroundCSS(url?: string) {
        return this.sanitizer.bypassSecurityTrustStyle(
            `linear-gradient(to right, rgba(255, 255, 255, 1.0) 25%, rgba(255, 255, 255, 0.8))${
                url ? `, url(${url}) right` : ""
            }`,
        );
    }*/

    public getPageCount() {
        console.log(this.total, this.pageLimit, this.total / this.pageLimit);
        return Math.ceil(this.total / this.pageLimit);
    }

    public ngOnInit() {
        if (this.universe) {
            this.currSort = this.universe.settings.allowLexicographicalOrdering ? "lexicographical" : "nominal";
        }
    }

    public onPageChange(page: number) {
        this.page.emit(page);
    }
}
