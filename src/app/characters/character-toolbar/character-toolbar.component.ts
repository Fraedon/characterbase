import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, throttleTime } from "rxjs/operators";

import { Character, CharacterFieldType, CharacterGuideGroup, CharacterSort } from "../characters.model";

export interface CharactersQuery {
    filter?: string;
    page: {
        after?: DocumentSnapshot<Character>;
        before?: DocumentSnapshot<Character>;
        count: number;
        direction: -1 | 1;
    };
    search?: string;
    sort: CharacterSort;
}

@Component({
    selector: "cb-character-toolbar",
    templateUrl: "./character-toolbar.component.html",
    styleUrls: ["./character-toolbar.component.scss"],
})
export class CharacterToolbarComponent {
    public CharacterSort = CharacterSort;
    @Input() public guideGroups: CharacterGuideGroup[];
    @Input() public query: CharactersQuery;
    @Output() public queryChange = new EventEmitter<CharactersQuery>();
    public searchForm = new FormGroup({});
    @HostBinding("class") private classes = "btn-toolbar mb-3";

    public constructor(private router: Router) {}

    public changeQuery(newQuery: Partial<CharactersQuery>) {
        // this.query = { ...this.query, ...newQuery };
        // this.queryChange.emit(this.query);
        const query = { ...this.query, ...newQuery };
        const { filter, sort } = query;
        console.log(query);
        this.router.navigate([], {
            queryParams: { s: sort === CharacterSort.Name ? undefined : sort, f: filter || undefined },
            queryParamsHandling: "merge",
        });
    }

    public onSearch(searchValue: string) {
        // this.sortChange$.next({ ...this.sortQuery, search: searchValue });
    }
}
