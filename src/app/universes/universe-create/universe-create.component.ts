import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { User } from "src/app/auth/shared/user.model";
import { AuthService } from "src/app/core/auth.service";
import { UniverseService } from "src/app/core/universe.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { UniverseStateService } from "../shared/universe-state.service";
import { Universe } from "../shared/universe.model";

@Component({
    selector: "cb-universe-create",
    templateUrl: "./universe-create.component.html",
})
export class UniverseCreateComponent {
    public status: FormStatus = { loading: false };

    public constructor(
        private universeService: UniverseService,
        private router: Router,
        private universeStateService: UniverseStateService,
    ) {}

    public onSubmit(data: Partial<Universe>) {
        this.status = { loading: true, error: null, success: null };

        this.universeService.createUniverse(data).subscribe(
            (universe) => {
                this.router.navigate(["/u", universe.id]);
                this.universeStateService.addUniversesWithReferences(universe);
            },
            (err) => {
                this.status.loading = false;
                this.status.error = err;
            },
        );
    }
}
