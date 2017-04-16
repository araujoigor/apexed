import { Injectable }  from "@angular/core";

//-- Require as commonjs
const { ipcRenderer } =  require("electron");

interface MessageObservers {
    [event: string]: (() => void)[];
}

@Injectable()
export class IpcRendererService{

    private observers: MessageObservers = {};

    constructor(){
        ipcRenderer.on("menu-click", this.onMenuClick);
    }

    private onMenuClick = (eventObj, event) => {
        (this.observers[event] || []).forEach((entry) => entry());
    };

    public registerMessageObserver(event: string, callback: () => void) {
        if(!this.observers[event]){
            this.observers[event] = [];
        }

        this.observers[event].push(callback);
    }

    public unregisterMessageObserver(event: string, callback: () => void) {
        if(this.observers[event]){
            var index = this.observers[event] ? this.observers[event].indexOf(callback) : 0;
            this.observers[event].splice(index, index !== -1 ? 1 : 0);
        }
    }

}

