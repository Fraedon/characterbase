import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AuthModule } from "../auth/auth.module";
import { CharactersModule } from "../characters/characters.module";
import { SharedModule } from "../shared/shared.module";
import { UniverseCreateFormComponent } from "./universe-create/universe-create-form.component";
import { UniverseCreateComponent } from "./universe-create/universe-create.component";
import { UniverseDashboardPageComponent } from "./universe-dashboard/universe-dashboard.component";
import { UniverseEditFormComponent } from "./universe-edit/universe-edit-form.component";
import { UniverseEditComponent } from "./universe-edit/universe-edit.component";
import { UniverseLandingPageComponent } from "./universe-landing/universe-landing-page.component";
import { UniversePageComponent } from "./universe-page/universe-page.component";
import { UniverseListComponent } from "./universe-sidebar/universe-list.component";
import { UniverseSidebarComponent } from "./universe-sidebar/universe-sidebar.component";
import { UniversesRoutingModule } from "./universes-routing.module";

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
        UniverseLandingPageComponent,
    ],
    imports: [
        CommonModule,
        UniversesRoutingModule,
        RouterModule,
        ReactiveFormsModule,
        DragDropModule,
        SharedModule,
        AuthModule,
        CharactersModule,
        BsDropdownModule.forRoot(),
    ],
})
export class UniversesModule {}
