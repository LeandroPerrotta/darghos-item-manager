import { ipcRenderer } from "electron";
import { IpcEventsService } from "../ipc-events-service";

export function registerQueryRunnerRenderer() {

    ipcRenderer.on('on-query-runner-get-all', (event, uuid, ...args) => {

        const ipcEventsService = IpcEventsService.getInstance();

        ipcEventsService.redirectToCallback(uuid, ...args);
    });
}

export function requestQueryRunnerGetAll(query, params, callback) {

    const ipcEventsService = IpcEventsService.getInstance();

    ipcEventsService.sendToMainWithCallback('query-runner-get-all', callback, query, params);
}