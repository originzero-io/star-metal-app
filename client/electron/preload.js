// import { contextBridge, ipcRenderer } from "electron";
// import os from "os";

// contextBridge.exposeInMainWorld("electron", {
//   homeDir: () => os.homedir(),
// });

const { contextBridge, ipcRenderer } = require("electron");
// const os = require("os");

// contextBridge.exposeInMainWorld("electron", {
//   homeDir: () => os.homedir(),
// });

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => {
    ipcRenderer.removeAllListeners(channel);
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
