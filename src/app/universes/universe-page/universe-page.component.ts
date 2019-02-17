import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, exhaustMap, map, skip, tap } from "rxjs/operators";
import { User } from "src/app/auth/shared/user.model";
import { MetaCharacter } from "src/app/characters/character-resolver.service";
import { CharacterReference, CharacterSort } from "src/app/characters/characters.model";
import { CharacterStateService } from "src/app/characters/shared/character-state.service";
import { AuthService } from "src/app/core/auth.service";
import { CharacterQuery, CharacterQueryResult, CharacterService } from "src/app/core/character.service";
import { UniverseService } from "src/app/core/universe.service";

import { CollaboratorRole } from "../shared/collaborator-role.enum";
import { Collaborator } from "../shared/collaborator.model";
import { UniverseStateService } from "../shared/universe-state.service";
import { Universe } from "../shared/universe.model";

@Component({
    selector: "cb-universe-page",
    templateUrl: "./universe-page.component.html",
    styleUrls: ["./universe-page.component.scss"],
})
export class UniversePageComponent implements OnInit, OnDestroy {
    public characters$: Observable<CharacterReference[]>;
    public collaborators: Collaborator[];
    public descriptionHidden = true;
    public search$ = new BehaviorSubject<string>("");
    public totalCharacters = 0;
    public universe$: Observable<Universe>;
    public user: User;
    private getQuery$: BehaviorSubject<CharacterQuery>;
    private searchPage = 0;
    private searchQuery = "";
    private searchSub: Subscription;

    public constructor(
        private authService: AuthService,
        public route: ActivatedRoute,
        private titleService: Title,
        private router: Router,
        private characterService: CharacterService,
        private characterStateService: CharacterStateService,
        private universeStateService: UniverseStateService,
    ) {
        this.getQuery$ = new BehaviorSubject<CharacterQuery>({
            page: this.searchPage,
            query: this.searchQuery,
            includeHidden: true,
            sort: "nominal",
        });
    }

    public canToggleDescription(description: string) {
        return description.length > 240;
    }

    public getOwner() {
        return this.collaborators.find((c) => c.role === CollaboratorRole.Owner);
    }

    public isOwner() {
        return this.getOwner().user.id === this.user.id;
    }

    public ngOnDestroy() {
        this.searchSub.unsubscribe();
    }

    public ngOnInit() {
        this.route.data.subscribe(
            (data: { characters: CharacterQueryResult; collaborators: Collaborator[]; universe: Universe }) => {
                this.searchPage = data.characters.page;
                this.totalCharacters = data.characters.total;

                this.titleService.setTitle(data.universe.name);
                this.descriptionHidden = true;

                this.characters$ = this.characterStateService.getReferences();
                this.universe$ = this.universeStateService
                    .getUniverses()
                    .pipe(map((universes) => universes.find((u) => u.id === data.universe.id)));
                this.collaborators = data.collaborators;

                this.searchSub = this.getQuery$
                    .asObservable()
                    .pipe(
                        skip(1),
                        debounceTime(300),
                        map((q) => ({ ...q, query: q.query.trim(), page: q.page > 1 ? q.page - 1 : 0 })),
                        distinctUntilChanged(),
                        exhaustMap((q) => this.characterService.getCharacters(data.universe.id, q)),
                        tap((r) => {
                            this.totalCharacters = r.total;
                            this.searchPage = r.page;
                        }),
                        map((r) => r.characters),
                    )
                    .subscribe((r) => {
                        this.characterStateService.clearReferences();
                        this.characterStateService.addReferences(...r);
                    });
            },
        );
        this.authService.getUser().subscribe((user) => {
            this.user = user;
        });
    }

    public onIncludeHidden(includeHidden: boolean) {
        this.getQuery$.next({ ...this.getQuery$.value, includeHidden });
    }

    public onPage(page: number) {
        /*this.universe$.pipe(first()).subscribe((u) => {
            this.characterService
                .getCharacters(u.id, { page: page - 1, query: this.searchQuery })
                .pipe(
                    tap((r) => {
                        this.totalCharacters = r.total;
                        this.searchPage = r.page;
                    }),
                    map((r) => r.characters),
                )
                .subscribe((r) => {
                    this.characterStateService.clearReferences();
                    this.characterStateService.addReferences(...r);
                });
        });*/
        this.getQuery$.next({ ...this.getQuery$.value, page });
    }

    public onSearch(input: string) {
        this.searchQuery = input;
        this.getQuery$.next({ ...this.getQuery$.value, query: input });
    }

    public onSort(sort: "lexicographical" | "nominal") {
        this.getQuery$.next({ ...this.getQuery$.value, sort });
    }

    public toggleDescription() {
        if (this.canToggleDescription) {
            this.descriptionHidden = !this.descriptionHidden;
        }
    }
}
