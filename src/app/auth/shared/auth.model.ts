export interface UserCredentials {
    emailAddress: string;
    password: string;
}

export interface NewUserCredentials extends UserCredentials {
    displayName: string;
}

export interface UserProfile {
    displayName: string;
}
