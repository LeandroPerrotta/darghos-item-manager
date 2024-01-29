import Mithril from "mithril";
import { requestLoadSprite } from "../../../ipc-events/load-sprite/renderer";
import { createHash } from 'crypto';

export class SpritesCache {

    constructor() { 

        this.knownSprites = new Map();
        this.loadingSpritesResolves = new Map();
        this.loadingSpritesPromisesByDat = new Map();

        // this.onThink();
    }

    /**
     * 
     * @param {String} dat_path 
     * @param {number[]} sprites 
     * @param {Function} callback 
     * @returns {Promise<boolean>}
     */
    async preloadAllSprites(dat_path, sprites, callback) {

        const hashDat = this.hashDat(dat_path);

        this.loadingSpritesPromisesByDat.set(hashDat, []);

        sprites.forEach((sprite_id) => {

            this.loadIfUnknownSprite(dat_path, sprite_id);
        })

        try {

            await Promise.all(this.loadingSpritesPromisesByDat.get(hashDat));
            
            console.log('All promises loaded!');
            callback(true);

        } catch(error) {

            console.error('Err loading sprites', error);

            callback(false);
        }

    }

    hashDatAndId(dat_path, sprite_id) {

        return this.hashDat(dat_path)+'_'+sprite_id
    }

    hashDat(dat_path) {

        return createHash('md5').update(dat_path).digest('hex');
    }

    getSprite(dat_path, sprite_id) {

        const hash = this.hashDatAndId(dat_path, sprite_id);

        if(this.knownSprites.has(hash)) {

            return this.knownSprites.get(hash);
        }        

        return '#';
    }

    loadIfUnknownSprite(dat_path, sprite_id) {

        const hashDatAndId = this.hashDatAndId(dat_path, sprite_id);
        const hashDat = this.hashDat(dat_path);

        if(this.knownSprites.has(hashDatAndId)) {

            return;
        }

        if(this.loadingSpritesResolves.has(hashDatAndId)) {

            return;
        }

        let resolve;

        const promise = new Promise((res) => resolve = res);

        this.loadingSpritesResolves.set(hashDatAndId, resolve);
        this.loadingSpritesPromisesByDat.get(hashDat).push(promise);

        requestLoadSprite(dat_path, sprite_id, this.onLoadSprite.bind(this)); //chama o IPC para carregar a sprite
    }

    onLoadSprite(dat_path, sprite_id, imageBase64) {

        const hash = this.hashDatAndId(dat_path, sprite_id);
        const resolve = this.loadingSpritesResolves.get(hash);

        resolve(true);

        this.knownSprites.set(hash, imageBase64);
    }

    onThink() {

        console.log('promises', this.loadingSpritesPromisesByDat);

        setTimeout(() => this.onThink(), 2000);
    }

    /**
     * 
     * @returns {SpritesCache}
     */
    static getInstance() {

        if (!SpritesCache.instance) {

            SpritesCache.instance = new SpritesCache();
        }

        return SpritesCache.instance;
    }    
}

export class Sprite {

    constructor(base64) {

        this.imageBase64 = base64
    }

    view() {

        return Mithril('img', { src: this.imageBase64 })
    }
}