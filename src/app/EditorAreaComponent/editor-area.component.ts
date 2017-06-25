import { Component, ViewChild, ElementRef, AfterViewInit, Input } from "@angular/core";

import "ace-builds/src/ace";
import "ace-builds/src/mode-sql";
import "ace-builds/src/mode-java";
import "ace-builds/src/theme-eclipse";

declare var ace;

@Component({
    selector    : "editor-area",
    templateUrl : "./editor-area.component.html"
})
export class EditorAreaComponent implements AfterViewInit{

    @ViewChild("editor") editor: ElementRef;

    private aceEditor   : any;
    private _mode       : string;

    @Input("mode")
    set mode(mode : string){
        this._mode = mode;
        if(this.aceEditor) {
            this.aceEditor.getSession().setMode("ace/mode/" + mode);
        }
    }

    get mode() : string {
        return this._mode;
    }

    ngAfterViewInit(){
        this.aceEditor = ace.edit(this.editor.nativeElement);
        this.aceEditor.setTheme("ace/theme/eclipse");
        this.aceEditor.getSession().setMode("ace/mode/sql");
    }

    public getEditorContent() {
        return this.aceEditor.getValue();
    }
}
