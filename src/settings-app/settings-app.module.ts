import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { MaterialModule } from "@angular/material";

import { SettingsAppComponent } from "./settings-app.component";

import { IpcRendererService } from "../services/ipcrenderer.service";
import { CredentialsService } from "../services/credentials.service";


@NgModule({
    declarations: [
        SettingsAppComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        BrowserAnimationsModule
    ],
    providers: [ IpcRendererService, CredentialsService ],
    bootstrap: [ SettingsAppComponent ]
})
export class SettingsModule { }
