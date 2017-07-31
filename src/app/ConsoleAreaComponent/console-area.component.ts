import { Component, ViewChild, ElementRef, AfterViewInit, Input } from "@angular/core";

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
    private _scrollBody : ElementRef;
    private _scrollHeader: ElementRef;

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

    @ViewChild("scrollHeader")
    set scrollHeader(scrollHeader) {
        this._scrollHeader = scrollHeader;
        console.log("set scrollheader");
    }

    private scrollListenerSet : boolean = false;

    private _keys       : string[];
    private dataArray   : any[];
    private _loading    : boolean;

    get loading() { return this._loading; }

    @Input()
    set loading(isLoading : boolean) {
        this._loading = isLoading;
    }

    get keys(){ return this._keys; }

    @Input()
    set data(data : any[] | string){
        this._keys      = null;
        this.dataArray  = [];
        this._loading   = false;
        if(typeof data === "object"){
            data = data.map(entry => flatten(entry, { filterOut: "attributes" }));
            this._keys = Object.keys(data[0] || {});

            for (let i = 0; i < data.length; i++){
                this.dataArray.push(Object.values(data[i]));
            }
        }
    }

    get data(){
        return this.dataArray;
    }

    childScrollListener = evt => {
        this._scrollHeader.nativeElement.scrollLeft = evt.target.scrollLeft;
    };
}
