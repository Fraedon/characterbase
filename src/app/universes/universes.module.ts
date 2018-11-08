import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { UniversesRoutingModule } from "./universes-routing.module";
import { UniverseDashboardPageComponent } from "./universe-dashboard/universe-dashboard.component";
import { UniverseListComponent } from "./universe-sidebar/universe-list.component";
import { UniverseSidebarComponent } from "./universe-sidebar/universe-sidebar.component";
import { RouterModule } from "@angular/router";
import { UniverseCreateComponent } from "./universe-create/universe-create.component";
import { UniverseCreateFormComponent } from "./universe-create/universe-create-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UniversePageComponent } from "./universe-page/universe-page.component";
import { UniverseEditComponent } from "./universe-edit/universe-edit.component";
import { UniverseEditFormComponent } from "./universe-edit/universe-edit-form.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CharactersModule } from "../characters/characters.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        UniverseDashboardPageComponent,
        UniverseListComponent,
        UniverseSidebarComponent,
        UniverseCreateComponent,
        UniverseCreateFormComponent,
        UniversePageComponent,
        UniverseEditComponent,
        UniverseEditFormComponent,
    ],
    imports: [
        CommonModule,
        UniversesRoutingModule,
        RouterModule,
        ReactiveFormsModule,
        DragDropModule,
        SharedModule,
        CharactersModule,
        BsDropdownModule.forRoot(),
    ],
})
export class UniversesModule {}
