import { createHash } from 'crypto';
import { SprReader } from './spr-reader';

export class SprFileManager {

    constructor() {

        this.loadedSprFiles = new Map();
    }

    getHash(spr_path) {

        return createHash('md5').update(spr_path).digest('hex');
    }

    /**
     * 
     * @param {string} spr_path 
     * @returns {SprReader}
     */
    getReader(spr_path) {

        const hash = this.getHash(spr_path);

        if(!this.loadedSprFiles.has(hash)) {

            const sprFileReader = new SprReader(spr_path);

            this.loadedSprFiles.set(hash, sprFileReader);
        }

        return this.loadedSprFiles.get(hash);
    }

    /**
     * 
     * @returns {SprFileManager}
     */
    static getInstance() {

        if (!SprFileManager.instance) {

            SprFileManager.instance = new SprFileManager();
        }

        return SprFileManager.instance;
    }    
}