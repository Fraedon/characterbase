import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { CharacterService } from "src/app/core/character.service";
import { UniverseService } from "src/app/core/universe.service";
import { UserService } from "src/app/core/user.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { MetaUniverse, Universe } from "src/app/universes/universe.model";
import { CharacterEditMode } from "../character-edit/character-edit-form.component";
import { CharacterResolverService } from "../character-resolver.service";
import { Character } from "../characters.model";

@Component({
    selector: "cb-character-create",
    templateUrl: "./character-create.component.html",
})
export class CharacterCreateComponent implements OnInit, CanComponentDeactivate {
    public universe: MetaUniverse;
    public status: FormStatus = { error: null, loading: false };

    public CharacterEditMode = CharacterEditMode;
    private unsavedChanges = false;
    private unsavedChangesFirstEmit = false;

    public constructor(
        public route: ActivatedRoute,
        public router: Router,
        public storage: AngularFireStorage,
        private userService: UserService,
        private characterService: CharacterService
    ) {}

    public canDeactivate() {
        if (this.unsavedChanges) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public ngOnInit() {
        this.route.data.subscribe((data: { universe: Observable<MetaUniverse> }) => {
            data.universe.first().subscribe((universe) => {
                this.universe = universe;
            });
        });
    }

    public setUnsavedChanges(unsavedChanges: boolean) {
        if (!this.unsavedChangesFirstEmit) {
            this.unsavedChangesFirstEmit = true;
        } else {
            this.unsavedChanges = true;
        }
    }

    public async onCreated(data: { character: Partial<Character>; images: { [key: string]: File } }) {
        this.status = { error: null, loading: true };
        try {
            this.userService.user.subscribe((user) => {
                const characterData = {
                    ...data.character,
                    owner: user.uid,
                    universe: this.universe.meta.id,
                } as Partial<Character>;
                const newCharacter = this.characterService.createCharacter(
                    this.universe.meta.id,
                    characterData,
                    data.images
                );
                newCharacter.subscribe(
                    (newChar) => {
                        this.unsavedChanges = false;
                        this.router.navigate(["/u", this.universe.meta.id, "c", newChar.meta.id]);
                    },
                    (err) => {
                        throw err;
                    }
                );
            });
        } catch (err) {
            this.status.error = err;
        }
    }
}
