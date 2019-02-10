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
    public expandName = false;
    public expandTag = false;
    public modalRef: BsModalRef;
    @Input() public showAvatar: boolean;
    @HostBinding("class") private classes = "btn-toolbar justify-content-between align-items-center";

    public constructor(private bsModalService: BsModalService) {}

    public ngOnChanges() {
        this.reloadAvatar();
        this.expandName = false;
        this.expandTag = false;
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

    public toggleExpandName() {
        if (this.character.name.length > 24) {
            this.expandName = !this.expandName;
        }
    }

    public toggleExpandTag() {
        if (this.character.tag.length > 18) {
            this.expandTag = !this.expandTag;
        }
    }

    private reloadAvatar() {
        if (this.character.images && this.character.images["avatar"]) {
            this.avatarUrl = this.character.images["avatar"] + "#" + new Date().getTime();
        } else {
            this.avatarUrl = "assets/blank-avatar.png";
        }
    }
}
