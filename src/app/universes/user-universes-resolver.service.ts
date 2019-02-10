import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { tap } from "rxjs/operators";

import { AuthService } from "../core/auth.service";

import { UniverseStateService } from "./shared/universe-state.service";
import { Universe, UniverseReference } from "./shared/universe.model";

@Injectable({
    providedIn: "root",
})
export class UserUniversesResolverService implements Resolve<UniverseReference[]> {
    constructor(private authService: AuthService, private universeStateService: UniverseStateService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.universeStateService.clearReferences();
        return this.authService.getCollaborations().pipe(tap((r) => this.universeStateService.addReferences(...r)));
    }
}
