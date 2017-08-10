import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { IpcRendererService } from "./ipcrenderer.service";

import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

const keytar = require("keytar");

interface AccessDataModel {
    access_token: string;
    id          : string;
    instance_url: string;
    issued_at   : string;
    signature   : string;
    token_type  : string;
};

interface Credentials {
    username: string;
    password: string;
}

@Injectable()
export class CredentialsService {

    private clientId        : string = "";
    private clientSecret    : string = "";

    constructor(private http : Http){}

    public retrieveAccessData() : Observable<any> {
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        let observable = this.getCredentials()
            .flatMap(credentials => {
                return this.http.post("https://login.salesforce.com/services/oauth2/token",
                       `grant_type=password&client_id=${this.clientId}&client_secret=${this.clientSecret}&username=${credentials.username}&password=${credentials.password}`,
                       { headers: headers }
                    )
                    .map( (response : Response) => {
                        let json = response.json();
                        this.setAccessData(json);
                        return json;
                    })
                    .catch( error => Observable.throw(error.json().error || "Server Error"));
            });

        return observable;
    }

    public getAccessData() : AccessDataModel{
        return JSON.parse(localStorage.getItem("accessData"));
    }

    public setAccessData(newToken : AccessDataModel) {
        localStorage.setItem("accessData", JSON.stringify(newToken));
    }

    public getUsername() : string {
        return localStorage.getItem("username");
    }

    public setUsername(newUsername : string) {
        localStorage.setItem("username", newUsername);
    }

    public getCredentials() : Observable<Credentials> {
        let username = this.getUsername();
        return Observable.fromPromise(keytar.getPassword("apexed", username))
            .map((password : string) => ({
                username: username,
                password: password
            }));
    }

    public setCredentials(credentials : Credentials) : Observable<any> {
        this.setUsername(credentials.username);
        return Observable.fromPromise(
            keytar.setPassword("apexed", credentials.username, credentials.password)
        );
    }

    public getPassword() : Promise<String> {
        //return localStorage.getItem("password");
        return keytar.getPassword("apexed", this.getUsername());
    }

    public setPassword(newPassword : string) {
        localStorage.setItem("password", newPassword);
    }

    public getClientId() {
        return this.clientId;
    }

    public getClientSecret() {
        return this.clientSecret;
    }

}
