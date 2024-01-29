import { ipcRenderer } from "electron";
import { IpcEventsService } from "../ipc-events-service";

export function registerDirectoryDialogRenderer() {

    ipcRenderer.on('selected-directory', (event, uuid, ...args) => {

        const ipcEventsService = IpcEventsService.getInstance();

        ipcEventsService.redirectToCallback(uuid, ...args);
    });
}

export function requestOpenDirectoryDialog(id, callback) {

    const ipcEventsService = IpcEventsService.getInstance();

    ipcEventsService.sendToMainWithCallback('open-directory-dialog', callback, id);
}