import { CharacterGuide } from "../characters/characters.model";

export interface UniverseAdvancedSettings {
    titleField: string;
    allowAvatar: boolean;
}

export interface Universe {
    name: string;
    owner: string;
    description: string;
    collaborators: string[];
    guide: CharacterGuide;
    advanced: UniverseAdvancedSettings;
}
