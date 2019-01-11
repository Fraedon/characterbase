import { Component, EventEmitter, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import "rxjs/add/operator/do";
import { CharacterService } from "src/app/core/character.service";
import { UserService } from "src/app/core/user.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { getExt } from "src/app/shared/shared.functions";
import { MetaUniverse, Universe } from "src/app/universes/universe.model";
import { MetaCharacter } from "../character-resolver.service";
import { Character } from "../characters.model";
import { CharacterEditMode } from "./character-edit-form.component";

@Component({
    selector: "cb-character-edit-page",
    templateUrl: "./character-edit-page.component.html",
    styleUrls: ["./character-edit-page.component.scss"],
})
export class CharacterEditPageComponent implements OnInit, CanComponentDeactivate {
    public character: MetaCharacter;
    public universe: MetaUniverse;
    public CharacterEditMode = CharacterEditMode;
    public status: FormStatus = { error: null, loading: false };
    public edited = new EventEmitter();
    private unsavedChanges = false;

    public constructor(
        public route: ActivatedRoute,
        public router: Router,
        private characterService: CharacterService,
        public storage: AngularFireStorage,
        public firestore: AngularFirestore
    ) {}

    public canDeactivate() {
        if (this.unsavedChanges) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public ngOnInit() {
        this.route.data.subscribe(
            (data: { character: Observable<MetaCharacter>; universe: Observable<MetaUniverse> }) => {
                data.character.first().subscribe((character) => {
                    this.character = character;
                });
                data.universe.first().subscribe((universe) => {
                    this.universe = universe;
                });
            }
        );
    }

    public setUnsavedChanges(unsavedChanges: boolean) {
        this.unsavedChanges = unsavedChanges;
    }

    public async onEdited(data: { character: Partial<Character>; images: { [key: string]: File } }) {
        this.status = { error: null, loading: true };
        try {
            this.characterService
                .getCharacter(this.character.meta.id)
                .first()
                .subscribe(async (character) => {
                    const payload = {
                        ...data.character,
                        images: character.data.images,
                        meta: { timestamps: { ...character.data.meta.timestamps, ...{ updatedAt: new Date() } } },
                    };
                    await this.characterService.updateCharacter(
                        this.universe.meta.id,
                        this.character.meta.id,
                        payload,
                        data.images
                    );
                    this.unsavedChanges = false;
                    this.status.loading = false;
                    this.edited.emit();
                });
        } catch (err) {
            this.status.error = err;
            this.status.loading = false;
        }
    }

    public async deleteCharacter() {
        const confirmation = confirm("Are you sure you want to delete this character? This action cannot be reversed!");
        if (confirmation) {
            try {
                await this.characterService.deleteCharacter(this.character.meta.id);
                await this.router.navigate(["/u", this.universe.meta.id]);
                alert("Character deleted.");
            } catch (err) {
                alert(err);
            }
        }
    }
}
