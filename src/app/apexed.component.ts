import { Component, OnInit } from "@angular/core";
import { TabComponent } from "./TabComponent/tab.component";

@Component({
    selector: "apexed",
    templateUrl: "./apexed.component.html",
    styleUrls: ["./apexed.component.css"]
})
export class ApexedComponent implements OnInit{
    title = "app works!";

    tabs : string[] = [];

    ngOnInit(){
        this.tabs.push("oi");
    }
}
