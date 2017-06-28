import { Component, ViewChild, ElementRef, AfterViewInit, Input } from "@angular/core";

@Component({
    selector    : "console-area",
    templateUrl : "./console-area.component.html",
    styleUrls   : [ "./console-area.component.css" ]
})
export class ConsoleAreaComponent{
    @ViewChild("scrollBody")
    private scrollBody : ElementRef;

    @ViewChild("scrollHeader")
    private scrollHeader: ElementRef;

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

    childScrollListener = evt => {
        this.scrollHeader.nativeElement.scrollLeft = evt.target.scrollLeft;
    };

    ngAfterViewChecked(){
        if(this.scrollBody && !this.scrollListenerSet){
            this.scrollBody.nativeElement.addEventListener("scroll", this.childScrollListener);
            this.scrollListenerSet = true;
        }
    }

    ngOnDestroy(){
        if(this.scrollBody && this.scrollListenerSet){
            this.scrollBody.nativeElement.removeEventListener("scroll", this.childScrollListener);
            this.scrollListenerSet = false;
        }
    }
}
