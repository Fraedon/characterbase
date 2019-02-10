import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { LandingService } from "src/app/core/landing.service";

@Component({
    selector: "cb-universe-landing-page",
    templateUrl: "./universe-landing-page.component.html",
    styleUrls: ["./universe-landing-page.component.scss"],
})
export class UniverseLandingPageComponent implements OnInit, OnDestroy {
    public constructor(private landingService: LandingService, private titleService: Title) {}

    public ngOnDestroy() {
        this.landingService.setBackground("");
    }

    public ngOnInit() {
        this.titleService.setTitle("CharacterBase");
        this.landingService.setBackground(`url(assets/landings/v0.4.0.jpg)`);
    }
}
