import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Universe, UniverseReference } from "./universe.model";

@Injectable({
    providedIn: "root",
})
export class UniverseStateService {
    private references = new BehaviorSubject<UniverseReference[]>([]);
    private universes = new BehaviorSubject<Universe[]>([]);

    public addReferences(...data: UniverseReference[]) {
        data = data.filter((r) => !this.references.value.find((r2) => r2.id === r.id));
        this.references.next([...this.references.value, ...data]);
    }

    public addUniverses(...data: Universe[]) {
        data = data.filter((u) => !this.universes.value.find((u2) => u2.id === u.id));
        this.universes.next([...this.universes.value, ...data]);
        console.log(this.universes.value);
    }

    public addUniversesWithReferences(...data: Universe[]) {
        const refs = this.references.value;
        data.forEach((u) => {
            refs.push(this.convertToReference(u));
        });
        this.addUniverses(...data);
        this.addReferences(...refs);
    }

    public clearReferences() {
        this.references.next([]);
    }

    public clearUniverses() {
        this.universes.next([]);
    }

    public clearUniversesAndReferences() {
        this.clearUniverses();
        this.clearReferences();
    }

    public getReferences() {
        return this.references.asObservable();
    }

    public getUniverse(id: string) {
        return this.universes.value.find((u) => u.id === id);
    }

    public getUniverses() {
        return this.universes.asObservable();
    }

    public removeReference(id: string) {
        this.references.next(this.references.value.filter((r) => r.id !== id));
    }

    public removeUniverse(id: string) {
        this.universes.next(this.universes.value.filter((u) => u.id !== id));
    }

    public removeUniverseAndReferences(id: string) {
        this.removeUniverse(id);
        this.removeReference(id);
    }

    public setReference(id: string, data: UniverseReference) {
        this.references.next(
            this.references.value.map((r) => {
                if (r.id === id) {
                    r = data;
                }
                return r;
            }),
        );
    }

    public setUniverse(id: string, data: Universe) {
        this.universes.next(
            this.universes.value.map((u) => {
                if (u.id === id) {
                    u = data;
                    this.setReference(id, this.convertToReference(data));
                }
                return u;
            }),
        );
    }

    private convertToReference(universe: Universe): UniverseReference {
        return {
            id: universe.id,
            name: universe.name,
        };
    }
}
