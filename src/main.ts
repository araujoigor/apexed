//Usually, for Angular 2 projects, we should import zone.js and reflect-metadata
//However, for Electron apps, it seems to prevent data-binding to work properly
//Therefore, we add this two libs directly into index.html

import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";

//May give an error before running the compilation
import { ApexedModuleNgFactory } from "../gen/aot/src/app/apexed.module.ngfactory";

//May give an error before running the compilation
import { SettingsModuleNgFactory } from "../gen/aot/src/settings-app/settings-app.module.ngfactory";

declare var currentApp;
/*
if (environment.production) {
  enableProdMode();
}*/

if(currentApp === "Apexed") {
    platformBrowser().bootstrapModuleFactory(ApexedModuleNgFactory);
}

else if(currentApp === "Settings") {
    platformBrowser().bootstrapModuleFactory(SettingsModuleNgFactory);
}

else {
  throw "App not defined";
}
