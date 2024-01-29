import { dialog, ipcMain } from "electron";

export function registerDirectoryDialogMain() {

    ipcMain.on('open-directory-dialog', (event, id, uuid) => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            if (!result.canceled) {
                event.reply('selected-directory', uuid, id, result.filePaths[0]);
            }
        }).catch(err => {
            console.log(err);
        });
    });
}

