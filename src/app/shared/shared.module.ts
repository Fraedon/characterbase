import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalModule } from "ngx-bootstrap/modal";
import { ImageCropperModule } from "ngx-image-cropper";
import { MarkdownModule } from "ngx-markdown";

import { ChangelogComponent } from "./changelog/changelog.component";
import { DynamicSizeComponent } from "./dynamic-size/dynamic-size.component";
import { InputControlComponent } from "./form/input-control/input-control.component";
import { SubmitButtonComponent } from "./form/submit-button/submit-button.component";
import { ImageCropperComponent } from "./image-cropper/image-cropper.component";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { NumberPipe } from "./number.pipe";
import { PaginatorComponent } from "./paginator/paginator.component";
import { RelativeTimePipe } from "./relative-time.pipe";
import { TitleDividerComponent } from "./title-divider/title-divider.component";
import { TruncatePipe } from "./truncate.pipe";

@NgModule({
    declarations: [
        TitleDividerComponent,
        DynamicSizeComponent,
        TruncatePipe,
        RelativeTimePipe,
        NumberPipe,
        ChangelogComponent,
        ImageUploadComponent,
        ImageCropperComponent,
        InputControlComponent,
        SubmitButtonComponent,
        PaginatorComponent,
    ],
    imports: [CommonModule, MarkdownModule.forChild(), ModalModule.forRoot(), ImageCropperModule, RouterModule],
    exports: [
        TitleDividerComponent,
        DynamicSizeComponent,
        TruncatePipe,
        RelativeTimePipe,
        NumberPipe,
        ChangelogComponent,
        ImageUploadComponent,
        ImageCropperComponent,
        InputControlComponent,
        SubmitButtonComponent,
        PaginatorComponent,
    ],
    entryComponents: [ImageCropperComponent],
})
export class SharedModule {}
