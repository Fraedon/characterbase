interface AuthCredentials {
    emailAddress: string;
    password: string;
}

export class User {
    constructor(public emailAddress: string, public password: string) { }
}
