import { Component, ViewChild, ElementRef, AfterViewInit, Input } from "@angular/core";

declare var ace;

@Component({
    selector    : "console-area",
    templateUrl : "./console-area.component.html",
    styleUrls   : [ "./console-area.component.css" ]
})
export class ConsoleAreaComponent{
    @ViewChild("console")
    private consoleArea : ElementRef;

    private _keys       : string[];
    private dataArray   : any[];

    get keys(){
        return this._keys;
    }

    @Input()
    set data(data : any[] | string){
        this._keys       = null;
        this.dataArray  = [];
        if(typeof data === "object"){
            delete (data[0] || {}).attributes;
            this._keys = Object.keys(data[0] || {});

            for (let i = 0; i < data.length; i++){
                delete data[i].attributes;
                this.dataArray.push(Object.values(data[i]));
            }
        }
    }

    get data(){
        return this.dataArray;
    }

    ngAfterViewInit(){
        var consoleArea = ace.edit(this.consoleArea.nativeElement);
        consoleArea.setTheme("ace/theme/chrome");
        consoleArea.getSession().setMode("ace/mode/makefile");
    }
}
