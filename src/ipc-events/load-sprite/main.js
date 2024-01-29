import { ipcMain } from "electron";
import { discoverDatFile, discoverSprFileFromDat } from "../../core/discover-dat-file";
import { SprFileManager } from "../../core/spr-file-manager";

export function registerLoadSpriteMain() {

    ipcMain.on('load-sprite', async (event, dat_path, sprite_id, uuid) => {

        const fullFilePath = discoverDatFile(dat_path);

        if(!fullFilePath) {

            event.reply('on-load-sprite', uuid, dat_path, sprite_id);

            return;
        }

        const sprReader = SprFileManager.getInstance().getReader(discoverSprFileFromDat(fullFilePath));

        const imageBase64 = await sprReader.getSpriteAsBase64(sprite_id);

        event.reply('on-load-sprite', uuid, dat_path, sprite_id, imageBase64);
    });
}

