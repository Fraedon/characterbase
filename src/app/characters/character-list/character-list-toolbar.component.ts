import { Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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
export class CharacterListToolbarComponent implements OnChanges {
    @Output() public search = new EventEmitter<string>();
    public searchForm = new FormGroup({
        search: new FormControl("yeet"),
    });
    @Input() public universe: Universe;

    public constructor(private router: Router) {}

    public ngOnChanges() {
        this.searchForm.reset();
    }
}
