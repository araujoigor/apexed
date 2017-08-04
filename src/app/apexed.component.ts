import { Component, OnDestroy } from "@angular/core";
import { TabComponent } from "./TabComponent/tab.component";
import { IpcRendererService } from "../services/ipcrenderer.service";

@Component({
    selector    : "apexed",
    templateUrl : "./apexed.component.html",
    styleUrls   : [ "./apexed.component.css" ]
})
export class ApexedComponent implements OnDestroy {

    constructor(private ipcRendererService : IpcRendererService){
        this.ipcRendererService.registerMessageObserver("preferences", this.openPreferences);
    }

    openPreferences = () => {
        this.ipcRendererService.sendMessage("settings-modal", "open");
    }

    ngOnDestroy() {
        this.ipcRendererService.unregisterMessageObserver("preferences", this.openPreferences);
    }
}
