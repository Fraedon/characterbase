import { User } from "../auth/shared/user.model";

// Meta attributes:
//      REQUIRED:   Field must have a value (all fields are optional by default)
//      TITLE:      Can only be applied once and on a TEXT field (will be shown on character list view)
//      INFO:       A TEXT with helpful information describing the current field
//      AVATAR:     Can only be applied once and on an IMAGE field (will be shown on character list view)
export enum CharacterFieldType {
    Text = "text", // A basic string field
    Description = "description", // A longer string field with markdown support
    Number = "number", // A number field
    Toggle = "toggle", // A boolean field
    Progress = "progress", // An advanced number field with a min and max cap to represent percentages.
    // NOTE: Give user option to choose bar color or no bar at all
    Reference = "reference", // A reference field which points to another character
    Options = "options", // A choice field. Only supports TEXT and NUMBER. NOTE: Give user option to allow multiple selections
    List = "list", // A strict array field. Only supports TEXT, NUMBER, and OPTION.
    // NOTE: Give user option to set min/max elements
    // Group = "group", // An dynamic array field. Allows nesting character fields
    Picture = "picture", // An image field.
}

export enum TextCase {
    uppercase = "uppercase",
    lowercase = "lowercase",
}

export enum ProgressBarColor {
    Red = "red", // Danger
    Yellow = "yellow", // Warning
    Green = "green", // Success
    Blue = "blue", // Primary
    Teal = "teal", // Info
    Gray = "gray", // Secondary
    Dark = "dark", // Dark
}

export enum CharacterSort {
    Name = "name",
    Relevance = "relevance",
    DateCreated = "date_created",
    LastUpdated = "last_updated",
    Custom = "custom",
}

export type CharacterFieldValue =
    | null
    | string[]
    | number[]
    | CharacterField[]
    | boolean
    | number
    | string
    | CharacterFieldProgressValue;

export interface CharacterField {
    hidden: boolean;
    type: CharacterFieldType;
    value: any;
}

export interface CharacterGroup {
    fields: {
        [key: string]: CharacterField;
    };
    hidden: boolean;
}

export interface CharacterFields {
    groups: {
        [key: string]: CharacterGroup;
    };
}

export interface CharacterData {
    createdAt: Date;
    id: string;
    name: string;
    tag: string;
    updatedAt: Date;
}

export interface CharacterReference extends CharacterData {
    avatarUrl: string | null;
    hidden: boolean;
    nameHidden: boolean;
    ownerId: string;
    parsedName: ParsedName;
}

export interface Character extends CharacterData {
    fields: CharacterFields;
    images: {
        [key: string]: string;
    };
    meta: {
        hidden: boolean;
        name: ParsedName;
        nameHidden: boolean;
    };
    owner: User;
}

export interface ParsedName {
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    nickname: string | null;
    preferredName: string;
}

export interface CharacterImages {
    [key: string]: string;
}

export interface CharacterFieldProgressValue {
    at: number;
    max: number;
    min: number;
}

export interface CharacterGuideGroup {
    fields: CharacterGuideField[];
    name: string;
    required: boolean;
}

export interface CharacterGuide {
    groups: CharacterGuideGroup[];
}

export type CharacterGuideFieldType =
    | CharacterGuideTextField
    | CharacterGuideDescriptionField
    | CharacterGuideNumberField
    | CharacterGuideProgressField
    | CharacterGuideOptionsField
    | CharacterGuideListField
    | CharacterGuideField;

export interface CharacterGuideField {
    default?: CharacterFieldValue;
    description: string;
    meta: CharacterGuideFieldType;
    name: string;
    required: boolean;
    type: CharacterFieldType;
}

export interface CharacterGuideTextField {
    maxLength: number;
    minLength: number;
    pattern: string;
}

export interface CharacterGuideDescriptionField {
    markdown: boolean;
    maxLength: number;
    // Whether to allow markdown or not
    minLength: number;
}

export interface CharacterGuideNumberField {
    float: boolean;
    max: number; // Input must be factorable by this
    min: number;
    // Whether to allow floating-point numbers or not (decimals)
    tick: number;
}

export interface CharacterGuideProgressField {
    // Color to show for progress bar
    bar: boolean;
    color: ProgressBarColor;
    max: number; // Input must be factorable by this
    min: number;
    // Whether to display progress bar or not
    tick: number;
}

export interface CharacterGuideOptionsField {
    multiple: boolean;
    options: string[]; // Whether to allow multiple choices or not
}

export interface CharacterGuideListField {
    maxElements: number;
    minElements: number;
}

export const getFormattedCharacterName = (parsed: ParsedName) => {
    const middle = ` ${parsed.middleName ? parsed.middleName.substring(0, 1) + "." : ""}`;
    if (parsed.preferredName) {
        return parsed.preferredName;
    } else if (parsed.firstName) {
        return `${parsed.lastName}, ${parsed.firstName}${middle}`;
    } else {
        return `${parsed.lastName}${middle}`;
    }
};
