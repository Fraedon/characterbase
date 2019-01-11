import { CharacterGuide } from "../characters/characters.model";
import { EmbeddedUser } from "../shared/user.model";

export interface UniverseAdvancedSettings {
    allowAvatar: boolean;
    titleField: string;
}

export interface Universe {
    advanced: UniverseAdvancedSettings;
    collaborators: string[];
    description: string;
    guide: CharacterGuide;
    name: string;
    numCharacters: number;
    owner: EmbeddedUser;
}

export interface MetaUniverse {
    data: Universe;
    meta: {
        id: string;
    };
}
