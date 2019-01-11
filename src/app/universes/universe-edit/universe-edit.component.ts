import { Component, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "firebase";
import { Observable } from "rxjs";
import { UniverseService } from "src/app/core/universe.service";
import { UserService } from "src/app/core/user.service";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate.guard";
import { FormStatus } from "src/app/shared/form-status.model";
import { MetaUniverse, Universe } from "../universe.model";

export enum UniverseEditPage {
    General = "general",
    Collaborators = "collaborators",
    CharacterGuide = "guide",
    Advanced = "advanced",
}

@Component({
    selector: "cb-universe-edit",
    templateUrl: "./universe-edit.component.html",
    styleUrls: ["./universe-edit.component.scss"],
})
export class UniverseEditComponent implements OnInit, CanComponentDeactivate {
    public universe: MetaUniverse;
    public user: Observable<User>;
    public status: FormStatus = { error: undefined, loading: false };
    public saved = new EventEmitter();
    private unsavedChanges = false;

    public currentPage = UniverseEditPage.General;
    public UniverseEditPage = UniverseEditPage;

    public constructor(
        private userService: UserService,
        private universeService: UniverseService,
        public route: ActivatedRoute,
        public router: Router
    ) {
        this.user = this.userService.user;
    }

    public canDeactivate() {
        if (this.unsavedChanges) {
            return confirm("You have unsaved changes. Are you sure you want to leave this page?");
        }
        return true;
    }

    public setUnsavedChanges(unsavedChanges: boolean) {
        this.unsavedChanges = unsavedChanges;
    }

    public ngOnInit() {
        this.route.data.subscribe((data: { universe: Observable<MetaUniverse> }) => {
            data.universe.first().subscribe((universe) => {
                this.universe = universe;
            });
        });
        this.route.fragment.subscribe((fragment) => {
            switch (fragment as UniverseEditPage) {
                case UniverseEditPage.Advanced: {
                    this.currentPage = UniverseEditPage.Advanced;
                    break;
                }
                case UniverseEditPage.CharacterGuide: {
                    this.currentPage = UniverseEditPage.CharacterGuide;
                    break;
                }
                case UniverseEditPage.Collaborators: {
                    this.currentPage = UniverseEditPage.Collaborators;
                    break;
                }
                case UniverseEditPage.General: {
                    this.currentPage = UniverseEditPage.General;
                    break;
                }
                default: {
                    this.router.navigate(["./"], { fragment: UniverseEditPage.General, relativeTo: this.route });
                }
            }
        });
    }

    public async onSaveChanges(data: Universe) {
        this.status = { error: undefined, loading: true };
        try {
            await this.universeService.updateUniverse(this.universe.meta.id, data);
            this.unsavedChanges = false;
            this.status.loading = false;
            this.saved.emit();
        } catch (err) {
            this.status.error = err;
        }
    }

    public async onDeleteUniverse() {
        const universeName = this.universe.data.name;
        const confirmation = confirm(
            `Are you SURE you want to delete "${universeName}"?\n\n` +
                "By deleting this universe, you will also be deleting all of the characters in it. This action is irreversible."
        );
        if (confirmation) {
            await this.router.navigate(["/"]);
            await this.universeService.deleteUniverse(this.universe.meta.id);
            alert(`${universeName} has been deleted.`);
        }
    }

    public async onDeleteCharacters() {
        const confirmation = confirm(
            `Are you SURE you want to delete all of the characters in ${this.universe.data.name}?\n\n` +
                "This action is irreversible."
        );
        if (confirmation) {
            this.universeService
                .deleteUniverseCharacters(this.universe.meta.id)
                .first()
                .subscribe(() => {
                    alert("All characters have been deleted.");
                });
        }
    }

    public switchPage(page: UniverseEditPage) {
        this.currentPage = page;
    }
}
