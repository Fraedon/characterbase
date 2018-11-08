import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CharacterCreateComponent } from "./character-create/character-create.component";
import { UniverseResolverService } from "../universes/universe-resolver.service";

const routes: Routes = [
    { path: "new", component: CharacterCreateComponent, resolve: { universe: UniverseResolverService } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CharactersRoutingModule {}
