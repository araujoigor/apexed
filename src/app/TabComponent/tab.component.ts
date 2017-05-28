import { Component, ViewChild } from "@angular/core";

import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import { CredentialsService } from "../../services/credentials.service";
import { EditorAreaComponent } from "../EditorAreaComponent/editor-area.component";
import { ConsoleAreaComponent } from "../ConsoleAreaComponent/console-area.component";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector    : "tab",
    templateUrl : "./tab.component.html",
    styleUrls   : ["./tab.component.css"],
    providers   : [ CredentialsService ]
})
export class TabComponent{

    @ViewChild(EditorAreaComponent) editorArea : EditorAreaComponent;
    @ViewChild(ConsoleAreaComponent) consoleArea : ConsoleAreaComponent;
    retryingError : boolean = false;

    constructor(private http: Http, private credentialsService : CredentialsService){}

    public execute(){
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        this.http.get(`${accessData.instance_url}/services/data/v20.0/query/?q=${encodeURIComponent(this.editorArea.getEditorContent().trim())}`, options)
            .map( (response: Response) => response.json())
            .catch( error => Observable.throw(error))
            .subscribe(this.handleQueryResult, this.handleQueryError);
    }

    public handleQueryResult = (resp) => {
        console.log(resp);
        this.consoleArea.data = resp.records;
    }

    public handleQueryError = (error) => {
        try {
            let cause = JSON.parse(error._body)[0].errorCode;
            if(cause === "INVALID_SESSION_ID" && !this.retryingError){
                this.retryingError = true;
                this.credentialsService.retrieveAccessData()
                    .subscribe( data => this.execute(), console.log );
                return;
            }
        } catch (e) {
            console.log(e);
        }
        console.log(error);
        this.retryingError = false;
    }

}
