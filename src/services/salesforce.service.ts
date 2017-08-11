import { Injectable } from "@angular/core";
import { CredentialsService } from "./credentials.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

export interface LanguagesMap {
    soql: any;
    apex: any;
}

export interface RequestError {
    message?     : string;
    errorCode?   : string;
    statusText?  : string;
}

export interface QueryResult {
    done        : boolean;
    records     : any[];
    totalSize   : number;
}

const paths : LanguagesMap = {
    apex: ["/services/data/v34.0/tooling/sobjects/traceFlag/", "/services/data/v28.0/tooling/executeAnonymous/?anonymousBody=", "/services/data/v29.0/sobjects/ApexLog/%s/Body"],
    soql: "/services/data/v20.0/query/?q="
}

//-- Query log entry for anonymous Apex execution
const apexLogQuery = `
    SELECT Id
    FROM ApexLog
    WHERE Request = 'API'
        AND Location = 'Monitoring'
        AND Operation LIKE '%executeAnonymous%'
        AND LogUserId = '00590000000tQBwAAM'
    ORDER BY StartTime DESC, Id DESC
    LIMIT 1
`;

@Injectable()
export class SalesforceService {
    retryingError: boolean = false;

    constructor(private credentialsService : CredentialsService, private http: Http){}

    executeSOQL = (query : string) : Observable<QueryResult> => {
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        return this.http.get(`${accessData.instance_url}${paths.soql}${encodeURIComponent((query || "").trim())}`, options)
            .map( (response: Response) => <QueryResult>response.json())
            .catch(error => this.catchError(error, "soql", query));
    }

    executeApex = (code : string) : Observable<any> => {
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });
        let dateTime    = new Date();
        let traceId     = null;

        dateTime.setHours(dateTime.getUTCHours() + 1);

        //-- TODO: Add config area for the user to select its choices
        let data = {
            ApexCode        : "FINEST",
            ApexProfiling   : "ERROR",
            Callout         : "ERROR",
            Database        : "ERROR",
            ExpirationDate  : dateTime.toUTCString(),
            TracedEntityId  : (accessData.id || "").split("/").pop(),
            Validation      : "ERROR",
            Visualforce     : "ERROR",
            Workflow        : "ERROR",
            System          : "ERROR"
        };

        return this.http.post(`${accessData.instance_url}${paths.apex[0]}`, data, options)
            .flatMap( (response: Response) => {
                let json    = response.json() || {};
                traceId     = ((json.records || [])[0] || {}).Id;

                return this.http.get(`${accessData.instance_url}${paths.apex[1]}${encodeURIComponent((code || "").trim())}`, options)
            })
            .flatMap( (response: Response) => this.executeSOQL(apexLogQuery))
            .flatMap( (result : QueryResult) => {
                return this.http.get(`${accessData.instance_url}${paths.apex[2].replace(/%s/, result.records[0].Id)}`);
            })
            .map( (response : Response) => {
                //-- Try to delete the traceFlag. But the outcome is not important.
                this.http.delete(`${accessData.instance_url}${paths.apex[0]}${traceId}`).subscribe(console.log, console.log);
                return Observable.throw(response.json());
            })
            .catch(error => this.catchError(error, "soql", code));
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
                    .flatMap( data => (type === "soql") ? this.executeSOQL(code) : undefined);
            }
        } catch (e) {}

        return Observable.throw(err || { statusText: error.statusText });
    }

}
