import { Component, ViewChild, ElementRef, AfterViewInit, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MdSnackBar } from "@angular/material";

import { IpcRendererService } from "../../services/ipcrenderer.service";

function flatten(obj, options){
    var newObj              = {};
    obj                     = obj;
    options                 = options                   || {};
    options.separator       = options.separator         || ".";
    options.arraysAsObjects = options.arraysAsObjects   || false;

    //-- Arrays and strings depends on the arraysAsObjects arguemnt
    //-- Any types different from Object, Array and String early return
    //-- Single character strings early return always
    if( [null, undefined, false].indexOf(obj) !== -1 ||
        (!options.arraysAsObjects && [Array, String].indexOf(obj.constructor) !== -1) ||
        [Object, Array, String].indexOf(obj.constructor) === -1 ||
        (obj.constructor === String && obj.length === 1)){
        return obj;
    }

    for (var key in obj) {
        if(([].concat.apply([], [options.filterOut]) || []).indexOf(key) !== -1) { continue };
        var value = flatten(obj[key], options);
        if([null, undefined, false].indexOf(value) === -1 && value.constructor === Object){
            for(var childkey in value){
                newObj[key+options.separator+childkey] = value[childkey];
            }
            continue;
        }
        newObj[key] = value;
    }
    return newObj;
}

@Component({
    selector    : "console-area",
    templateUrl : "./console-area.component.html",
    styleUrls   : [ "./console-area.component.css" ]
})
export class ConsoleAreaComponent{
    private _scrollBody         : ElementRef;
    private _scrollHeader       : ElementRef;
    private scrollListenerSet   : boolean = false;
    private _keys               : string[];
    private dataArray           : any[][];
    private _rawData            : any;
    private _loading            : boolean;

    constructor(private snackBar : MdSnackBar, private ipcRenderer : IpcRendererService){}

    @ViewChild("scrollHeader")
    set scrollHeader(scrollHeader) { this._scrollHeader = scrollHeader; }

    @ViewChild("scrollBody")
    set scrollBody(scrollBody) {
        if(this._scrollBody && this.scrollListenerSet){
            this._scrollBody.nativeElement.removeEventListener("scroll", this.childScrollListener);
            this.scrollListenerSet = false;
        }

        this._scrollBody = scrollBody;

        if(this._scrollBody && !this.scrollListenerSet){
            this._scrollBody.nativeElement.addEventListener("scroll", this.childScrollListener);
            this.scrollListenerSet = true;
        }
    }

    @Input()
    set loading(isLoading : boolean) { this._loading = isLoading;}
    get loading() { return this._loading; }

    get keys(){ return this._keys; }
    get rawData() { return this._rawData; }

    @Input()
    set data(data : any[] | string){
        this._keys      = null;
        this.dataArray  = [];
        this._loading   = false;
        this._rawData   = data;
        if(typeof data === "object"){
            data = data.map(entry => flatten(entry, { filterOut: "attributes" }));
            this._keys = Object.keys(data[0] || {});

            for (let i = 0; i < data.length; i++){
                this.dataArray.push(Object.values(data[i]));
            }
        }
    }

    isNumber(data) { return typeof data === "number" }

    get data(){ return this.dataArray; }

    childScrollListener = evt => { this._scrollHeader.nativeElement.scrollLeft = evt.target.scrollLeft; };

    getRawData(format : "json"|"csv") {
        if(format === "json") {
            return JSON.stringify(this.rawData, (key, value) => key === "attributes" ? undefined : value, 4);
        }

        if(format === "csv") {
            return this._keys.join(",") + "\n" + this.dataArray.map(val => { return val.join(",") }).join("\n");
        }

        throw new Error("Invalid output format");
    }

    copyToClipboard(type) {
        try {
            this.ipcRenderer.copyToClipboard(this.getRawData(type));
        } catch(e) {
            return this.snackBar.open(`:( Awwwn no! Data not copied. Please, try again.`, "DISMISS", { duration: 2500 });
        }
        this.snackBar.open(`Data contents copied to clipboard as ${type.toUpperCase()}`, "DISMISS", { duration: 2500 });
    }
}
