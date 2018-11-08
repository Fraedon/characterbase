import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UniverseDashboardPageComponent } from "./universe-dashboard/universe-dashboard.component";
import { UniverseCreateComponent } from "./universe-create/universe-create.component";
import { UniversePageComponent } from "./universe-page/universe-page.component";
import { UniverseGuard } from "./universe.guard";
import { UniverseEditComponent } from "./universe-edit/universe-edit.component";
import { UniverseResolverService } from "./universe-resolver.service";

const routes: Routes = [
    {
        path: "",
        component: UniverseDashboardPageComponent,
        children: [
            { path: "new", component: UniverseCreateComponent },
            {
                path: "u/:universeId",
                canActivate: [UniverseGuard],
                children: [
                    { path: "", component: UniversePageComponent },
                    { path: "edit", component: UniverseEditComponent, resolve: { universe: UniverseResolverService } },
                    { path: "c", loadChildren: "../characters/characters.module#CharactersModule" },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UniversesRoutingModule {}
