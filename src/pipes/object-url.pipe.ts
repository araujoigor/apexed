import { Pipe, PipeTransform } from "@angular/core";
import { CredentialsService } from "../services/credentials.service";
const sfid = require("sfid");

@Pipe({ name: "objectUrl" })
export class ObjectUrlPipe implements PipeTransform {

    constructor(private credentials : CredentialsService){}

    transform(value : string) : string {
        return sfid.isValid(value) ? `<a href="${this.credentials.getAccessData().instance_url}/${value}">${value}</a>` : value;
    }
}
