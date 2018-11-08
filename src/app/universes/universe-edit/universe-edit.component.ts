import { Component, OnInit, EventEmitter } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";
import { UniverseResolve } from "../universe-resolver.service";
import { Universe } from "../universe.model";

export enum UniverseEditPage {
    General = "general",
    Collaborators = "collaborators",
    CharacterGuide = "guide",
    Advanced = "advanced",
}

@Component({
    selector: "cb-universe-edit",
    templateUrl: "./universe-edit.component.html",
    styleUrls: ["./universe-edit.component.scss"],
})
export class UniverseEditComponent implements OnInit {
    public universe: Universe;
    public universeId: string;
    public user: Observable<User>;
    public loading = false;
    public error = null;
    public saved = new EventEmitter();

    public currentPage = UniverseEditPage.General;
    public UniverseEditPage = UniverseEditPage;

    public constructor(
        public auth: AngularFireAuth,
        public firestore: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router
    ) {}

    public ngOnInit() {
        this.user = this.auth.user;
        this.route.data.subscribe((data: { universe: UniverseResolve }) => {
            this.universeId = data.universe.meta.id;
            delete data.universe.meta;
            this.universe = data.universe;
        });
        this.route.fragment.subscribe((fragment) => {
            switch (fragment as UniverseEditPage) {
                case UniverseEditPage.General: {
                    this.currentPage = UniverseEditPage.General;
                    break;
                }
                case UniverseEditPage.Collaborators: {
                    this.currentPage = UniverseEditPage.Collaborators;
                    break;
                }
                case UniverseEditPage.CharacterGuide: {
                    this.currentPage = UniverseEditPage.CharacterGuide;
                    break;
                }
                case UniverseEditPage.Advanced: {
                    this.currentPage = UniverseEditPage.Advanced;
                    break;
                }
                default: {
                    this.router.navigate(["./"], { fragment: UniverseEditPage.General, relativeTo: this.route });
                }
            }
        });
    }

    public async onSaveChanges(universe: Universe) {
        this.error = null;
        this.loading = true;
        try {
            await this.firestore.doc(`/universes/${this.universeId}`).update(universe);
            this.saved.emit();
        } catch (err) {
            this.error = err;
        }
        this.loading = false;
    }

    public switchPage(page: UniverseEditPage) {
        this.currentPage = page;
    }
}
