import electron from "electron";
import findDirname from "./findDirname.js";
import path from "path";
import url from "url";

const { app, BrowserWindow, Menu, ipcMain } = electron;

const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      { label: "Yeni TODO Ekle" },
      { label: "Tümünü Sil" },
      {
        label: "Çıkış",
        accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q", // kısayol
        role: "quit", // ön tanımlı işlem
      },
    ],
  },
  {
    label: "Sevkiyat",
    submenu: [{ label: "Yeni Sevkiyat" }, { label: "Sevkiyat Listesi" }],
  },
  {
    label: "Müşteriler",
    submenu: [{ label: "Müşteri Ekle" }, { label: "Müşteri Listesi" }],
  },
  {
    label: "Dev tools",
    submenu: [
      {
        label: "Geliştirici Penceresini Aç",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Yenile",
        role: "reload",
      },
    ],
  },
];

if (process.platform === "darwin") {
  // işletim sistemi macOS ise
  mainMenuTemplate.unshift({
    label: app.getName(),
    role: "TODO",
  });
}

function createSecondaryWindow() {
  let secondaryWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Burada, yeni pencere için yüklemek istediğiniz URL'yi veya dosya yolu belirleyin
  secondaryWindow.loadURL("http://localhost:5174/uretim/uretim-girisleri");

  secondaryWindow.on("closed", () => {
    secondaryWindow = null;
  });
}

function createWindow() {
  const win = new BrowserWindow({
    title: "Star Metal App",
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${findDirname(import.meta.url)}/preload.js`,
    },
    // frame: false, // pencerenin üst frame ini iptal eder
  });

  // win.setResizable(false) // pencerenin boyutunun ayarlanabilirliğini kapatır

  // React uygulamasının build halini yükleyin
  // win.loadFile(
  //   url.format({
  //     pathname: path.join(findDirname(import.meta.url), "..", "dist", "index.html"),
  //     protocol: "file:",
  //     slashes: true,
  //   }),
  // );
  // win.loadURL(`file://${path.join(findDirname(import.meta.url), "../dist/index.html")}`); // React uygulamasının build halini yükleyin
  // win.loadFile(path.join(findDirname(import.meta.url), "..", "dist", "index.html")); // React uygulamasının build halini yükleyin
  // win.loadFile(`${findDirname(import.meta.url)}/dist/index.html`); // React uygulamasının build halini yükleyin
  // win.loadFile("dist/index.html"); // React uygulamasının build halini yükleyin
  win.loadURL("http://localhost:5174"); // urlden uygulamayı aç

  // Menü oluştur
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Oluşturulan menüyü uygulamanın menüsü olarak ayarla
  Menu.setApplicationMenu(mainMenu);

  // ana pencere kapatılırsa, uygulamadan tamamen çık
  win.on("close", () => {
    app.quit();
  });

  ipcMain.on("openNewWindow", () => {
    createSecondaryWindow();
  });
}

app.whenReady().then(createWindow);
