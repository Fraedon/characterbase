import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";
import { DocumentSnapshot } from "@google-cloud/firestore";
import { BehaviorSubject, EMPTY, from, Observable, of } from "rxjs";
import "rxjs/add/operator/last";
import "rxjs/add/operator/reduce";
import { environment } from "src/environments/environment";

import { MetaCharacter } from "../characters/character-resolver.service";
import { CharactersQuery } from "../characters/character-toolbar/character-toolbar.component";
import { Character, CharacterImage, CharacterSort } from "../characters/characters.model";

@Injectable({
    providedIn: "root",
})
export class CharacterService {
    private universeCharacters = new Map<string, Observable<MetaCharacter[]>>();

    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

    public createCharacter(
        universeId: string,
        data: Partial<Character>,
        images: { [key: string]: File }
    ): Observable<MetaCharacter> {
        const characterId = this.firestore.createId();
        const newCharacter = { ...this.createCharacterTemplate(), ...data } as Character;
        return this.uploadImages(universeId, characterId, images)
            .map(this.mapUploadsToImages)
            .mergeMap((uploads) => {
                newCharacter.images = uploads;
                return from(
                    this.firestore
                        .collection("characters")
                        .doc(characterId)
                        .set(newCharacter)
                );
            })
            .mergeMap((doc) => from(this.getCharacter(characterId)));
    }

    public async deleteCharacter(id: string) {
        return await this.firestore
            .collection("characters")
            .doc(id)
            .delete();
    }

    public getCharacter(characterId: string): Observable<MetaCharacter> {
        return this.firestore
            .collection("characters")
            .doc(characterId)
            .snapshotChanges()
            .map((doc) => ({
                data: doc.payload.data() as Character,
                meta: {
                    id: doc.payload.id,
                },
            }));
    }

    public getCharactersFromUniverse(
        universeId: string,
        query: CharactersQuery = { sort: CharacterSort.Name, page: { count: 0, direction: 1 } },
        refresh: boolean = false
    ): Observable<MetaCharacter[]> {
        console.log("getting characters for " + universeId);
        if (this.universeCharacters.get(universeId) && !refresh) {
            return this.universeCharacters.get(universeId);
        } else {
            console.log("got query", query);
            const characters = this.firestore
                .collection("characters", (ref) => {
                    let q = ref.where("universe", "==", universeId);
                    q = q.orderBy(this.getOrderByFieldFromSort(query.sort));
                    if (query.page.after) {
                        q = q.startAt(query.page.after);
                    } else {
                        q = q.endAt(query.page.before);
                    }
                    q = q.limit(environment.characterQueryLimit);
                    return q;
                })
                .snapshotChanges()
                .map((docs) =>
                    docs.map((doc) => ({
                        data: doc.payload.doc.data() as Character,
                        snap: doc.payload.doc,
                    }))
                )
                .shareReplay(1);
            this.universeCharacters.set(universeId, characters);
            return characters;
        }
    }

    public async updateCharacter(
        universeId: string,
        characterId: string,
        data: Partial<Character>,
        images: { [key: string]: File }
    ) {
        const newImages = Object.entries(images).reduce((acc, kv) => {
            if (kv[1] !== null) {
                acc[kv[0]] = kv[1];
            }
            return acc;
        }, {});
        this.uploadImages(universeId, characterId, newImages)
            .map(this.mapUploadsToImages)
            .subscribe(async (uploads) => {
                const updatePayload = { ...data, images: { ...data.images, ...uploads } };
                Object.entries(images).forEach((kv) => {
                    if (kv[1] === null) {
                        delete updatePayload.images[kv[0]];
                    }
                });
                await this.firestore
                    .collection("characters")
                    .doc(characterId)
                    .update(updatePayload);
            });
    }

    public uploadImages(universeId: string, characterId: string, images: { [key: string]: File }) {
        return from(Object.keys(images))
            .mergeMap((path) => {
                const image = images[path];
                const refPath = `universes/${universeId}/characters/${characterId}/${path}`;
                return this.storage
                    .upload(refPath, image)
                    .snapshotChanges()
                    .last()
                    .mergeMap((task) =>
                        from(task.ref.getDownloadURL() as Promise<string>).map((publicUrl) => ({
                            fullPath: task.ref.fullPath,
                            path,
                            publicUrl,
                        }))
                    );
            })
            .map((data) => ({
                key: data.path,
                path: data.fullPath,
                publicUrl: data.publicUrl,
            }))
            .reduce((acc, val) => {
                acc.push(val);
                return acc;
            }, []);
    }

    private createCharacterTemplate(): Character {
        return {
            fieldGroups: [],
            images: {},
            meta: {
                timestamps: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
            name: "",
            owner: "",
            universe: "",
        };
    }

    private getOrderByFieldFromSort(sort: CharacterSort) {
        switch (sort) {
            case CharacterSort.DateCreated:
                return "meta.timestamps.createdAt";
            case CharacterSort.LastUpdated:
                return "meta.timestamps.updatedAt";
            case CharacterSort.Name:
                return "name";
        }
    }

    private mapUploadsToImages(
        uploads: { key: string; path: string; publicUrl: string }[]
    ): { [key: string]: CharacterImage } {
        return uploads.reduce((acc, upload) => {
            acc[upload.key] = {
                path: upload.path,
                publicUrl: upload.publicUrl,
            };
            return acc;
        }, {});
    }
}
