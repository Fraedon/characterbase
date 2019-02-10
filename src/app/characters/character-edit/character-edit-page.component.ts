import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { finalize, first, map, tap } from "rxjs/operators";
import { CharacterService } from "src/app/core/character.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { UniverseStateService } from "src/app/universes/shared/universe-state.service";
import { Universe } from "src/app/universes/shared/universe.model";

import { Character } from "../characters.model";
import { CharacterStateService } from "../shared/character-state.service";

@Component({
    selector: "cb-character-edit-page",
    templateUrl: "character-edit-page.component.html",
    styleUrls: ["./character-edit-page.component.scss"],
})
export class CharacterEditPageComponent implements OnInit, CanComponentDeactivate {
    public character$: Observable<Character>;
    public characterForm = new FormGroup({});
    public formState: "dirty" | "pristine";
    public reset = new EventEmitter<null>();
    public status: FormStatus = { loading: false };
    public universe$: Observable<Universe>;

    public constructor(
        private route: ActivatedRoute,
        private router: Router,
        private characterService: CharacterService,
        private characterStateService: CharacterStateService,
        private universeStateService: UniverseStateService,
    ) {}

    public canDeactivate() {
        if (this.formState === "dirty") {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public ngOnInit() {
        this.route.data.pipe(first()).subscribe((data: { character: Observable<Character>; universe: Universe }) => {
            this.universe$ = this.universeStateService
                .getUniverses()
                .pipe(map((universes) => universes.find((u) => u.id === data.universe.id)));
            this.character$ = data.character;
        });
    }

    public onDelete() {
        this.universe$.subscribe((u) => {
            this.character$.pipe(first()).subscribe((c) => {
                this.characterService.deleteCharacter(u.id, c.id).subscribe(
                    () => {
                        this.router.navigate(["../../../"], { relativeTo: this.route });
                    },
                    (err) => {
                        alert(err);
                    },
                );
            });
        });
    }

    public onEdit(data: { avatar: File | undefined | null; data: Partial<Character> }) {
        this.status = { loading: true, error: null, success: null };

        this.universe$.subscribe((u) => {
            this.character$.pipe(first()).subscribe((c) => {
                this.characterService
                    .updateCharacter(u.id, c.id, data.data, data.avatar)
                    .pipe(
                        tap(() => {
                            if (data.avatar === null) {
                                this.characterService.deleteCharacterAvatar(u.id, c.id).subscribe();
                            }
                        }),
                        finalize(() => {
                            this.status.loading = false;
                        }),
                    )
                    .subscribe(
                        (character) => {
                            this.status.success = "Successfully updated character";
                            this.character$ = of(character);
                            this.characterStateService.setCharacter(c.id, character);
                            setTimeout(() => this.reset.emit());
                        },
                        (err) => {
                            this.status.error = err;
                        },
                    );
            });
        });
    }
}
