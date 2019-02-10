import { Component, Input } from "@angular/core";

import { SubmitButtonState } from "../shared/submit-button-state.enum";

@Component({
    selector: "cb-submit-button",
    templateUrl: "./submit-button.component.html",
})
export class SubmitButtonComponent {
    @Input() public fluid: boolean;
    @Input() public state: SubmitButtonState;
    public SubmitButtonState = SubmitButtonState;
    @Input() public text: string;
    @Input() public textDisabled: string;
    @Input() public textLoading: string;

    public getFluid() {
        return this.fluid ? "btn-block" : "";
    }

    public getText() {
        switch (this.state) {
            case SubmitButtonState.Disabled:
                if (this.text) {
                    return this.text;
                } else {
                    return this.textDisabled || "Submit";
                }
            case SubmitButtonState.Loading:
                return this.textLoading || "Loading";
            default:
                return this.text || "Submit";
        }
    }

    public isDisabled() {
        return this.state === SubmitButtonState.Disabled || this.state === SubmitButtonState.Loading;
    }
}
