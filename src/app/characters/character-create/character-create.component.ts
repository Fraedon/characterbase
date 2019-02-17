import { Component, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, first, map } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { CharacterService } from "src/app/core/character.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { UniverseStateService } from "src/app/universes/shared/universe-state.service";
import { MetaUniverse, Universe } from "src/app/universes/shared/universe.model";

import { Character } from "../characters.model";
import { CharacterStateService } from "../shared/character-state.service";

@Component({
    selector: "cb-character-create",
    templateUrl: "./character-create.component.html",
    styleUrls: ["./character-create.component.scss"],
})
export class CharacterCreateComponent implements OnInit, CanComponentDeactivate {
    public formState: "dirty" | "pristine";
    public reset = new EventEmitter<null>();
    public status: FormStatus = { loading: false };
    public universe$: Observable<Universe>;

    public constructor(
        public route: ActivatedRoute,
        public router: Router,
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
        this.route.data.pipe(first()).subscribe((data: { universe: Universe }) => {
            this.universe$ = this.universeStateService
                .getUniverses()
                .pipe(map((universes) => universes.find((u) => u.id === data.universe.id)));
        });
    }

    public onCreate(data: { avatar?: File; data: Partial<Character> }) {
        this.status = { loading: true, error: null, success: null };

        console.log(data.data);
        this.universe$.subscribe((u) => {
            this.characterService
                .createCharacter(u.id, data.data, data.avatar)
                .pipe()
                .subscribe(
                    (character) => {
                        this.formState = "pristine";
                        this.router.navigate(["..", character.id], { relativeTo: this.route });
                        this.characterStateService.addCharactersWithReferences(character);
                    },
                    (err) => {
                        this.status.loading = false;
                        this.status.error = err;
                    },
                );
        });
    }
}
