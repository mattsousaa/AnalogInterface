const {app, BrowserWindow} = require('electron');
const path                 = require('path');

// Permite que um processo renderizador do electron 
// reutilize módulos carregados
app.allowRendererProcessReuse = false;

function createWindow() 
{
    const mainWindow = new BrowserWindow(
    {   
        resizable: false,
        width: 1024,
        height: 680,
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile('index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => 
{
    createWindow();

    // Linka um evento de activate para abrir uma nova janela
    // caso nenhuma janela esteja aberta no macOS
    app.on('activate', () => 
    {
        if (BrowserWindow.getAllWindows().length === 0) 
            createWindow();
    });
});

// Encerra aplicação quando todas as janelas são fechadas
// Caso especial para macOS
app.on('window-all-closed', () => 
{
  if (process.platform !== 'darwin') 
    app.quit();
});
