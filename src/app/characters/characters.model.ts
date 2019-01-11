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

export interface CharacterFieldProgressValue {
    at: number;
    max: number;
    min: number;
}

export interface CharacterImage {
    path: string;
    publicUrl: string;
}

export interface Character {
    fieldGroups: { name: string; fields: { [field: string]: { value: CharacterFieldValue } } }[];
    name: string;
    owner: string;
    universe: string;
    images: { [key: string]: CharacterImage };
    meta: {
        timestamps: {
            createdAt: Date;
            updatedAt: Date;
        };
    };
}

export interface CharacterField {
    name: string;
    type: CharacterFieldType;
    value: CharacterFieldValue;
}

export interface CharacterGuideGroup {
    fields: CharacterGuideFieldType[];
    name: string;
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
    info: string;
    name: string;
    required: boolean;
    type: CharacterFieldType;
}

export interface CharacterGuideTextField extends CharacterGuideField {
    case: TextCase;
    maxLength: number;
    minLength: number;
}

export interface CharacterGuideDescriptionField extends CharacterGuideField {
    markdown: boolean;
    maxLength: number;
    // Whether to allow markdown or not
    minLength: number;
}

export interface CharacterGuideNumberField extends CharacterGuideField {
    float: boolean;
    max: number; // Input must be factorable by this
    min: number;
    // Whether to allow floating-point numbers or not (decimals)
    tick: number;
}

export interface CharacterGuideProgressField extends CharacterGuideField {
    // Color to show for progress bar
    bar: boolean;
    color: ProgressBarColor;
    max: number; // Input must be factorable by this
    min: number;
    // Whether to display progress bar or not
    tick: number;
}

export interface CharacterGuideOptionsField extends CharacterGuideField {
    multiple: boolean;
    options: string[]; // Whether to allow multiple choices or not
}

export interface CharacterGuideListField extends CharacterGuideField {
    items:
        | CharacterFieldType.Text
        | CharacterFieldType.Number
        | CharacterFieldType.Reference
        | CharacterFieldType.Options;
    maxLength: number;
    minlength: number;
}
