import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { UniverseService } from "../core/universe.service";
import { UserService } from "../core/user.service";

import { MetaUniverse } from "./universe.model";

@Injectable({
    providedIn: "root",
})
export class UserUniversesResolverService implements Resolve<Observable<MetaUniverse[]>> {
    constructor(private userService: UserService, private universeService: UniverseService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<MetaUniverse[]>> {
        return of(this.userService.user.mergeMap((user) => this.universeService.getUserUniverses()));
    }
}
