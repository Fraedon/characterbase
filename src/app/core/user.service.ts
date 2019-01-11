import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "firebase";
import { Observable } from "rxjs";
import "rxjs/add/operator/shareReplay";

import { NewUserCredentials, UserCredentials, UserProfile } from "../auth/shared/auth.model";

@Injectable({
    providedIn: "root",
})
export class UserService {
    public user: Observable<User>;

    constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = auth.user.shareReplay(1);
    }

    public async createUserAndSignIn(data: NewUserCredentials) {
        const newUser = await this.auth.auth.createUserWithEmailAndPassword(data.emailAddress, data.password);
        await newUser.user.updateProfile({ displayName: data.displayName, photoURL: null });
        await this.firestore.doc(`profiles/${newUser.user.uid}`).set({ displayName: data.displayName });
    }

    public getProfile(uid: string) {
        return this.firestore.doc<UserProfile>(`profiles/${uid}`).valueChanges();
    }

    public async logOut() {
        await this.auth.auth.signOut();
    }

    public async signIn(credentials: UserCredentials) {
        const loginUser = await this.auth.auth.signInWithEmailAndPassword(
            credentials.emailAddress,
            credentials.password
        );
        return loginUser.user;
    }
}
