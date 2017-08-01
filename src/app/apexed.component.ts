import { Component } from "@angular/core";
import { TabComponent } from "./TabComponent/tab.component";
import { IpcRendererService } from "../services/ipcrenderer.service";

@Component({
    selector    : "apexed",
    templateUrl : "./apexed.component.html",
    styleUrls   : [ "./apexed.component.css" ]
})
export class ApexedComponent{

    constructor(private ipcRendererService : IpcRendererService){
        this.ipcRendererService.registerMessageObserver("preferences", () => {
            this.ipcRendererService.sendMessage("settings-modal", "open");
        });
    }
}
