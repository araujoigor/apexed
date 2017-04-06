import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

declare var ace;

@Component({
  selector    : "editor-area",
  templateUrl : "./editor-area.component.html"
})
export class EditorAreaComponent implements AfterViewInit{

  @ViewChild("editor") editor: ElementRef;

  ngAfterViewInit(){
    var editor = ace.edit(this.editor.nativeElement);
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/sql");
  }
}
