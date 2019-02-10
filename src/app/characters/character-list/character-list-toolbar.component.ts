import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, throttleTime } from "rxjs/operators";
import { Universe } from "src/app/universes/shared/universe.model";

import { Character, CharacterFieldType, CharacterGuideGroup, CharacterSort } from "../characters.model";

@Component({
    selector: "cb-character-list-toolbar",
    templateUrl: "./character-list-toolbar.component.html",
    styleUrls: ["./character-list-toolbar.component.scss"],
})
export class CharacterListToolbarComponent {
    @Output() public search = new EventEmitter<string>();
    @Input() public universe: Universe;

    public constructor(private router: Router) {}
}
