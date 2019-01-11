import { Component, Input } from "@angular/core";

@Component({
    selector: "cb-submit-button",
    templateUrl: "./submit-button.component.html",
})
export class SubmitButtonComponent {
    @Input() public canSubmit: boolean;
    @Input() public loading: boolean;
    @Input() public text: string;
    @Input() public textDisabled: string;
    @Input() public textLoading: string;
}
