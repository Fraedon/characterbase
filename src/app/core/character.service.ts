import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { Character, CharacterReference } from "../characters/characters.model";

export interface CharacterQuery {
    includeHidden: boolean;
    page: number;
    query: string;
    sort: "lexicographical" | "nominal";
}

export interface CharacterQueryResult {
    characters: CharacterReference[];
    page: number;
    total: number;
}

@Injectable({
    providedIn: "root",
})
export class CharacterService {
    constructor(private http: HttpClient) {}

    public createCharacter(universeId: string, data: Partial<Character>, avatar?: File) {
        const form = new FormData();
        form.append("data", JSON.stringify(data));
        form.append("avatar", avatar);
        return this.http.post<Character>(`${environment.apiEndpoint}/universes/${universeId}/characters`, form).pipe(
            map((c) => {
                c.createdAt = new Date(c.createdAt);
                c.updatedAt = new Date(c.updatedAt);
                return c;
            }),
            first(),
        );
    }

    public deleteCharacter(universeId: string, characterId: string) {
        return this.http
            .delete<null>(`${environment.apiEndpoint}/universes/${universeId}/characters/${characterId}`)
            .pipe(first());
    }

    public deleteCharacterAvatar(universeId: string, characterId: string) {
        return this.http
            .delete<null>(`${environment.apiEndpoint}/universes/${universeId}/characters/${characterId}/avatar`)
            .pipe(first());
    }

    public getCharacter(universeId: string, id: string) {
        return this.http.get<Character>(`${environment.apiEndpoint}/universes/${universeId}/characters/${id}`).pipe(
            map((c) => {
                c.createdAt = new Date(c.createdAt);
                c.updatedAt = new Date(c.updatedAt);
                return c;
            }),
            first(),
        );
    }

    public getCharacters(universeId: string, query?: CharacterQuery) {
        if (!query) {
            query = { query: "", page: 0, includeHidden: true, sort: "nominal" };
        }
        return this.http
            .get<CharacterQueryResult>(`${environment.apiEndpoint}/universes/${universeId}/characters`, {
                params: { q: query.query, p: String(query.page), hidden: String(query.includeHidden), s: query.sort },
            })
            .pipe(first());
    }

    public updateCharacter(universeId: string, characterId: string, data: Partial<Character>, avatar?: File) {
        const form = new FormData();
        form.append("data", JSON.stringify(data));
        form.append("avatar", avatar);
        return this.http
            .patch<Character>(`${environment.apiEndpoint}/universes/${universeId}/characters/${characterId}`, form)
            .pipe(first());
    }
}
