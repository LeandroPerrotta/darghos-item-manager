import { ipcRenderer } from "electron";
import { IpcEventsService } from "../ipc-events-service";

export function registerLoadSpriteRenderer() {

    ipcRenderer.on('on-load-sprite', (event, uuid, ...args) => {

        const ipcEventsService = IpcEventsService.getInstance();

        ipcEventsService.redirectToCallback(uuid, ...args);
    });
}

export function requestLoadSprite(dat_path, sprite_id, callback) {

    const ipcEventsService = IpcEventsService.getInstance();

    ipcEventsService.sendToMainWithCallback('load-sprite', callback, dat_path, sprite_id);
}