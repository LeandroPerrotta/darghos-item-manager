import { ipcRenderer } from "electron";
import { IpcEventsService } from "../ipc-events-service";

export function registerFullLoadFileRenderer() {

    ipcRenderer.on('on-full-load-file', (event, uuid, ...args) => {

        const ipcEventsService = IpcEventsService.getInstance();

        ipcEventsService.redirectToCallback(uuid, ...args);
    });
}

export function requestFullLoadFile(path, callback) {

    const ipcEventsService = IpcEventsService.getInstance();

    ipcEventsService.sendToMainWithCallback('full-load-file', callback, path);
}