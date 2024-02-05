import { ThingItem } from "./thing-item.js";
import { AttributesEnum } from "./enums.js";
import { FileReader } from "./file-reader.js";
import assert from 'assert';
import versions from './versions.json'
import { ItemIoRepository } from "../repositories/item-io.js";
import { fileChecksum } from "./file-checksum.js";
import { LoadedFilesIoRepository } from "../repositories/loaded-files-io.js";
import { GameEnhancedAnimations, GameIdleAnimations, GameSpritesU32 } from "./features.js";

const getRandomInt = (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getEnumKey(enumObj, value) {
    for (const key in enumObj) {
        if (enumObj[key] === value) {
            return key;
        }
    }
    return null; // ou qualquer valor padrão que você queira retornar caso a chave não seja encontrada
}

export const GetClientVersionByDatSignature = (signature) => versions.find(version => {

    return parseInt(version.dat, 16) == signature;
})

export class DatReader {

    constructor(dat_path) {

        this.file_reader = new FileReader(dat_path);
        this.path = dat_path;
        this.dat = {
            signature: null,
            categories: [
                { type: 'item', count: null, childs: [] },
                { type: 'creature', count: null, childs: [] },
                { type: 'effect', count: null, childs: [] },
                { type: 'missile', count: null, childs: [] }
            ]
        }
        this.client_version = null;
        this.file_id = null;
    }

    readSummary() {

        this.dat.signature = this.file_reader.getU32();
        this.client_version = GetClientVersionByDatSignature(this.dat.signature).version

        for (const category of this.dat.categories) {

            category.count = this.file_reader.getU16() + 1;
        }
    }

    async readFile() {

        const checksum = await fileChecksum(this.path);

        const loadedFilesIo = new LoadedFilesIoRepository();

        this.file_id = await loadedFilesIo.getFileIdIfExists(checksum, this.path);

        let fileAlreadyLoaded = true;

        if (!this.file_id) {

            fileAlreadyLoaded = false;
            this.file_id = await loadedFilesIo.insertFile(checksum, this.path);
        }

        this.readSummary();

        const itemIo = new ItemIoRepository();

        for (let i = 0; i < 4; ++i) {

            const category = this.dat.categories[i];
            let firstId = 1;

            if (category.type == 'item') {

                firstId = 100;
            }

            for (let id = firstId; id < category.count; ++id) {

                const item = this.readItem(id, category.type);

                if (category.type === 'item') {

                    if (!fileAlreadyLoaded) {

                        this.testItem(item);
                        itemIo.addItemToBeInserted(item, this.file_id);
                    }
                } else {

                    category.childs.push(item);
                }
            }
        }

        if (!fileAlreadyLoaded) {

            await itemIo.insertAllItems();
        }

        return this.file_id;
    }

    /**
     * Lets test if first item was parsed as it should be
     * @param {ThingItem} item
     */
    testItem(item) {

        if (item.id !== 101) {

            return;
        }

        assert(item.numPatternX === 1)
        assert(item.numPatternY === 1)
        assert(item.numPatternZ === 1)
        assert(item.size.width === 1)
        assert(item.size.height === 1)
        assert(item.attributes['ThingAttrNotMoveable'])
        assert(item.attributes['ThingAttrFullGround'])
        assert(item.attributes['ThingAttrBlockProjectile'])
        assert(item.attributes['ThingAttrNotWalkable'])
        assert(item.attributes['ThingAttrGround'] === 0)
    }

    readItem(id, category) {

        const item = new ThingItem(id, category);

        this.readItemAttributesUntilLast(item);
        this.readItemFrameGroups(item);

        return item;
    }

    /**
     *
     * @param {ThingItem} item
     */
    readItemAttributesUntilLast(item) {

        for (let i = 0; i < AttributesEnum.ThingLastAttr; ++i) {

            const datAttr = this.file_reader.getU8();

            if (datAttr === AttributesEnum.ThingLastAttr) {

                return true;
            }

            const clientAttr = this.parseDatAttrBasedOnClientVersion(datAttr);

            this.readItemAttributes(clientAttr, item);
        }

        console.log(item);

        throw new Error('Corrupted data');
    }

    /**
     *
     * @param {number} clientAttr
     * @param {ThingItem} item
     */
    readItemAttributes(clientAttr, item) {

        switch (clientAttr) {

            case AttributesEnum.ThingAttrDisplacement: {

                const displacement = {
                    x: this.file_reader.getU16(),
                    y: this.file_reader.getU16()
                }

                if (this.client_version >= 755) {
                    item.displacement = displacement
                } else {
                    item.displacement = { x: 8, y: 8 }
                }

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = displacement;

                return true;
            }

            case AttributesEnum.ThingAttrLight: {

                const light = {
                    intensity: this.file_reader.getU16(),
                    color: this.file_reader.getU16()
                }

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = light;

                return true;
            }

            case AttributesEnum.ThingAttrMarket: {

                const market = {
                    category: this.file_reader.getU16(),
                    tradeAs: this.file_reader.getU16(),
                    showAs: this.file_reader.getU16(),
                    name: this.file_reader.getString(),
                    restrictVocation: this.file_reader.getU16(),
                    requiredLevel: this.file_reader.getU16()
                }

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = market;

                return true;
            }

            case AttributesEnum.ThingAttrElevation: {

                item.elevation = this.file_reader.getU16();

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = item.elevation;

                return true;
            }

            case AttributesEnum.ThingAttrUsable:
            case AttributesEnum.ThingAttrGround:
            case AttributesEnum.ThingAttrWritable:
            case AttributesEnum.ThingAttrWritableOnce:
            case AttributesEnum.ThingAttrMinimapColor:
            case AttributesEnum.ThingAttrLensHelp:
            case AttributesEnum.ThingAttrCloth: {

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = this.file_reader.getU16();

                return true;
            }

            default: {

                item.attributes[getEnumKey(AttributesEnum, clientAttr)] = true;
            }
        }
    }

    /**
     *
     * @param {ThingItem} item
     */
    readItemFrameGroups(item) {

        const hasFrameGroups = item.category === 'creature' && GameIdleAnimations(this.client_version);

        item.groupCount = hasFrameGroups ? this.file_reader.getU8() : 1;
        item.animationPhases = 0;

        let totalSpritesCount = 0;

        for (let i = 0; i < item.groupCount; ++i) {

            //unused but need be readed
            if (hasFrameGroups) this.file_reader.getU8();

            item.size = {
                width: this.file_reader.getU8(),
                height: this.file_reader.getU8(),
            }

            if (item.size.width > 1 || item.size.height > 1) {

                item.realSize = this.file_reader.getU8();
                item.exactSize = Math.min(item.realSize, Math.max(item.size.width * 32, item.size.height * 32));
            } else {
                item.exactSize = 32;
            }

            item.layers = this.file_reader.getU8();
            item.numPatternX = this.file_reader.getU8();
            item.numPatternY = this.file_reader.getU8();
            item.numPatternZ = this.client_version >= 755 ? this.file_reader.getU8() : 1;

            const groupAnimationPhases = this.file_reader.getU8();

            item.animationPhases = + groupAnimationPhases;

            if (groupAnimationPhases > 1 && GameEnhancedAnimations(this.client_version)) {

                this.readItemAnimations(item, groupAnimationPhases);
            }

            const totalSprites = (item.size.height * item.size.width) * item.layers * item.numPatternX * item.numPatternY * item.numPatternZ * groupAnimationPhases;

            if (totalSpritesCount + totalSprites > 4096) {

                console.log(item, totalSpritesCount + totalSprites, groupAnimationPhases);

                throw new Error('a thing type has more than 4096 sprites');
            }

            for (let j = totalSpritesCount; j < (totalSpritesCount + totalSprites); j++) {

                item.spritesindex[j] = GameSpritesU32(this.client_version) ? this.file_reader.getU32() : this.file_reader.getU16();
            }

            totalSpritesCount += totalSprites;
        }
    }

    /**
     *
     * @param {ThingItem} item
     * @param {number} animationPhases
     */
    readItemAnimations(item, animationPhases) {

        const animation = {
            async: this.file_reader.getU8() == 0,
            loopCount: this.file_reader.get32(),
            startPhase: this.file_reader.get8(),
            phaseDurations: [],
            phase: null
        }

        for (let i = 0; i < animationPhases; ++i) {

            const minimum = this.file_reader.getU32();
            const maximum = this.file_reader.getU32();

            animation.phaseDurations.push([minimum, maximum]);
        }

        animation.phase = animation.startPhase > -1 ? animation.startPhase : getRandomInt(0, animationPhases);

        assert(animationPhases == animation.phaseDurations.length);
        assert(animation.startPhase >= -1 && animation.startPhase < animationPhases);

        item.animator = animation;
    }

    parseDatAttrBasedOnClientVersion(datAttr) {

        let parsedAttr = datAttr;

        if (this.client_version >= 1000) {

            if (datAttr === 16) parsedAttr = AttributesEnum.ThingAttrNoMoveAnimation;
            else if (datAttr > 16) parsedAttr -= 1;
        } else if (this.client_version >= 860) {

            if (datAttr === 16) parsedAttr = AttributesEnum.ThingAttrNoMoveAnimation;
            else if (datAttr > 16) parsedAttr -= 1;
        } else if (this.client_version >= 780) {

            if (datAttr === 8) parsedAttr = AttributesEnum.ThingAttrChargeable;
            else if (datAttr > 8) parsedAttr -= 1;
        } else if (this.client_version >= 755) {

            if (datAttr === 23) parsedAttr = AttributesEnum.ThingAttrFloorChange;
        } else if (this.client_version >= 740) {

            const mappedAttrs = {
                16: AttributesEnum.ThingAttrLight,
                17: AttributesEnum.ThingAttrFloorChange,
                18: AttributesEnum.ThingAttrFullGround,
                19: AttributesEnum.ThingAttrElevation,
                20: AttributesEnum.ThingAttrDisplacement,
                22: AttributesEnum.ThingAttrMinimapColor,
                23: AttributesEnum.ThingAttrRotateable,
                24: AttributesEnum.ThingAttrLyingCorpse,
                25: AttributesEnum.ThingAttrHangable,
                26: AttributesEnum.ThingAttrHookSouth,
                27: AttributesEnum.ThingAttrHookEast,
                28: AttributesEnum.ThingAttrAnimateAlways,

                [AttributesEnum.ThingAttrMultiUse]: AttributesEnum.ThingAttrForceUse,
                [AttributesEnum.ThingAttrForceUse]: AttributesEnum.ThingAttrMultiUse,
            };

            if (mappedAttrs[datAttr]) parsedAttr = mappedAttrs[datAttr];
            else if (datAttr > 0 && datAttr <= 15) parsedAttr += 1;
        }

        return parsedAttr;
    }
}