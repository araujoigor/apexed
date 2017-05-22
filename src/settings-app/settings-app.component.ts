import { Component } from "@angular/core";
import { MdInputDirective } from "@angular/material";
import { MdSnackBar } from '@angular/material';
import { CredentialsService } from "../services/credentials.service";
import { IpcRendererService } from "../services/ipcrenderer.service";

@Component({
    selector    : "settings-app",
    templateUrl : "./settings-app.component.html",
    styleUrls   : [ "./settings-app.component.css" ],
    providers   : [ CredentialsService, IpcRendererService ]
})
export class SettingsAppComponent {
    username: string;
    password: string;

    constructor(
        private credentialsService  : CredentialsService,
        private ipcRendererService  : IpcRendererService,
        private snackBar            : MdSnackBar
    ){
        this.username = this.credentialsService.getUsername();
        this.password = this.credentialsService.getPassword();
    }

    public saveCredentials() {
        this.credentialsService.setUsername(this.username);
        this.credentialsService.setPassword(this.password);

        this.credentialsService.retrieveAccessData()
            .subscribe( data => this.snackBar.open("Settings saved succesfully", null, { duration: 2000 }),
                        error => this.snackBar.open("Erro while saving credentials: " + error, null, { duration: 2000 }) );
    }

    public close() {
        this.ipcRendererService.sendMessage("settings-modal", "close");
    }
}
