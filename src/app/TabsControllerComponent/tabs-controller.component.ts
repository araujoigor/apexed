import { Component } from "@angular/core";
import { IpcRendererService } from "../../services/ipcrenderer.service";

@Component({
    selector    : "tabs-controller",
    templateUrl : "./tabs-controller.component.html",
    styleUrls   : [ "./tabs-controller.component.css" ],
    providers   : [ IpcRendererService ]
})
export class TabsControllerComponent{
    tabs : string[] = ["Tab #1"];

    constructor(ipcRendererService : IpcRendererService){
        ipcRendererService.registerMessageObserver("new-file", this.createNewTab);
    }

    private createNewTab = () => {
        this.tabs.push("Tab #" + (this.tabs.length + 1));
    };

    public closeTab(tab: string){
        let index = this.tabs.indexOf(tab);

        if(index >= 0){
            this.tabs.splice(index, 1);
        }
    }
}
