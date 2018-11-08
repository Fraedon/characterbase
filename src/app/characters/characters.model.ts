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
    Red = "red",        // Danger
    Yellow = "yellow",  // Warning
    Green = "green",    // Success
    Blue = "blue",      // Primary
    Teal = "teal",      // Info
    Gray = "gray",      // Secondary
    Dark = "dark",      // Dark
}

export type CharacterFieldValue =
    | string
    | string[]
    | number
    | number[]
    | boolean
    | CharacterFieldProgressValue
    | CharacterField[]
    | null;

export interface CharacterFieldProgressValue {
    min: number;
    at: number;
    max: number;
}

export interface Character {
    name: string;
    owner: string;
}

export interface CharacterField {
    name: string;
    type: CharacterFieldType;
    value: CharacterFieldValue;
}

export interface CharacterGuideGroup {
    name: string;
    fields: CharacterGuideFieldType[];
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
    required: boolean;
    info: string;
    type: CharacterFieldType;
    name: string;
}

export interface CharacterGuideTextField extends CharacterGuideField {
    case: TextCase;
    minLength: number;
    maxLength: number;
}

export interface CharacterGuideDescriptionField extends CharacterGuideField {
    markdown: boolean; // Whether to allow markdown or not
    minLength: number;
    maxLength: number;
}

export interface CharacterGuideNumberField extends CharacterGuideField {
    float: boolean; // Whether to allow floating-point numbers or not (decimals)
    tick: number;  // Input must be factorable by this
    min: number;
    max: number;
}

export interface CharacterGuideProgressField extends CharacterGuideField {
    color: ProgressBarColor;    // Color to show for progress bar
    bar: boolean;               // Whether to display progress bar or not
    tick: number;              // Input must be factorable by this
    min: number;
    max: number;
}

export interface CharacterGuideOptionsField extends CharacterGuideField {
    options: string;
    multiple: boolean; // Whether to allow multiple choices or not
}

export interface CharacterGuideListField extends CharacterGuideField {
    items:
        | CharacterFieldType.Text
        | CharacterFieldType.Number
        | CharacterFieldType.Reference
        | CharacterFieldType.Options;
    minlength: number;
    maxLength: number;
}
