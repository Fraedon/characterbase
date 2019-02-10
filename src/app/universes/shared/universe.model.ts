import { CharacterGuide } from "../../characters/characters.model";

import { CollaboratorRole } from "./collaborator-role.enum";

export interface UniverseSettings {
    allowAvatars: boolean;
    titleField: string;
}

export interface UniverseReference {
    id: string;
    name: string;
    // role: CollaboratorRole;
}

export interface Universe {
    description: string;
    guide: CharacterGuide;
    id: string;
    name: string;
    settings: UniverseSettings;
}

export interface MetaUniverse {
    data: Universe;
    meta: {
        id: string;
    };
}
