import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivateGuard } from "../shared/can-deactivate.guard";
import { UniverseResolverService } from "../universes/universe-resolver.service";
import { CharacterCreateComponent } from "./character-create/character-create.component";
import { CharacterEditPageComponent } from "./character-edit/character-edit-page.component";
import { CharacterResolverService } from "./character-resolver.service";
import { CharacterViewPageComponent } from "./character-view/character-view-page.component";

const routes: Routes = [
    {
        canDeactivate: [CanDeactivateGuard],
        component: CharacterCreateComponent,
        path: "new",
        resolve: { universe: UniverseResolverService },
    },
    {
        children: [
            { component: CharacterViewPageComponent, path: "" },
            { canDeactivate: [CanDeactivateGuard], component: CharacterEditPageComponent, path: "edit" },
        ],
        path: ":characterId",
        resolve: {
            character: CharacterResolverService,
            universe: UniverseResolverService,
        },
        runGuardsAndResolvers: "always",
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CharactersRoutingModule {}
