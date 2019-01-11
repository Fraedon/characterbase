import { Component, HostBinding, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ChangelogService } from "src/app/core/changelog.service";

@Component({
    selector: "cb-changelog",
    templateUrl: "./changelog.component.html",
    styleUrls: ["./changelog.component.scss"],
})
export class ChangelogComponent implements OnInit {
    @HostBinding("class") classes = "card";
    public changelog: Observable<string>;

    constructor(private changelogService: ChangelogService) {}

    ngOnInit() {
        this.changelog = this.changelogService.getChangelog();
    }
}
