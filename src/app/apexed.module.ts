import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { MaterialModule } from "@angular/material";

import { ApexedComponent } from "./apexed.component";
import { ConsoleAreaComponent } from "./ConsoleAreaComponent/console-area.component";
import { EditorAreaComponent } from "./EditorAreaComponent/editor-area.component";
import { TabComponent } from "./TabComponent/tab.component";
import { TabsControllerComponent } from "./TabsControllerComponent/tabs-controller.component";

import { IpcRendererService } from "../services/ipcrenderer.service";
import { CredentialsService } from "../services/credentials.service";
import { SalesforceService } from "../services/salesforce.service";

@NgModule({
    declarations: [
        ApexedComponent,
        TabComponent,
        EditorAreaComponent,
        ConsoleAreaComponent,
        TabsControllerComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        BrowserAnimationsModule
    ],
    providers: [ IpcRendererService, CredentialsService, SalesforceService ],
    bootstrap: [ ApexedComponent ]
})
export class ApexedModule { }
