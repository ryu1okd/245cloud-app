//
// MainProcess
'use strict';

import menubar from 'menubar';
import { app, ipcMain } from 'electron';
import notifier from 'node-notifier';
var path = require('path')

const request = require('request');
const mb = menubar({ icon: __dirname + '/images/read.png' });
mb.setOption('preload', path.resolve(path.join(__dirname, 'preload.js')))

const switchIconUnread = ()=> {
  mb.tray.setImage(__dirname + '/images/unread.png')
}
const switchIconRead = ()=> {
  mb.tray.setImage(__dirname + '/images/read.png')
}
const setTrayTitle = (title)=> {
  mb.tray.setTitle(title)
}
mb.on('after-create-window', function ready () {
  mb.window.loadURL('http://245cloud.com/')
})

mb.on('ready', function ready () {

  ipcMain.on('fetch_request', function(event, arg) {
  });

  ipcMain.on('notify', (event, title, message)=> {
    notifier.notify({
      title: title,
      icon: __dirname + '/images/notify_icon.png',
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
  switchIconUnread();
})
