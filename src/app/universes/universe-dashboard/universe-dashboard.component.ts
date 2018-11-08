import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { User } from "firebase";

import "rxjs/add/operator/map";
import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-dashboard",
    templateUrl: "./universe-dashboard.component.html",
    styleUrls: ["./universe-dashboard.component.scss"],
})
export class UniverseDashboardPageComponent {
    public user: Observable<User>;
    public userEmail: Observable<string>;
    public userUniverses: Observable<Universe[]>;

    public constructor(
        public auth: AngularFireAuth,
        public firestore: AngularFirestore,
        public router: Router
    ) {
        this.user = auth.user;
        this.userEmail = this.auth.user.map((u) => {
            if (u.email.length > 18) {
                return u.email.substring(0, 15) + "…";
            }
            return u.email;
        });
        this.user.first().subscribe((user) => {
            this.userUniverses = firestore
                .collection<Universe>("/universes", (ref) =>
                    ref.where("owner", "==", user.uid)
                ).snapshotChanges().map((v) => v.map((d) => ({ ...d.payload.doc.data(), id: d.payload.doc.id })));
        });
    }

    public onLogOut() {
        this.auth.auth.signOut();
        this.router.navigate(["login"]);
    }
}
