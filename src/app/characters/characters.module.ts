import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CharactersRoutingModule } from "./characters-routing.module";
import { CharacterToolbarComponent } from "./character-toolbar/character-toolbar.component";
import { CharacterCreateComponent } from "./character-create/character-create.component";
import { CharacterCreateFormComponent } from "./character-create/character-create-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        CharacterToolbarComponent,
        CharacterCreateComponent,
        CharacterCreateFormComponent,
    ],
    imports: [CommonModule, CharactersRoutingModule, ReactiveFormsModule, SharedModule],
    exports: [CharacterToolbarComponent],
})
export class CharactersModule {}
