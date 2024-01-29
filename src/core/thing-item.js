export class ThingItem {

    constructor(id, category) {

        this.id = id;
        this.category = category;

        this.groupCount = null;
        this.attributes = {};
        this.animationPhases = null;
        this.size = { width: null, height: null }
        this.realSize = null
        this.exactSize = null
        this.layers = null
        this.numPatternX = null
        this.numPatternY = null
        this.numPatternZ = null
        this.animator = null
        this.spritesindex = []
        this.textures = []
        this.texturesFramesRects = []
        this.texturesFramesOriginRects = []
        this.texturesOffsets = []
    }
}