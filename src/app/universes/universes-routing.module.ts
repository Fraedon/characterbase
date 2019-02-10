import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingsPageComponent } from "../auth/settings/settings-page.component";
import { CanDeactivateGuard } from "../shared/can-deactivate.guard";

import { UniverseCharactersResolverService } from "./universe-characters-resolver.service";
import { UniverseCollaboratorsResolverService } from "./universe-collaborators-resolver.service";
import { UniverseCreateComponent } from "./universe-create/universe-create.component";
import { UniverseDashboardPageComponent } from "./universe-dashboard/universe-dashboard.component";
import { UniverseEditCollaboratorsComponent } from "./universe-edit/collaborators/universe-edit-collaborators.component";
import { UniverseEditGeneralComponent } from "./universe-edit/general/universe-edit-general.component";
import { UniverseEditGuideComponent } from "./universe-edit/guide/universe-edit-guide.component";
import { UniverseEditSettingsComponent } from "./universe-edit/settings/universe-edit-settings.component";
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
                                children: [
                                    { loadChildren: "../characters/characters.module#CharactersModule", path: "c" },
                                ],
                                path: "",
                                resolve: { characters: UniverseCharactersResolverService },
                            },
                            {
                                component: UniverseEditComponent,
                                children: [
                                    {
                                        path: "general",
                                        component: UniverseEditGeneralComponent,
                                        canDeactivate: [CanDeactivateGuard],
                                    },
                                    {
                                        path: "collaborators",
                                        component: UniverseEditCollaboratorsComponent,
                                        canDeactivate: [CanDeactivateGuard],
                                    },
                                    {
                                        path: "guide",
                                        component: UniverseEditGuideComponent,
                                        canDeactivate: [CanDeactivateGuard],
                                    },
                                    {
                                        path: "settings",
                                        component: UniverseEditSettingsComponent,
                                        canDeactivate: [CanDeactivateGuard],
                                    },
                                ],
                                path: "edit",
                            },
                        ],
                        path: ":universeId",
                        resolve: {
                            universe: UniverseResolverService,
                            collaborators: UniverseCollaboratorsResolverService,
                        },
                    },
                ],
                path: "u",
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
