import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

import { Observable } from "rxjs";
import { User } from "firebase";
import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-page",
    templateUrl: "./universe-page.component.html",
    styleUrls: ["./universe-page.component.scss"],
})
export class UniversePageComponent implements OnInit {
    public universe: Observable<Universe>;
    public user: Observable<User>;

    public constructor(public auth: AngularFireAuth, public firestore: AngularFirestore, public route: ActivatedRoute) { }

    public ngOnInit() {
        this.user = this.auth.user;
        this.route.params.subscribe((params) => {
            const id = params.universeId;
            this.universe = this.firestore.doc<Universe>(`/universes/${id}`).valueChanges();
        });
    }
}
