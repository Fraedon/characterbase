import { User } from "src/app/auth/shared/user.model";

import { CollaboratorRole } from "./collaborator-role.enum";

export interface Collaborator {
    role: CollaboratorRole;
    user: User;
}

export interface CollaboratorReference {
    role: CollaboratorRole;
    userId: string;
}
