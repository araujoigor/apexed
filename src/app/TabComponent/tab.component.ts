import { Component, ViewChild } from "@angular/core";

import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import { CredentialsService } from "../../services/credentials.service";
import { EditorAreaComponent } from "../EditorAreaComponent/editor-area.component";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const { querystring } = require("querystring");

@Component({
    selector    : "tab",
    templateUrl : "./tab.component.html",
    styleUrls   : ["./tab.component.css"],
    providers   : [ CredentialsService ]
})
export class TabComponent{

    @ViewChild(EditorAreaComponent) editorArea : EditorAreaComponent;

    constructor(private http: Http, private credentialsService : CredentialsService){}

    public execute(){
        let accessData  = this.credentialsService.getAccessData();
        let headers     = new Headers({ "Authorization" : `${accessData.token_type} ${accessData.access_token}`});
        let options     = new RequestOptions({ headers: headers });

        this.http.get(`${accessData.instance_url}/services/data/v20.0/query/?q=${encodeURIComponent(this.editorArea.getEditorContent().trim())}`, options)
            .map( (response: Response) => response.json())
            .catch( error => Observable.throw(error.json().error || "Server Error"))
            .subscribe(resp => console.log(resp), err => console.log(err));
    }

}
