import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ImageCropperModule } from "ngx-image-cropper";
import { MarkdownModule } from "ngx-markdown";

import { DynamicSizeComponent } from "./dynamic-size/dynamic-size.component";
import { CheckboxControlComponent } from "./form/checkbox-control/checkbox-control.component";
import { FormStatusComponent } from "./form/form-status/form-status.component";
import { InputControlComponent } from "./form/input-control/input-control.component";
import { ProgressControlComponent } from "./form/progress-control/progress-control.component";
import { SelectControlComponent } from "./form/select-control/select-control.component";
import { SubmitButtonComponent } from "./form/submit-button/submit-button.component";
import { TextAreaControlComponent } from "./form/textarea-control/textarea-control.component";
import { HeaderComponent } from "./header/header.component";
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
        ImageUploadComponent,
        ImageCropperComponent,
        InputControlComponent,
        SubmitButtonComponent,
        PaginatorComponent,
        TextAreaControlComponent,
        FormStatusComponent,
        CheckboxControlComponent,
        SelectControlComponent,
        ProgressControlComponent,
        HeaderComponent,
    ],
    imports: [CommonModule, MarkdownModule.forChild(), ImageCropperModule, RouterModule],
    exports: [
        TitleDividerComponent,
        DynamicSizeComponent,
        TruncatePipe,
        RelativeTimePipe,
        NumberPipe,
        ImageUploadComponent,
        ImageCropperComponent,
        InputControlComponent,
        SubmitButtonComponent,
        PaginatorComponent,
        TextAreaControlComponent,
        FormStatusComponent,
        CheckboxControlComponent,
        SelectControlComponent,
        ProgressControlComponent,
        HeaderComponent,
    ],
    entryComponents: [ImageCropperComponent],
})
export class SharedModule {}
