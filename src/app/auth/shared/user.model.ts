export interface User {
    displayName: string;
    email: string;
    id: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface NewUserCredentials extends UserCredentials {
    displayName: string;
}
