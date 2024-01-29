import { GameSpritesU32 } from "./features";
import { FileReader } from "./file-reader";
import versions from './versions.json'
import Jimp from 'jimp';

export const GetClientVersionBySprSignature = (signature) => versions.find(version => {

    return parseInt(version.spr, 16) == signature;
})

export class SprReader {

    constructor(spr_path) {

        this.file_reader = new FileReader(spr_path);
        this.spr = {
            signature: this.file_reader.getU32(),
            size: null,
            spritesOffset: null
        }
        this.client_version = GetClientVersionBySprSignature(this.spr.signature).version;
        this.spr.size = GameSpritesU32(this.client_version) ? this.file_reader.getU32() : this.file_reader.getU16()
        this.spr.spritesOffset = this.file_reader.tell();
    }

    createBaseImage() {

        const image = new Jimp(32, 32);

        for (let i = 0; i < 32; i++) {

            for (let j = 0; j < 32; j++) {

                image.setPixelColor(Jimp.rgbaToInt(255, 0, 255, 255), i, j);
            }
        }

        return image;
    }

    getSpriteAsBase64(id) {

        return new Promise((resolve, reject) => {

            this.getSprite(id).getBase64(Jimp.MIME_PNG, (err, dataUrl) => {

                if (err) {

                    console.log('[getSpriteAsBase64] Could not convert sprite to base 64', id)

                    reject(err);
                }
    
                resolve(dataUrl);
            });
        })
    }

    getSprite(id) {

        const spriteIndex = ((id - 1) * 4) + this.spr.spritesOffset;

        this.file_reader.seek(spriteIndex);

        const spriteAddress = this.file_reader.getU32();

        if (spriteAddress === 0) {

            return;
        }

        const image = this.createBaseImage();

        this.file_reader.seek(spriteAddress);

        //skiping color key
        this.file_reader.getU8();
        this.file_reader.getU8();
        this.file_reader.getU8();

        const offset = this.file_reader.tell() + this.file_reader.getU16();

        let currentPixel = 0;
        let size = 32;

        // decompress pixels
        while (this.file_reader.tell() < offset) {

            const transparentPixels = this.file_reader.getU16();
            const coloredPixels = this.file_reader.getU16();

            currentPixel += transparentPixels;

            for (var i = 0; i < coloredPixels; i++) {

                const RGB = [this.file_reader.getU8(), this.file_reader.getU8(), this.file_reader.getU8()];
                const color = Jimp.rgbaToInt(...RGB, 255);

                image.setPixelColor(color, parseInt(currentPixel % size), parseInt(currentPixel / size));

                currentPixel++;
            }
        }

        return image;
    }
}