import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { UniverseService } from "../core/universe.service";

import { Collaborator } from "./shared/collaborator.model";

@Injectable({
    providedIn: "root",
})
export class UniverseCollaboratorsResolverService implements Resolve<Observable<Collaborator[]>> {
    public constructor(private universeService: UniverseService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params["universeId"];
        return this.universeService.getCollaborators(id);
    }
}
