import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { Character } from "../characters.model";

@Component({
    selector: "cb-character-view-toolbar",
    templateUrl: "./character-view-toolbar.component.html",
    styleUrls: ["./character-view-toolbar.component.scss"],
})
export class CharacterViewToolbarComponent implements OnChanges, OnInit {
    public avatarUrl: string;
    @Input() public canEdit = false;
    @Input() public character: Character;
    @Output() public deleted = new EventEmitter<null>();
    public modalRef: BsModalRef;
    @Input() public showAvatar: boolean;
    @HostBinding("class") private classes = "btn-toolbar justify-content-between align-items-center";

    public constructor(private bsModalService: BsModalService) {}

    public ngOnChanges() {
        this.reloadAvatar();
    }

    public ngOnInit() {
        this.avatarUrl =
            this.character.images && this.character.images["avatar"]
                ? this.character.images["avatar"]
                : "assets/blank-avatar.png";
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.bsModalService.show(template, { class: "avatar-modal" });
    }

    private reloadAvatar() {
        if (this.character.images && this.character.images["avatar"]) {
            this.avatarUrl = this.character.images["avatar"] + "#" + new Date().getTime();
        } else {
            this.avatarUrl = "assets/blank-avatar.png";
        }
    }
}
