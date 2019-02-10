import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, first, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { User } from "../auth/shared/user.model";
import { Universe, UniverseReference } from "../universes/shared/universe.model";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) {}

    public getCollaborations() {
        return this.http.get<{ universes: UniverseReference[] }>(`${environment.apiEndpoint}/me/collaborations`).pipe(
            first(),
            map((data) => data.universes),
        );
    }

    public getUser() {
        return this.user.asObservable();
    }

    public logIn(email: string, password: string) {
        const payload = { email, password };
        return this.http.post<User>(`${environment.apiEndpoint}/login`, payload, { withCredentials: true }).pipe(
            first(),
            tap((u) => {
                this.user.next(u);
            }),
        );
    }

    public logOut() {
        this.http.get(`${environment.apiEndpoint}/logout`).subscribe();
        this.user.next(null);
    }

    public profile() {
        return this.http.get<User>(`${environment.apiEndpoint}/me`).pipe(
            tap((u) => {
                this.user.next(u);
            }),
        );
    }

    public register(displayName: string, email: string, password: string) {
        const payload = { displayName, email, password };
        return this.http.post<User>(`${environment.apiEndpoint}/users`, payload).pipe(first());
    }
}
