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


@NgModule({
  declarations: [
    ApexedComponent,
    TabComponent,
    EditorAreaComponent,
    ConsoleAreaComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [ApexedComponent]
})
export class ApexedModule { }
