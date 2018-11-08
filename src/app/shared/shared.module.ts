import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TitleDividerComponent } from "./title-divider/title-divider.component";

@NgModule({
    declarations: [TitleDividerComponent],
    imports: [CommonModule],
    exports: [TitleDividerComponent],
})
export class SharedModule {}
