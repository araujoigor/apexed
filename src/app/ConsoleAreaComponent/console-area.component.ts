import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

declare var ace;

@Component({
    selector    : "console-area",
    templateUrl : "./console-area.component.html"
})
export class ConsoleAreaComponent{
    @ViewChild("console") consoleArea: ElementRef;

    ngAfterViewInit(){
        var consoleArea = ace.edit(this.consoleArea.nativeElement);
        consoleArea.setTheme("ace/theme/chrome");
        consoleArea.getSession().setMode("ace/mode/makefile");
    }
}
