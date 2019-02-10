import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { first, map } from "rxjs/operators";
import { User } from "src/app/auth/shared/user.model";
import { AuthService } from "src/app/core/auth.service";
import { UniverseService } from "src/app/core/universe.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";

import { Collaborator } from "../shared/collaborator.model";
import { UniverseEditService } from "../shared/universe-edit.service";
import { UniverseStateService } from "../shared/universe-state.service";
import { MetaUniverse, Universe } from "../shared/universe.model";

export enum UniverseEditPage {
    General = "general",
    Collaborators = "collaborators",
    CharacterGuide = "guide",
    Settings = "settings",
}

@Component({
    selector: "cb-universe-edit",
    templateUrl: "./universe-edit.component.html",
    styleUrls: ["./universe-edit.component.scss"],
})
export class UniverseEditComponent implements OnInit, OnDestroy {
    public collaborators: Collaborator[];
    public currentPage = UniverseEditPage.General;
    public saved = new EventEmitter();
    public status: FormStatus = { error: undefined, loading: false };
    public universe: Observable<Universe>;
    public UniverseEditPage = UniverseEditPage;
    public user: Observable<User>;
    private universeSub: Subscription;
    private unsavedChanges = false;

    public constructor(
        private authService: AuthService,
        private universeEditService: UniverseEditService,
        public route: ActivatedRoute,
        public router: Router,
        private universeStateService: UniverseStateService,
    ) {
        this.user = this.authService.getUser();
    }

    public ngOnDestroy() {
        this.universeSub.unsubscribe();
    }

    public ngOnInit() {
        this.route.data.pipe(first()).subscribe((data: { universe: Universe }) => {
            this.universeEditService.setUniverse(data.universe);
            this.universe = this.universeEditService.getUniverse();
            this.universeSub = this.universeStateService
                .getUniverses()
                .pipe(map((universes) => universes.find((u) => u.id === data.universe.id)))
                .subscribe((u) => {
                    this.universeEditService.setUniverse(u);
                    this.universe = this.universeEditService.getUniverse();
                });
        });
    }
}
