import { Component, OnInit, TemplateRef } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { first, map, switchMap, tap, zip } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { CharacterService } from "src/app/core/character.service";
import { UniverseService } from "src/app/core/universe.service";
import { CollaboratorRole } from "src/app/universes/shared/collaborator-role.enum";
import { CollaboratorReference } from "src/app/universes/shared/collaborator.model";
import { UniverseStateService } from "src/app/universes/shared/universe-state.service";
import { Universe } from "src/app/universes/shared/universe.model";

import { Character } from "../characters.model";
import { CharacterStateService } from "../shared/character-state.service";

@Component({
    selector: "cb-character-view-page",
    templateUrl: "./character-view-page.component.html",
    styleUrls: ["./character-view-page.component.scss"],
})
export class CharacterViewPageComponent implements OnInit {
    public canEdit;
    public character$: Observable<Character>;
    public collaborator$: Observable<CollaboratorReference>;
    public deleteModalRef: BsModalRef;
    public showTimestampCreated = false;
    public universe$: Observable<Universe>;

    public constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private characterService: CharacterService,
        private characterStateService: CharacterStateService,
        private universeStateService: UniverseStateService,
        private universeService: UniverseService,
        private titleService: Title,
    ) {}

    public ngOnInit() {
        this.route.data.subscribe((data: { character: Observable<Character>; universe: Universe }) => {
            this.character$ = data.character;
            this.universe$ = this.universeStateService.getUniverses().pipe(
                map((universes) => universes.find((u) => u.id === data.universe.id)),
                tap((u) => {
                    this.collaborator$ = this.universeService.getMe(u.id);
                    this.canEdit = this.collaborator$.pipe(
                        zip(this.character$),
                        tap((v) => {
                            this.canEdit =
                                v[0].role === CollaboratorRole.Owner ||
                                v[0].role === CollaboratorRole.Admin ||
                                v[0].userId === v[1].owner.id;
                        }),
                    );
                }),
            );
        });
    }

    public onDelete() {
        if (this.deleteModalRef) {
            this.deleteModalRef.hide();
        }
        this.universe$.pipe(first()).subscribe((u) => {
            this.character$.pipe(first()).subscribe((c) => {
                this.characterService.deleteCharacter(u.id, c.id).subscribe(
                    () => {
                        this.characterStateService.removeCharacter(c.id);
                        this.router.navigate(["/u", u.id], { relativeTo: this.route });
                    },
                    (err) => {
                        alert(err);
                    },
                );
            });
        });
    }

    public openModal(template: TemplateRef<any>) {
        this.deleteModalRef = this.modalService.show(template);
    }
}
