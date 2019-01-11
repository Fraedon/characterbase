import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { distinctUntilChanged, map, mergeMap, tap, throttleTime } from "rxjs/operators";
import { UserProfile } from "src/app/auth/shared/auth.model";
import { CharacterListMode } from "src/app/characters/character-list/character-list.component";
import { MetaCharacter } from "src/app/characters/character-resolver.service";
import { CharactersQuery } from "src/app/characters/character-toolbar/character-toolbar.component";
import { CharacterSort } from "src/app/characters/characters.model";
import { CharacterService } from "src/app/core/character.service";
import { UniverseService } from "src/app/core/universe.service";
import { UserService } from "src/app/core/user.service";

import { MetaUniverse } from "../universe.model";

export interface UniverseCharactersSearchQuery {
    query: CharactersQuery;
    universeId: string;
}

@Component({
    selector: "cb-universe-page",
    templateUrl: "./universe-page.component.html",
    styleUrls: ["./universe-page.component.scss"],
})
export class UniversePageComponent implements OnInit {
    public CharacterListMode = CharacterListMode;
    public characters$: Observable<MetaCharacter[]>;
    public charactersQuery: CharactersQuery = {
        sort: CharacterSort.Name,
        filter: "",
        page: { direction: 1, after: undefined, before: undefined, count: 0 },
    };
    public owner$: Observable<string>;
    public query$: Observable<CharactersQuery>;
    public universe$: Observable<MetaUniverse>;
    private query = new BehaviorSubject<CharactersQuery>(this.charactersQuery);
    private universe = new BehaviorSubject<string>(undefined);

    public constructor(
        private userService: UserService,
        public route: ActivatedRoute,
        private titleService: Title,
        private characterService: CharacterService,
        private universeService: UniverseService,
        private router: Router
    ) {}

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            const universeId = params["universeId"];
            this.universe.next(universeId);
        });

        this.route.queryParams.subscribe((queryParams) => {
            const before = queryParams["b"];
            const after = queryParams["a"];
            const direction = before ? -1 : after ? 1 : 1;
            const sort = queryParams["s"] ? queryParams["s"] : CharacterSort.Name;
            const filter = queryParams["f"] || "";
            const count = queryParams["c"] || 0;
            const query: CharactersQuery = { page: { direction, before, after, count }, sort, filter };
            console.log(query);
            this.query.next(query);
        });

        this.query$ = this.query.pipe(distinctUntilChanged());
        this.universe$ = this.universe.pipe(
            mergeMap((id) => this.universeService.getUniverse(id)),
            tap((universe) => {
                this.titleService.setTitle(universe.data.name);
            })
        );
        this.characters$ = this.universe.pipe(
            mergeMap((id) => this.query.pipe(map((query) => ({ query, id })))),
            mergeMap((data) => this.characterService.getCharactersFromUniverse(data.id, data.query, true))
        );
        this.owner$ = this.universe$.pipe(
            mergeMap((universe) => this.userService.user.map((user) => ({ user, universe }))),
            map((data) => (data.user.uid === data.universe.data.owner.id ? "you" : data.universe.data.owner.name))
        );
    }
}
