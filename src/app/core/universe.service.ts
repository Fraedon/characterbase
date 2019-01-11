import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { combineLatest } from "rxjs";
import { from, Observable } from "rxjs";
import "rxjs/add/observable/merge";
import { merge, zip } from "rxjs/operators";

import { CharacterFieldType } from "../characters/characters.model";
import { MetaUniverse, Universe } from "../universes/universe.model";

import { UserService } from "./user.service";

@Injectable({
    providedIn: "root",
})
export class UniverseService {
    private userUniverses: Observable<MetaUniverse[]>;

    constructor(private firestore: AngularFirestore, private userService: UserService) {
        this.userUniverses = this.loadUserUniverses();
    }

    public createUniverse(data: Partial<Universe>): Observable<MetaUniverse> {
        const newUniverse = { ...this.createTemplateUniverse(), ...data };
        return from(this.firestore.collection("/universes").add(newUniverse))
            .mergeMap((ref) => from(ref.get()))
            .map((doc) => ({
                data: doc.data() as Universe,
                meta: {
                    id: doc.id,
                },
            }));
    }

    public async deleteUniverse(id: string) {
        return await this.firestore
            .collection("/universes")
            .doc(id)
            .delete();
    }

    public deleteUniverseCharacters(id: string) {
        const characters = this.firestore.collection("/characters", (ref) => ref.where("universe", "==", id)).get();
        return characters.first().map((query) => {
            const batch = this.firestore.firestore.batch();
            query.forEach((doc) => {
                batch.delete(doc.ref);
            });
            batch.commit();
        });
    }

    public getUniverse(id: string): Observable<MetaUniverse> {
        return this.firestore
            .doc(`/universes/${id}`)
            .snapshotChanges()
            .map((doc) => ({
                data: doc.payload.data() as Universe,
                meta: {
                    id: doc.payload.id,
                },
            }));
    }

    public getUserUniverses(): Observable<MetaUniverse[]> {
        return this.userUniverses;
    }

    public async updateUniverse(id: string, data: Partial<Universe>) {
        await this.firestore.doc(`/universes/${id}`).update(data);
    }

    private createTemplateUniverse(): Universe {
        return {
            advanced: {
                allowAvatar: true,
                titleField: "Name",
            },
            collaborators: [],
            description: "",
            guide: {
                groups: [
                    {
                        fields: [
                            {
                                info: "A short summary about this character",
                                markdown: true,
                                maxLength: 8000,
                                minLength: 0,
                                name: "Description",
                                required: true,
                                type: CharacterFieldType.Description,
                            },
                        ],
                        name: "General",
                    },
                ],
            },
            name: "",
            numCharacters: 0,
            owner: {
                name: "",
                id: "",
            },
        };
    }

    private loadUserUniverses() {
        return this.userService.user
            .mergeMap((user) => {
                return combineLatest(
                    this.firestore
                        .collection("/universes", (ref) => ref.where("owner.id", "==", user.uid))
                        .snapshotChanges()
                        .map((docs) =>
                            docs.map((doc) => ({
                                data: doc.payload.doc.data() as Universe,
                                meta: {
                                    id: doc.payload.doc.id,
                                },
                            }))
                        ),
                    this.firestore
                        .collection("/universes", (ref) => ref.where("collaborators", "array-contains", user.email))
                        .snapshotChanges()
                        .map((docs) =>
                            docs.map((doc) => ({
                                data: doc.payload.doc.data() as Universe,
                                meta: {
                                    id: doc.payload.doc.id,
                                },
                            }))
                        )
                );
            })
            .map((universes) => [...universes[0], ...universes[1]])
            .shareReplay(1);
    }
}
