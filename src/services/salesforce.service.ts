import { Injectable } from "@angular/core";
import { CredentialsService } from "./credentials.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

export interface LanguagesMap {
    soql: string;
    apex: string;
}

export interface RequestError {
    message?     : string;
    errorCode?   : string;
    statusText?  : string;
}

const paths : LanguagesMap = {
    apex: "/services/data/v28.0/tooling/executeAnonymous/?anonymousBody=",
    soql: "/services/data/v20.0/query/?q="
}

@Injectable()
export class SalesforceService {
    retryingError: boolean = false;

    constructor(private credentialsService : CredentialsService, private http: Http){}

    execute(type : keyof LanguagesMap , code : string) : Observable<any> {
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        return this.http.get(`${accessData.instance_url}${paths[type]}${encodeURIComponent((code || "").trim())}`, options)
            .map( (response: Response) => response.json())
            .catch(error => this.catchError(error, type, code));
    }

    catchError(error, type : keyof LanguagesMap, code : string) : Observable<any>{
        let err     : RequestError;
        let cause   : string;
        try {
            err = JSON.parse(error._body)[0];
            cause  = (err || <RequestError>{}).errorCode;
            if(cause === "INVALID_SESSION_ID" && !this.retryingError){
                this.retryingError = true;
                return this.credentialsService.retrieveAccessData()
                    .flatMap( data => this.execute(type, code));
                //TODO: Fix this. It do not work.
            }
        } catch (e) {}

        return Observable.throw(err || { statusText: error.statusText });
    }

}
