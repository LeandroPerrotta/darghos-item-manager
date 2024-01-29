import { ipcRenderer } from "electron";
import { IpcEventsService } from "../ipc-events-service";

export function registerPreLoadFileRenderer() {

    ipcRenderer.on('on-pre-load-file', (event, uuid, ...args) => {

        const ipcEventsService = IpcEventsService.getInstance();

        ipcEventsService.redirectToCallback(uuid, ...args);
    });
}

export function requestPreLoadFile(id, path, callback) {

    const ipcEventsService = IpcEventsService.getInstance();

    ipcEventsService.sendToMainWithCallback('pre-load-file', callback, id, path);
}