import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class LandingService {
    private backgroundSubject = new BehaviorSubject("");

    public constructor() {}

    public getBackground() {
        return this.backgroundSubject.asObservable();
    }

    public setBackground(url: string) {
        this.backgroundSubject.next(url);
    }
}
