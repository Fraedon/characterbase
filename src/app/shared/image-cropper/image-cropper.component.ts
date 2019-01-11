import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ImageCroppedEvent } from "ngx-image-cropper/src/image-cropper.component";

@Component({
    selector: "cb-image-cropper",
    templateUrl: "./image-cropper.component.html",
})
export class ImageCropperComponent {
    @Input() imageBase64: string;
    @Output() cropped = new EventEmitter<File>();

    private croppedImage: File;

    constructor(public bsModalRef: BsModalRef) {}

    public onCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.file as File;
    }

    public saveCrop() {
        this.cropped.emit(this.croppedImage);
        this.bsModalRef.hide();
    }
}
