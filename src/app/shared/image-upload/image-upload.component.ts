import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BsModalService } from "ngx-bootstrap/modal";

import { ImageCropperComponent } from "../image-cropper/image-cropper.component";

@Component({
    selector: "cb-image-upload",
    templateUrl: "./image-upload.component.html",
    styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnDestroy, OnInit {
    public get canDelete() {
        return this.deleteAllowed && this.initialImage && !this.initialImageDeleted ? true : this.image ? true : false;
    }
    @Input() public canMinimize: boolean;
    @HostBinding("class") public classes = "card";
    @Input() public deleteAllowed = true;
    @Input() public doCrop: boolean;

    public image: File = null;
    public imageHeight = 0;
    public imageSrc = "";
    @Input() public initialImage: string;
    public initialImageDeleted = false;
    public minimized = true;
    @Input() public title = "image";
    @Output() public uploaded = new EventEmitter<File | null>();

    public constructor(
        private domSanitizer: DomSanitizer,
        private changeDetector: ChangeDetectorRef,
        private modalService: BsModalService,
    ) {}

    public beginCrop(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const initialState = { imageBase64: reader.result };
            const modalRef = this.modalService.show(ImageCropperComponent, { ignoreBackdropClick: true, initialState });
            (modalRef.content as ImageCropperComponent).cropped.subscribe((croppedFile) => {
                if (croppedFile) {
                    this.removeImage(true);
                    this.setImage(croppedFile);
                }
            });
        };
        reader.onerror = console.error;
    }

    public broadcastChanges() {
        this.changeDetector.detectChanges();
    }

    public ngOnDestroy() {
        this.removeImage(false);
    }

    public ngOnInit() {
        this.changeDetector.detectChanges();
    }

    public onUploadAvatar(event: Event) {
        if (event && (event.target as HTMLInputElement).files[0]) {
            this.removeImage();
            const file = (event.target as HTMLInputElement).files[0];
            if (this.doCrop) {
                this.beginCrop(file);
            } else {
                this.setImage(file);
            }
        }
    }

    public toggleMinimize() {
        if (this.canMinimize) {
            this.minimized = !this.minimized;
        }
    }

    private removeImage(detectChanges = true, emit = false) {
        if (this.imageSrc) {
            URL.revokeObjectURL(this.imageSrc);
            this.imageSrc = "";
            this.uploaded.emit(null);
        }
        if (this.initialImage && !this.initialImageDeleted) {
            this.initialImageDeleted = true;
        }
        this.image = null;
        this.imageHeight = 0;
        this.minimized = false;
        if (detectChanges) {
            this.broadcastChanges();
        }
        if (emit) {
            this.uploaded.emit(null);
        }
    }

    private setImage(file: File) {
        const objectUrl = URL.createObjectURL(file as any);
        this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(objectUrl) as string;
        this.image = file;
        this.minimized = false;
        this.uploaded.emit(file);
    }
}
