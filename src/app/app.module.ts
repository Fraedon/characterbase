import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Provider } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { MarkdownModule, MarkedOptions, MarkedRenderer } from "ngx-markdown";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./core/auth.service";
import { httpInterceptorProviders } from "./http-interceptors";

const markedOptionsFactory = (): MarkedOptions => {
    const renderer = new MarkedRenderer();
    renderer.image = () => "";
    return { renderer };
};

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
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useFactory: markedOptionsFactory,
            },
        }),
    ],
    providers: [authProvider, httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
