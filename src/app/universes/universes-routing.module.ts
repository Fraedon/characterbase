import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingsPageComponent } from "../auth/settings/settings-page.component";
import { CanDeactivateGuard } from "../shared/can-deactivate.guard";

import { UniverseCreateComponent } from "./universe-create/universe-create.component";
import { UniverseDashboardPageComponent } from "./universe-dashboard/universe-dashboard.component";
import { UniverseEditComponent } from "./universe-edit/universe-edit.component";
import { UniverseLandingPageComponent } from "./universe-landing/universe-landing-page.component";
import { UniversePageComponent } from "./universe-page/universe-page.component";
import { UniverseResolverService } from "./universe-resolver.service";
import { UniverseGuard } from "./universe.guard";
import { UserUniversesResolverService } from "./user-universes-resolver.service";

const routes: Routes = [
    {
        children: [
            { component: SettingsPageComponent, path: "settings" },
            {
                children: [
                    { component: UniverseCreateComponent, path: "new" },
                    {
                        canActivate: [UniverseGuard],
                        children: [
                            {
                                component: UniversePageComponent,
                                path: "",
                            },
                            {
                                canDeactivate: [CanDeactivateGuard],
                                component: UniverseEditComponent,
                                path: "edit",
                                resolve: { universe: UniverseResolverService },
                            },
                            { loadChildren: "../characters/characters.module#CharactersModule", path: "c" },
                        ],
                        path: ":universeId",
                    },
                ],
                path: "u",
                runGuardsAndResolvers: "always",
            },
            { component: UniverseLandingPageComponent, path: "" },
        ],
        component: UniverseDashboardPageComponent,
        path: "",
        resolve: { universes: UserUniversesResolverService },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UniversesRoutingModule {}
