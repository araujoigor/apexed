import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";

import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

interface AccessDataModel{
    access_token: string;
    id          : string
    instance_url: string;
    issued_at   : string
    signature   : string;
    token_type  : string
};

@Injectable()
export class CredentialsService {

    private clientId        : string = "";
    private clientSecret    : string = "";

    constructor(private http : Http){}

    public retrieveAccessData() {
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        this.http.post("https://login.salesforce.com/services/oauth2/token",
                       `grant_type=password&client_id=${this.clientId}&client_secret=${this.clientSecret}&username=${this.getUsername()}&password=${this.getPassword()}`,
                       { headers: headers })
            .map( (response : Response) => response.json())
            .catch( error => Observable.throw(error.json().error || "Server Error"))
            .subscribe( (data : AccessDataModel) => { console.log(data); this.setAccessData(data); }, error => console.log(error));
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

    public getPassword() : string {
        return localStorage.getItem("password");
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
