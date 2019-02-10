import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { distinctUntilChanged, first } from "rxjs/operators";
import { User } from "src/app/auth/shared/user.model";
import { AuthService } from "src/app/core/auth.service";
import { LandingService } from "src/app/core/landing.service";

import { UniverseStateService } from "../shared/universe-state.service";
import { MetaUniverse, Universe, UniverseReference } from "../shared/universe.model";

@Component({
    selector: "cb-universe-dashboard",
    templateUrl: "./universe-dashboard.component.html",
    styleUrls: ["./universe-dashboard.component.scss"],
})
export class UniverseDashboardPageComponent implements OnInit {
    public backgroundImage: Observable<string>;
    public universes$: Observable<UniverseReference[]>;
    public user: Observable<User>;
    @HostBinding("class") private classes = "universe-dashboard-page";

    public constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private landingService: LandingService,
        private universeStateService: UniverseStateService,
    ) {
        this.user = authService.getUser();
    }

    public ngOnInit() {
        this.route.data.pipe(first()).subscribe((data: { universes: UniverseReference[] }) => {
            this.universes$ = this.universeStateService.getReferences();
        });
        this.backgroundImage = this.landingService.getBackground().pipe(distinctUntilChanged());
    }

    public onLogOut() {
        this.authService.logOut();
        this.router.navigateByUrl("/login");
    }
}
