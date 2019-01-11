import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserProfile } from "src/app/auth/shared/auth.model";
import { CharacterService } from "src/app/core/character.service";
import { UserService } from "src/app/core/user.service";
import { MetaUniverse } from "src/app/universes/universe.model";
import { MetaCharacter } from "../character-resolver.service";

@Component({
    selector: "cb-character-view-page",
    templateUrl: "./character-view-page.component.html",
    styleUrls: ["./character-view-page.component.scss"],
})
export class CharacterViewPageComponent implements OnInit {
    public character: Observable<MetaCharacter>;
    public universe: Observable<MetaUniverse>;
    public universeId: string;
    public ownerProfile: Observable<UserProfile>;

    public isOwner = false;
    public isAdmin = false;
    public showTimestampCreated = false;

    public constructor(
        public userService: UserService,
        public characterService: CharacterService,
        public route: ActivatedRoute,
        public router: Router,
        private titleService: Title
    ) {}

    public ngOnInit() {
        this.route.data.subscribe(
            (data: { character: Observable<MetaCharacter>; universe: Observable<MetaUniverse> }) => {
                this.character = data.character;
                this.universe = data.universe;
                this.character.first().subscribe((character) => {
                    this.titleService.setTitle(character.data.name);
                    this.ownerProfile = this.userService.getProfile(character.data.owner);
                    this.userService.user.first().subscribe((user) => {
                        this.isOwner = user.uid === character.data.owner;
                        this.universe.first().subscribe((universe) => {
                            this.isAdmin = user.uid === universe.data.owner;
                        });
                    });
                });
            }
        );
    }

    public async deleteCharacter(name: string, characterId: string, universeId: string) {
        const confirmation = confirm(`Are you SURE you want to delete ${name}?\n\n` + "This action is irreversible.");
        if (confirmation) {
            await this.router.navigate(["/u", universeId]);
            await this.characterService.deleteCharacter(characterId);
        }
    }
}
