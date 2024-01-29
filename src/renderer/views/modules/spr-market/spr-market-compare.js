import Mithril from 'mithril';
import { LoadingComponent } from '../../components/loading';
import { requestFullLoadFile } from '../../../../ipc-events/full-load-file/renderer';
import { SprMarketCompareRepository } from './spr-market-compare-repository';
import { BootstrapGrid } from '../../components/bootstrap-grid';
import { Sprite, SpritesCache } from '../../components/sprite';

const pathes = [];
const loadedFileIds = {};

let sprMarketCompareRepository = null;

const spritesCache = SpritesCache.getInstance();

const ComparingJSON = {
    view: function (vnode) {

        const json = vnode.children;

        return Mithril('div', { class: 'form-floating' },
            Mithril('textarea', { class: 'form-control', disabled: true }, json)
        )
    }
}

const ComparingItem = {
    view: function (vnode) {

        const { row } = vnode.attrs;

        const originSprite = new Sprite(spritesCache.getSprite(pathes[0], row.origin_sprites[0]));
        const targetSprite = new Sprite(spritesCache.getSprite(pathes[1], row.target_sprites[0]));

        return Mithril('div', { class: 'row' }, [
            Mithril('div', { class: 'col-3' }, Mithril(originSprite)),
            Mithril('div', { class: 'col-3' }, row.origin_id),
            Mithril('div', { class: 'col-3' }, row.target_id),
            Mithril('div', { class: 'col-3' }, Mithril(targetSprite)),
            Mithril('div', { class: 'col-6' }, Mithril(ComparingJSON, row.origin_attributes)),
            Mithril('div', { class: 'col-6' }, Mithril(ComparingJSON, row.target_attributes)),
        ]);
    }
}

const ComparingItemList = {
    view: function () {

        const grid = new BootstrapGrid();

        sprMarketCompareRepository.rows.forEach((row) => {

            grid.addColumn({ class: 'col-12' }, Mithril(ComparingItem, { row }));
        })

        return Mithril(grid);
    }
}

const ComparingComponent = {
    view: function () {
        return Mithril(ComparingItemList);
    }
}

export class SprMarketCompareModule {

    constructor() {

        this.loadedOriginSprites = false;
        this.loadedTargetSprites = false;
    }

    onFileLoaded(path, fileId) {

        loadedFileIds[path] = fileId;

        if (this.isFilesLoaded()) {

            const originId = loadedFileIds[pathes[0]];
            const targetId = loadedFileIds[pathes[1]];

            sprMarketCompareRepository = new SprMarketCompareRepository(originId, targetId);

            sprMarketCompareRepository.findMissingPickableAttributeItemsOnTarget(this.onFoundItems.bind(this));

            Mithril.redraw();
        }
    }

    /**
     * 
     * @param {Array} rows 
     */
    onFoundItems(rows) {

        Mithril.redraw();

        console.log(rows);

        const origin_sprites = rows.map((row) => row.origin_sprites[0]);
        const target_sprites = rows.map((row) => row.target_sprites[0]);

        spritesCache.preloadAllSprites(pathes[0], origin_sprites, (result) => {

            this.loadedOriginSprites = result;

            Mithril.redraw();
        });
        spritesCache.preloadAllSprites(pathes[1], target_sprites, (result) => {

            this.loadedTargetSprites = result;

            Mithril.redraw();
        });
    }

    isFilesLoaded() {

        for (const path of pathes) {

            if (!loadedFileIds[path]) {

                return false;
            }
        }

        return true;
    }

    oninit(vnode) {

        console.log(vnode.attrs)

        pathes.push(...vnode.attrs.paths);
        pathes.forEach((path) => requestFullLoadFile(path, this.onFileLoaded.bind(this)));
    }

    view() {

        if (!this.isFilesLoaded()) {

            return Mithril(LoadingComponent, 'Loading files...');
        }

        const comparingItems = sprMarketCompareRepository.rows && sprMarketCompareRepository.rows.length;

        if (!comparingItems) {

            return Mithril(LoadingComponent, 'Comparing files to find different market attributes...')
        }

        if (!this.loadedOriginSprites || !this.loadedTargetSprites) {

            return Mithril(LoadingComponent, 'Loading sprites...')
        }

        return Mithril(ComparingComponent);
    }
}