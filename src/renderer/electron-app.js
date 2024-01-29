import { app, BrowserWindow } from 'electron';
import { platform } from 'process'
import { registerMainList } from '../ipc-events/register-main-list';

export class ElectronApp {

    constructor() {

        this.mainWindow = null;
    }
    
    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
    
        this.mainWindow.loadFile('electron/index.html');
    }

    setup() {

        app.whenReady().then(this.createWindow.bind(this));

        registerMainList();
        
        app.on('window-all-closed', () => {
            if (platform !== 'darwin') {
                app.quit();
            }
        });
        
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });        
    }

    /**
     * 
     * @returns {ElectronApp}
     */
    static getInstance() {

        if(!ElectronApp.instance) {

            ElectronApp.instance = new ElectronApp();
        }

        return ElectronApp.instance;
    }
}