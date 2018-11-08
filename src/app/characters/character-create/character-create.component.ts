import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { UniverseResolve } from "src/app/universes/universe-resolver.service";
import { Universe } from "src/app/universes/universe.model";

@Component({
    selector: "cb-character-create",
    templateUrl: "./character-create.component.html",
})
export class CharacterCreateComponent implements OnInit {
    public universe: Universe;

    public constructor(public route: ActivatedRoute) { }

    public ngOnInit() {
        this.route.data.subscribe((data: { universe: UniverseResolve }) => {
            delete data.universe.meta;
            this.universe = data.universe;
        });
    }
}
