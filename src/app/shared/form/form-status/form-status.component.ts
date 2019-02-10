import { Component, Input } from "@angular/core";

import { FormStatus } from "../../form-status.model";

@Component({
    selector: "cb-form-status",
    templateUrl: "./form-status.component.html",
    styleUrls: [],
})
export class FormStatusComponent {
    @Input() public status: FormStatus;

    public canShowAlert() {
        return !this.status.loading && (this.status.error || this.status.success);
    }

    public getAlertClass() {
        return this.status.error ? "alert-danger" : "alert-success";
    }

    public getText() {
        return this.status.error ? this.status.error : this.status.success;
    }
}
