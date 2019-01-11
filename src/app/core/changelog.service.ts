import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class ChangelogService {
    private changelog: Observable<string>;

    constructor(private http: HttpClient) {
        this.changelog = http
            .get(`assets/changelogs/${environment.version}.md`, { responseType: "text" })
            .shareReplay(1);
    }

    public getChangelog() {
        return this.changelog;
    }
}
