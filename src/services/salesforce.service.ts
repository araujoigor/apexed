import { Injectable } from "@angular/core";
import { CredentialsService } from "./credentials.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class SalesforceService {
    retryingError   : boolean           = false;

    constructor(private credentialsService : CredentialsService, private http: Http){}

    executeQuery(query) : Observable<any> {
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        return this.http.get(`${accessData.instance_url}/services/data/v20.0/query/?q=${encodeURIComponent((query || "").trim())}`, options)
            .map( (response: Response) => response.json())
            .catch(error => this.catchError(error, query));

    }

    executeApex(code) : Observable<any> {
        return Observable.create();
    }

    catchError(error, query) : Observable<any>{
        let cause;
        try {
            cause = JSON.parse(error._body)[0].errorCode;
            if(cause === "INVALID_SESSION_ID" && !this.retryingError){
                this.retryingError = true;
                return this.credentialsService.retrieveAccessData()
                    .flatMap( data => this.executeQuery(query));
                //TODO: Fix this. It do not work.
            }
        } catch (e) {}
        return Observable.throw(error);
    }

}
