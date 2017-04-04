//Usually, for Angular 2 projects, we should import zone.js and reflect-metadata
//However, for Electron apps, it seems to prevent data-binding to work properly
//Therefore, we add this two libs directly into index.html

import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
//import { environment } from "./environments/environment";

//May give an error before running the compilation
import { ApexedModuleNgFactory } from "../gen/aot/src/app/apexed.module.ngfactory";

/*
if (environment.production) {
  enableProdMode();
}*/

platformBrowser().bootstrapModuleFactory(ApexedModuleNgFactory);
