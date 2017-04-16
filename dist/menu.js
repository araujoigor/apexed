const { app } = require("electron");

function onMenuClicked(menuItem, window, event){
    window.webContents.send("menu-click", menuItem.label.toLowerCase().replace(" ", "-"));
}

const template = [
    {
        label   : "File",
        submenu : [
            { label: "New File"  , accelerator: "CmdOrCtrl+N"           },
            { type : "separator"                                        },
            { label: "Open File" , accelerator: "CmdOrCtrl+O"           },
            { type : "separator"                                        },
            { label: "Save"      , accelerator: "CmdOrCtrl+S"           },
            { label: "Save As...", accelerator: "CmdOrCtrl+Shift+S"     },
            { label: "Save All"                                         },
            { type : "separator"                                        },
            { role : "quit"                                             }
        ]
    },
    {
        label   : "Edit",
        submenu : [
            { role: "undo"                },
            { role: "redo"                },
            { type: "separator"           },
            { role: "cut"                 },
            { role: "copy"                },
            { role: "paste"               },
            { role: "pasteandmatchstyle"  },
            { role: "delete"              },
            { role: "selectall"           }
        ]
    },
    {
        label   : "View",
        submenu : [
            { role: "resetzoom"         },
            { role: "zoomin"            },
            { role: "zoomout"           },
            { type: "separator"         },
            { role: "togglefullscreen"  }
        ]
    },
    {
        role    : "window",
        submenu : [
            { role: "minimize"          },
            { role: "close"             }
        ]
    },
    {
        role    : "help",
        submenu : [
            {
                label: "Learn More",
                click () { require("electron").shell.openExternal("https://github.com/araujoigor/apexed") }
            }
        ]
    }
];

if (process.platform === "darwin") {
    template.unshift({
        label   : app.getName(),
        submenu : [
            { role  : "about"                 },
            { type  : "separator"             },
            { label : "Preferences"           },
            { type  : "separator"             },
            { role  : "quit"                  }
        ]
    });
} else {
    template[1].submenu.push({ type : "separator"    });
    template[1].submenu.push({ label: "Preferences"  });
}

template.forEach( (menu) => {
    menu.submenu.forEach( (submenu) => {
        if(submenu.type !== "separator"){
            submenu.click = onMenuClicked;
        }
    });
});

module.exports = template;
