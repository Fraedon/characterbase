import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

interface APIError {
    error: string;
    message: string;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((e) => {
                if (!(e.error instanceof ErrorEvent)) {
                    const body = e.error as APIError;
                    return throwError(`[${body.error}] — ${body.message}`);
                } else {
                    return throwError("An error occured communicating with CharacterBase");
                }
            }),
        );
    }
}
