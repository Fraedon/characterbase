import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "firebase";
import { Observable } from "rxjs";
import "rxjs/add/operator/first";
import { UniverseService } from "src/app/core/universe.service";
import { UserService } from "src/app/core/user.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { Universe } from "../universe.model";

@Component({
    selector: "cb-universe-create",
    templateUrl: "./universe-create.component.html",
})
export class UniverseCreateComponent {
    public status: FormStatus = { error: undefined, loading: false };
    private user: Observable<User>;

    public constructor(
        private universeService: UniverseService,
        private userService: UserService,
        private router: Router
    ) {
        this.user = userService.user;
    }

    public async onCreated(data: Universe) {
        this.status = { error: undefined, loading: true };
        try {
            this.user.first().subscribe(async (user) => {
                data = Object.assign(data, { owner: user.uid });
                this.universeService.createUniverse(data).subscribe((newUniverse) => {
                    this.router.navigate(["/u", newUniverse.meta.id]);
                });
            });
        } catch (err) {
            this.status.error = err;
        }
    }
}
