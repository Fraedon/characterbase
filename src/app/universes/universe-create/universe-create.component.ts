import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { User } from "firebase";

import { Universe } from "../universe.model";

import "rxjs/add/operator/first";

@Component({
    selector: "cb-universe-create",
    templateUrl: "./universe-create.component.html",
})
export class UniverseCreateComponent {
    public loading = false;
    public error = null;
    private user: User;

    public constructor(
        public firestore: AngularFirestore,
        public auth: AngularFireAuth,
        public router: Router
    ) {}

    public createUniverse(): Universe {
        return {
            name: "",
            owner: "",
            description: "",
            collaborators: [],
            guide: { groups: [] },
            advanced: {
                allowAvatar: true,
                titleField: "Name",
            }
        };
    }

    public async onCreated(data: Universe) {
        this.loading = true;
        try {
            this.auth.user.first().subscribe(async (user) => {
                data = Object.assign(this.createUniverse(), data, { owner: user.uid, });
                const newUniverse = await this.firestore
                    .collection("/universes")
                    .add(data);
                this.router.navigate(["/u", newUniverse.id]);
            });
        } catch (err) {
            this.error = err;
        }
    }
}
