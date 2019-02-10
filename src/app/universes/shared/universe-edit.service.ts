import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { first, tap } from "rxjs/operators";
import { UniverseService } from "src/app/core/universe.service";

import { CollaboratorRole } from "./collaborator-role.enum";
import { UniverseStateService } from "./universe-state.service";
import { Universe } from "./universe.model";

@Injectable({ providedIn: "root" })
export class UniverseEditService {
    private universe = new BehaviorSubject<Universe>(undefined);

    public constructor(private universeService: UniverseService, private universeStateService: UniverseStateService) {}

    public addCollaborator(universeId: string, input: string) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(input)) {
            return this.universeService.addCollaborator(universeId, { email: input });
        } else {
            return this.universeService.addCollaborator(universeId, { id: input });
        }
    }

    public deleteCharacters(universe: Universe) {
        return this.universeService.deleteCharacters(universe.id);
    }

    public deleteUniverse(universe: Universe) {
        return this.universeService.deleteUniverse(universe.id).pipe(
            tap(() => {
                this.universeStateService.removeUniverseAndReferences(universe.id);
            }),
        );
    }

    public editCollaborator(universeId: string, userId: string, role: CollaboratorRole) {
        return this.universeService.editCollaborator(universeId, userId, role);
    }

    public getUniverse() {
        return this.universe.asObservable().pipe(first());
    }

    public removeCollaborator(universeId: string, collaboratorId: string) {
        return this.universeService.removeCollaborator(universeId, collaboratorId);
    }

    public setUniverse(universe: Universe) {
        this.universe.next(universe);
    }

    public update(id: string, data: Partial<Universe>) {
        return this.universeService.updateUniverse(id, data).pipe(
            tap((u) => {
                this.universeStateService.setUniverse(id, u);
            }),
        );
    }
}
