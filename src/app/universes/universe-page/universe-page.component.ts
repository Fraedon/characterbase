import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    exhaustMap,
    filter,
    first,
    map,
    mergeMap,
    skip,
    tap,
    throttleTime,
} from "rxjs/operators";
import { User } from "src/app/auth/shared/user.model";
import { MetaCharacter } from "src/app/characters/character-resolver.service";
import { CharacterReference, CharacterSort } from "src/app/characters/characters.model";
import { CharacterStateService } from "src/app/characters/shared/character-state.service";
import { AuthService } from "src/app/core/auth.service";
import { CharacterQueryResult, CharacterService } from "src/app/core/character.service";
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
    ) {}

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
                this.descriptionHidden = false;

                this.characters$ = this.characterStateService.getReferences();
                this.universe$ = this.universeStateService
                    .getUniverses()
                    .pipe(map((universes) => universes.find((u) => u.id === data.universe.id)));
                this.collaborators = data.collaborators;

                this.searchSub = this.search$
                    .asObservable()
                    .pipe(
                        skip(1),
                        debounceTime(300),
                        map((q) => q.trim()),
                        distinctUntilChanged(),
                        filter((q) => q.length > 2 || q === ""),
                        exhaustMap((q) =>
                            this.characterService.getCharacters(data.universe.id, { page: this.searchPage, query: q }),
                        ),
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

    public onPage(page: number) {
        this.universe$.pipe(first()).subscribe((u) => {
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
        });
    }

    public onSearch(input: string) {
        this.searchQuery = input;
        this.search$.next(input);
    }

    public toggleDescription() {
        if (this.canToggleDescription) {
            this.descriptionHidden = !this.descriptionHidden;
        }
    }
}
