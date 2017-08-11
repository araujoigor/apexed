import { Component, ViewChild, OnDestroy } from "@angular/core";

import { Observable } from 'rxjs/Rx';

import { SalesforceService, LanguagesMap, RequestError, QueryResult } from "../../services/salesforce.service";
import { EditorAreaComponent } from "../EditorAreaComponent/editor-area.component";
import { ConsoleAreaComponent } from "../ConsoleAreaComponent/console-area.component";
import { IpcRendererService } from "../../services/ipcrenderer.service";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector    : "tab",
    templateUrl : "./tab.component.html",
    styleUrls   : ["./tab.component.css"]
})
export class TabComponent implements OnDestroy{

    @ViewChild(EditorAreaComponent) editorArea : EditorAreaComponent;
    @ViewChild(ConsoleAreaComponent) consoleArea : ConsoleAreaComponent;

    modeMap         : LanguagesMap          = { soql: "sql", apex: "java" };
    languages       : any[]                 = Object.keys(this.modeMap);
    currentLanguage : keyof LanguagesMap    = "soql";
    tabStatus       : string                = "";
    queryTimestamp  : number                = 0;

    constructor(private salesforce : SalesforceService, private ipcRendererService : IpcRendererService){
        this.ipcRendererService.registerMessageObserver("execute-code", this.execute);
    }

    public execute = () => {
        this.queryTimestamp         = Date.now();
        this.consoleArea.data       = [];
        this.consoleArea.loading    = true;
        let method                  = (this.currentLanguage === "soql") ? this.salesforce.executeSOQL : this.salesforce.executeApex;
        method(this.editorArea.getEditorContent()).subscribe(this.handleQueryResult, this.handleQueryError);
    }

    public handleQueryResult = (resp : QueryResult) => {
        console.log(resp);
        this.consoleArea.data = resp.records;

        let queryElapsed = (Date.now() - this.queryTimestamp)/1000;
        this.tabStatus = "Query executed in " + queryElapsed.toFixed(2) + " seconds";
    }

    public handleQueryError = (error : RequestError) => {
        console.log(error);
        this.tabStatus = "Error while executing query: " + (error.errorCode);
        this.consoleArea.error = error;
        this.consoleArea.loading = false;
    }

    ngOnDestroy() {
        this.ipcRendererService.unregisterMessageObserver("execute-code", this.execute);
    }

}
