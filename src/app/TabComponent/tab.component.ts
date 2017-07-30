import { Component, ViewChild } from "@angular/core";

import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import { CredentialsService } from "../../services/credentials.service";
import { EditorAreaComponent } from "../EditorAreaComponent/editor-area.component";
import { ConsoleAreaComponent } from "../ConsoleAreaComponent/console-area.component";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

interface LanguageMode {
    name: string;
    mode: string;
}

const langMap : LanguageMode[] = [
    { name: "SOQL", mode: "sql" },
    { name: "Apex", mode: "java" }
];

@Component({
    selector    : "tab",
    templateUrl : "./tab.component.html",
    styleUrls   : ["./tab.component.css"],
    providers   : [ CredentialsService ]
})
export class TabComponent{

    @ViewChild(EditorAreaComponent) editorArea : EditorAreaComponent;
    @ViewChild(ConsoleAreaComponent) consoleArea : ConsoleAreaComponent;

    retryingError   : boolean           = false;
    languages       : LanguageMode[]    = langMap;
    tabLanguage     : string            = this.languages[0].mode;
    tabStatus       : string            = "";

    queryTimestamp  : number            = 0;

    constructor(private http: Http, private credentialsService : CredentialsService){}

    public execute(){
        this.queryTimestamp     = Date.now();
        this.consoleArea.data   = [];

        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        this.consoleArea.loading = true;

        this.http.get(`${accessData.instance_url}/services/data/v20.0/query/?q=${encodeURIComponent(this.editorArea.getEditorContent().trim())}`, options)
            .map( (response: Response) => response.json())
            .catch( error => Observable.throw(error))
            .subscribe(this.handleQueryResult, this.handleQueryError);
    }

    public handleQueryResult = (resp) => {
        console.log(resp);
        this.consoleArea.data = resp.records;

        let queryElapsed = (Date.now() - this.queryTimestamp)/1000;
        this.tabStatus = "Query executed in " + queryElapsed.toFixed(2) + " seconds";
    }

    public handleQueryError = (error) => {
        let cause;
        try {
            cause = JSON.parse(error._body)[0].errorCode;
            if(cause === "INVALID_SESSION_ID" && !this.retryingError){
                this.retryingError = true;
                this.tabStatus = "Invalid session ID. Re-authenticating";
                this.credentialsService.retrieveAccessData()
                    .subscribe( data => this.execute(), console.log );
                return;
            }
        } catch (e) {
            console.log(e);
        }
        console.log(error);
        this.tabStatus = "Error while executing query: " + cause || error;
        this.retryingError = false;
        this.consoleArea.loading = false;
    }

}
