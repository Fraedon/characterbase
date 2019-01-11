import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MarkdownModule } from "ngx-markdown";

import { SharedModule } from "../shared/shared.module";

import { CharacterCreateComponent } from "./character-create/character-create.component";
import { CharacterEditFormComponent } from "./character-edit/character-edit-form.component";
import { CharacterEditPageComponent } from "./character-edit/character-edit-page.component";
import { CharacterListItemComponent } from "./character-list/character-list-item.component";
import { CharacterListComponent } from "./character-list/character-list.component";
import { CharacterToolbarComponent } from "./character-toolbar/character-toolbar.component";
import { CharacterViewPageComponent } from "./character-view/character-view-page.component";
import { CharacterViewComponent } from "./character-view/character-view.component";
import { CharactersRoutingModule } from "./characters-routing.module";
import { FilterFieldsPipe } from "./filter-fields.pipe";
import { GuideSortPipe } from "./guide-sort.pipe";

@NgModule({
    declarations: [
        CharacterToolbarComponent,
        CharacterCreateComponent,
        CharacterEditFormComponent,
        CharacterListComponent,
        CharacterListItemComponent,
        CharacterViewPageComponent,
        CharacterViewComponent,
        CharacterEditPageComponent,
        GuideSortPipe,
        FilterFieldsPipe,
    ],
    imports: [
        CommonModule,
        CharactersRoutingModule,
        ReactiveFormsModule,
        AngularFireStorageModule,
        ScrollingModule,
        SharedModule,
        TooltipModule.forRoot(),
        MarkdownModule.forChild(),
    ],
    exports: [CharacterToolbarComponent, CharacterListComponent],
})
export class CharactersModule {}
