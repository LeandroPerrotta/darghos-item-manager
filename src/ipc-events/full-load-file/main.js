import { ipcMain } from "electron";
import { DatReader } from "../../core/dat-reader";
import { discoverDatFile } from "../../core/discover-dat-file";

export function registerFullLoadFileMain() {

    ipcMain.on('full-load-file', async (event, path, uuid) => {

        const fullFilePath = discoverDatFile(path);

        if(!fullFilePath) {

            event.reply('on-full-load-file', uuid, path);

            return;
        }

        const loadedDatFile = new DatReader(fullFilePath);

        console.log('[full-load-file] Loading ', fullFilePath)

        const fileId = await loadedDatFile.readFile();

        console.log('[full-load-file] Loaded! ', fullFilePath)

        event.reply('on-full-load-file', uuid, path, fileId);
    });
}

