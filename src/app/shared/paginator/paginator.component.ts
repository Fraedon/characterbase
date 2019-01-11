import { Component, HostBinding, Input } from "@angular/core";

@Component({
    selector: "cb-paginator",
    templateUrl: "./paginator.component.html",
    styleUrls: ["./paginator.component.scss"],
})
export class PaginatorComponent {
    public get pages() {
        return Array.from({ length: Math.ceil(this.total / this.divisor) }, (v, k) => k);
    }
    @Input() public currentPage: string;
    @Input() public divisor: number;
    @Input() public total: number;

    public get previousPage() {
        return { p: this.currentPageNum };
    }

    public get nextPage() {
        return { p: this.currentPageNum + 2 };
    }

    public get currentPageNum() {
        return Number.parseInt(this.currentPage, 10);
    }

    public get canGoNextPage() {
        return (this.currentPageNum + 1) * this.divisor < this.total;
    }

    public get canGoPreviousPage() {
        return this.currentPageNum * this.divisor > 0;
    }
}
