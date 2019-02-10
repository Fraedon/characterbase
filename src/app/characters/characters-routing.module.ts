import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CanDeactivateGuard } from "../shared/can-deactivate.guard";

import { CharacterCreateComponent } from "./character-create/character-create.component";
import { CharacterEditPageComponent } from "./character-edit/character-edit-page.component";
import { CharacterEditComponent } from "./character-edit/character-edit.component";
import { CharacterResolverService } from "./character-resolver.service";
import { CharacterUniverseResolverService } from "./character-universe-resolver.service";
import { CharacterViewPageComponent } from "./character-view/character-view-page.component";

const routes: Routes = [
    {
        canDeactivate: [CanDeactivateGuard],
        component: CharacterCreateComponent,
        path: "new",
        resolve: { universe: CharacterUniverseResolverService },
    },
    {
        children: [
            { component: CharacterViewPageComponent, path: "" },
            { canDeactivate: [CanDeactivateGuard], component: CharacterEditPageComponent, path: "edit" },
        ],
        path: ":characterId",
        resolve: {
            character: CharacterResolverService,
            universe: CharacterUniverseResolverService,
        },
        runGuardsAndResolvers: "always",
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CharactersRoutingModule {}
