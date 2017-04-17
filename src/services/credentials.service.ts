import { Injectable } from "@angular/core";

@Injectable()
export class CredentialsService {

    private clientId        : string = "";
    private clientSecret    : string = "";

    public getAccessToken() : string {
        return localStorage.getItem("accessToken");
    }

    public setAccessToken(newToken : string) {
        localStorage.setItem("accessToken", newToken);
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