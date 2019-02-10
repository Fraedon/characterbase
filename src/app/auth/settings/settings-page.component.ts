import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "firebase";
import { Observable } from "rxjs";

@Component({
    selector: "cb-settings-page",
    templateUrl: "./settings-page.component.html",
    styleUrls: ["./settings-page.component.scss"],
})
export class SettingsPageComponent {
    public currentDisplayName;
    public displayNameForm = new FormGroup({
        displayName: new FormControl("", [Validators.required]),
    });
    public error = null;
    public loading = false;
    public user: Observable<User>;

    public constructor(private router: Router) {}

    /*
    public async deleteAccount() {
        const confirmation = confirm(
            "By deleting your account, you are also deleting ALL of your universes, characters, and " +
                "contributions you made in other universes. THIS ACTION IS NOT IRREVERSIBLE.\n\n" +
                "Are you SURE you want to delete your account?",
        );
        if (confirmation) {
            this.user.first().subscribe(async (user) => {
                await user.delete();
                alert("Account deleted.");
                this.router.navigateByUrl("/login");
            });
        }
    }

    public ngOnInit() {
        this.user.first().subscribe((user) => {
            this.currentDisplayName = user.displayName;
            this.displayNameForm.controls["displayName"].setValue(this.currentDisplayName);
        });
    }

    public async submitDisplayName() {
        this.loading = true;
        this.error = null;
        try {
            const displayName = this.displayNameForm.value["displayName"];
            this.user.first().subscribe(async (user) => {
                const newProfile = { displayName } as UserProfile;
                await this.firestore.doc(`profiles/${user.uid}`).set(newProfile);
                await user.updateProfile({ displayName, photoURL: null });
                this.currentDisplayName = displayName;
                this.displayNameForm.markAsPristine();
                this.loading = false;
            });
        } catch (err) {
            this.error = err;
        }
    }*/
}
