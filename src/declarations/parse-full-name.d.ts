declare module "parse-full-name" {
    export function parseFullName(name: string): ParsedFullName;

    export interface ParsedFullName {
        error: string[];
        first: string;
        last: string;
        middle: string;
        nick: string;
        suffix: string;
        title: string;
    }
}
