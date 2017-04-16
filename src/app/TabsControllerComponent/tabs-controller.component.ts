import { Component } from "@angular/core";

@Component({
    selector    : "tabs-controller",
    templateUrl : "./tabs-controller.component.html",
    styleUrls   : [ "./tabs-controller.component.css" ]
})
export class TabsControllerComponent{
    tabs : string[] = ["Teste"];

    public closeTab(tab: string){
        let index = this.tabs.indexOf(tab);

        if(index >= 0){
            this.tabs.splice(index, 1);
        }
    }
}
