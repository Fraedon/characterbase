import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { combineLatest } from "rxjs";
import { from, Observable } from "rxjs";
import "rxjs/add/observable/merge";
import { first, map, merge, tap, zip } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { CharacterFieldType } from "../characters/characters.model";
import { CollaboratorRole } from "../universes/shared/collaborator-role.enum";
import { Collaborator, CollaboratorReference } from "../universes/shared/collaborator.model";
import { MetaUniverse, Universe } from "../universes/shared/universe.model";

import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root",
})
export class UniverseService {
    private userUniverses: Observable<MetaUniverse[]>;

    constructor(private authService: AuthService, private http: HttpClient) {
        // this.userUniverses = this.loadUserUniverses();
    }

    public addCollaborator(universeId: string, input: { email?: string; id?: string }) {
        return this.http
            .post<Collaborator>(`${environment.apiEndpoint}/universes/${universeId}/collaborators`, input)
            .pipe(first());
    }

    public createTemplateUniverse(): Partial<Universe> {
        return {};
    }

    public createUniverse(data: Partial<Universe>): Observable<Universe> {
        const payload = { ...this.createTemplateUniverse(), ...data };
        return this.http.post<Universe>(`${environment.apiEndpoint}/universes`, payload).pipe(first());
    }

    public deleteCharacters(universeId: string) {
        return this.http.delete<null>(`${environment.apiEndpoint}/universes/${universeId}/characters`).pipe(first());
    }

    public deleteUniverse(id: string) {
        return this.http.delete<null>(`${environment.apiEndpoint}/universes/${id}`).pipe(first());
    }

    public editCollaborator(universeId: string, userId: string, role: CollaboratorRole) {
        return this.http
            .patch<Collaborator>(`${environment.apiEndpoint}/universes/${universeId}/collaborators`, {
                id: userId,
                role,
            })
            .pipe(first());
    }

    public getCollaborators(universeId: string) {
        return this.http
            .get<{ collaborators: Collaborator[] }>(`${environment.apiEndpoint}/universes/${universeId}/collaborators`)
            .pipe(
                first(),
                map((data) => data.collaborators),
            );
    }

    public getMe(universeId: string) {
        return this.http
            .get<CollaboratorReference>(`${environment.apiEndpoint}/universes/${universeId}/me`)
            .pipe(first());
    }

    public getUniverse(id: string): Observable<Universe> {
        return this.http.get<Universe>(`${environment.apiEndpoint}/universes/${id}`).pipe(first());
    }

    public removeCollaborator(universeId: string, id: string) {
        return this.http
            .delete<null>(`${environment.apiEndpoint}/universes/${universeId}/collaborators`, { params: { id } })
            .pipe(first());
    }

    public updateUniverse(id: string, data: Partial<Universe>) {
        return this.http.patch<Universe>(`${environment.apiEndpoint}/universes/${id}`, data).pipe(first());
    }
}
