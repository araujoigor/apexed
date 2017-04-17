const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path                                          = require("path");
const url                                           = require("url");
const menuTemplate                                  = require("./menu");

let mainWindow      = null;
let settingsWindow  = null;

function createWindow(){
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    mainWindow = new BrowserWindow({ width: 800, height: 600});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes : true
    }));

    if(process.argv[2] === "--dev"){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("closed", function(){
        mainWindow = null;
    });
}

app.on("window-all-closed", function(){
    //For macosx we don't leave the application until the user explicitly do so
    if(process.platform != "darwin"){
        app.quit();
    }
});

//Create the mainWindow when the application is ready
app.on("ready", createWindow);

//For OSX, re-create the mainWindow if the docker icon was clicked and no windows exist
app.on("activate", function(){
    if(!mainWindow){
        createWindow();
    }
});

ipcMain.on("settings-modal", (event, payload) => {
    if (payload === "open" && settingsWindow === null){
        settingsWindow = new BrowserWindow({parent: mainWindow, modal: true, show: false});
        settingsWindow.loadURL(url.format({
            pathname: path.join(__dirname, "settings.html"),
            protocol: "file:",
            slashes : true
        }));
        
        settingsWindow.once('ready-to-show', () => {
            if(process.argv[2] === "--dev"){
                settingsWindow.webContents.openDevTools();
            }
            settingsWindow.show();
        });
        settingsWindow.once('closed', () => {
            settingsWindow = null;
        })
    }

    if(payload === "close" && settingsWindow !== null){
        settingsWindow.close();
    }
});