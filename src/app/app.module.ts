import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Provider } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MarkdownModule, MarkedOptions } from "ngx-markdown";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./core/auth.service";
import { httpInterceptorProviders } from "./http-interceptors";

const authProvider = {
    provide: APP_INITIALIZER,
    useFactory: (authService: AuthService) => () =>
        authService
            .profile()
            .toPromise()
            .catch(() => Promise.resolve()),
    deps: [AuthService],
    multi: true,
} as Provider;

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AuthModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        PaginationModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useValue: {
                    tables: true,
                    smartypants: true,
                    gfm: true,
                },
            },
        }),
    ],
    providers: [authProvider, httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
