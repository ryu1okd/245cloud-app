//
// MainProcess
'use strict';

const ACTIVE_MENUBAR_ICON   = __dirname + '/images/active.png'
const INACTIVE_MENUBAR_ICON = __dirname + '/images/inactive.png'
const NOTIFY_ICON           = __dirname + '/images/notify_icon.png'
import menubar from 'menubar';
import { app, ipcMain, globalShortcut } from 'electron';
import Menu from 'menu';
import notifier from 'node-notifier';
import path from 'path'

const request = require('request');
const mb = menubar({ icon: ACTIVE_MENUBAR_ICON  });

const switchIconUnread = ()=> {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON )
}
const switchIconRead = ()=> {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON )
}
const setTrayTitle = (title)=> {
  mb.tray.setTitle(title)
}
const initMenu = ()=> {
  var template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

mb.on('ready', function ready () {
  var flg = false;
  var ret = globalShortcut.register('ctrl+shift+p', function() {
    flg = true;
  });
  ipcMain.on('fetch_request', function(event, arg) {
  });

  ipcMain.on('start', function(event, arg) {
    if (flg) {
      event.sender.send('reply-start')
      flg = false;
    }
  });
  ipcMain.on('notify', (event, title, message)=> {
    notifier.notify({
      title: title,
      icon: NOTIFY_ICON,
      message: message
    })
  });
  ipcMain.on('set_title', (event, text)=> {
    setTrayTitle(text.trim())
  });
  ipcMain.on('mark_unread', (event, arg)=> {
    switchIconUnread();
  });

  ipcMain.on('quit', (event, arg)=> {
    app.quit();
  });

  notifier.on('click', (event, arg)=> {
    mb.showWindow();
  });

  mb.on('show', ()=> {
    setTimeout(()=> {
      switchIconRead();
    }, 1000);
  })

  mb.on('hide', ()=> {
    switchIconRead();
  })

  mb.showWindow();
  mb.hideWindow();
  initMenu();
  switchIconUnread();
})
