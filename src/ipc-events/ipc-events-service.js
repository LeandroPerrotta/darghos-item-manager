import { randomUUID } from 'crypto';
import { ipcRenderer } from 'electron';

export class IpcEventsService {

    constructor() {

        this.registeredCallbacks = new Map();
    }

    /**
     * 
     * @param {String} channel 
     * @param {Function} callback 
     */
    sendToMainWithCallback(channel, callback, ...args) {

        const uuid = randomUUID();

        args.push(uuid);

        this.registeredCallbacks.set(uuid, callback);

        ipcRenderer.send(channel, ...args);
    }

    redirectToCallback(uuid, ...args) {

        const callback = this.registeredCallbacks.get(uuid);

        if(typeof callback === 'function') {

            callback(...args);
        }
    }   

    /**
     * 
     * @returns {IpcEventsService}
     */
    static getInstance() {

        if (!IpcEventsService.instance) {

            IpcEventsService.instance = new IpcEventsService();
        }

        return IpcEventsService.instance;
    }
}