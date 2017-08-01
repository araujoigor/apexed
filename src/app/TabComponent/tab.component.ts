import { Component, ViewChild } from "@angular/core";

import { Observable } from 'rxjs/Rx';

import { SalesforceService } from "../../services/salesforce.service";
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
    providers   : [ SalesforceService ]
})
export class TabComponent{

    @ViewChild(EditorAreaComponent) editorArea : EditorAreaComponent;
    @ViewChild(ConsoleAreaComponent) consoleArea : ConsoleAreaComponent;


    languages       : LanguageMode[]    = langMap;
    tabLanguage     : string            = this.languages[0].mode;
    tabStatus       : string            = "";

    queryTimestamp  : number            = 0;

    constructor(private salesforce : SalesforceService){}

    public execute(){
        this.queryTimestamp     = Date.now();
        this.consoleArea.data   = [];
        this.consoleArea.loading = true;

        this.salesforce.executeQuery(this.editorArea.getEditorContent())
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

        console.log(error);
        this.tabStatus = "Error while executing query: " + (cause || error);
        this.consoleArea.loading = false;
    }

}
