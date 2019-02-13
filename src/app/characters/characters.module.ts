import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MarkdownModule } from "ngx-markdown";

import { SharedModule } from "../shared/shared.module";

import { CharacterCreateComponent } from "./character-create/character-create.component";
import { CharacterEditFieldComponent } from "./character-edit/character-edit-field.component";
import { CharacterEditGroupComponent } from "./character-edit/character-edit-group.component";
import { CharacterEditPageComponent } from "./character-edit/character-edit-page.component";
import { CharacterEditComponent } from "./character-edit/character-edit.component";
import { CharacterListItemComponent } from "./character-list/character-list-item.component";
import { CharacterListToolbarComponent } from "./character-list/character-list-toolbar.component";
import { CharacterListComponent } from "./character-list/character-list.component";
import { CharacterViewFieldComponent } from "./character-view/character-view-field.component";
import { CharacterViewGroupComponent } from "./character-view/character-view-group.component";
import { CharacterViewPageComponent } from "./character-view/character-view-page.component";
import { CharacterViewToolbarComponent } from "./character-view/character-view-toolbar.component";
import { CharacterViewComponent } from "./character-view/character-view.component";
import { CharactersRoutingModule } from "./characters-routing.module";
import { FilterFieldsPipe } from "./filter-fields.pipe";
import { GuideSortPipe } from "./guide-sort.pipe";

@NgModule({
    declarations: [
        CharacterViewToolbarComponent,
        CharacterListToolbarComponent,
        CharacterCreateComponent,
        CharacterListComponent,
        CharacterListItemComponent,
        CharacterViewPageComponent,
        CharacterViewComponent,
        CharacterEditComponent,
        CharacterEditGroupComponent,
        CharacterEditFieldComponent,
        GuideSortPipe,
        FilterFieldsPipe,
        CharacterEditPageComponent,
        CharacterViewGroupComponent,
        CharacterViewFieldComponent,
    ],
    imports: [
        CommonModule,
        CharactersRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        ScrollingModule,
        SharedModule,
        BsDropdownModule,
        PaginationModule,
        TooltipModule,
        PopoverModule,
        MarkdownModule.forChild(),
    ],
    exports: [CharacterListComponent],
})
export class CharactersModule {}
