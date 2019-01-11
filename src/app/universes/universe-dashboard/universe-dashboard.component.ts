import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { User } from "firebase";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { distinctUntilChanged } from "rxjs/operators";
import { LandingService } from "src/app/core/landing.service";
import { UserService } from "src/app/core/user.service";

import { MetaUniverse, Universe } from "../universe.model";

@Component({
    selector: "cb-universe-dashboard",
    templateUrl: "./universe-dashboard.component.html",
    styleUrls: ["./universe-dashboard.component.scss"],
})
export class UniverseDashboardPageComponent implements OnInit {
    public backgroundImage: Observable<string>;
    public universes: Observable<MetaUniverse[]>;
    public user: Observable<User>;

    public constructor(
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private landingService: LandingService
    ) {
        this.user = userService.user;
    }

    public ngOnInit() {
        this.route.data.first().subscribe((data: { universes: Observable<MetaUniverse[]> }) => {
            this.universes = data.universes;
        });
        this.backgroundImage = this.landingService.getBackground().pipe(distinctUntilChanged());
    }

    public onLogOut() {
        this.userService.logOut();
        this.router.navigateByUrl("/login");
    }
}
