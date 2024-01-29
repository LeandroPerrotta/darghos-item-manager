import { ipcMain } from "electron";
import { DatReader, GetClientVersionByDatSignature } from "../../core/dat-reader";
import { discoverDatFile, discoverSprFileFromDat } from "../../core/discover-dat-file";
import { GetClientVersionBySprSignature, SprReader } from "../../core/spr-reader";

export function registerPreLoadFileMain() {

    ipcMain.on('pre-load-file', (event, id, path, uuid) => {

        const datFilePath = discoverDatFile(path);

        if(!datFilePath) {

            event.reply('on-pre-load-file', uuid, id);

            return;
        }

        const loadedDatFile = new DatReader(datFilePath);

        loadedDatFile.readSummary();

        const categoriesSummary = {};

        loadedDatFile.dat.categories.forEach(category => {
            categoriesSummary[category.type] = category.count - 1;
        })

        const sprFilePath = discoverSprFileFromDat(datFilePath);

        const loadedSprFile = new SprReader(sprFilePath);

        event.reply('on-pre-load-file', uuid, id, { 
            version: GetClientVersionByDatSignature(loadedDatFile.dat.signature).string,
            spr_version: GetClientVersionBySprSignature(loadedSprFile.spr.signature).string,
            spr_size: loadedSprFile.spr.size,
            ...categoriesSummary
        });
    });
}

