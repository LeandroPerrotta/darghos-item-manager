import Mithril from 'mithril';
import { LoadingComponent } from '../../components/loading';
import { requestFullLoadFile } from '../../../../ipc-events/full-load-file/renderer';
import { CompareItemsByAttributesRepository } from './compare-items-by-attributes-repository';
import { BootstrapGrid } from '../../components/bootstrap-grid';
import { Sprite, SpritesCache } from '../../components/sprite';
import './compare-items-by-attributes.css';
import { TopNavigation } from '../../components/top-navigation';

const pathes = [];
const loadedFileIds = {};

let compareItemsByAttributesRepository = null;

const spritesCache = SpritesCache.getInstance();

const ComparingJSON = {
    view: function (vnode) {

        const json = vnode.children;

        return Mithril('textarea', { class: 'form-control', disabled: true }, json)
    }
}

const ComparingItem = {

    oninit: function (vnode) {

        vnode.state.isSelected = false;
    },

    view: function (vnode) {

        const { row } = vnode.attrs;

        const originSprite = new Sprite(spritesCache.getSprite(pathes[0], row.origin_sprites[0]));
        const targetSprite = new Sprite(spritesCache.getSprite(pathes[1], row.target_sprites[0]));

        const selectedClass = vnode.state.isSelected ? ' comparing-selected' : '';

        console.log('selectedClass', selectedClass);

        return Mithril('div', {
            class: 'row comparing-item-widget' + selectedClass,
            onclick: () => {
                vnode.state.isSelected = !vnode.state.isSelected;
            }
        }, [
            Mithril('div', { class: 'col-3 widget-origin-sprite' }, Mithril(originSprite)),
            Mithril('div', { class: 'col-3 widget-origin-id' }, row.origin_id),
            Mithril('div', { class: 'col-3 widget-target-id' }, row.target_id),
            Mithril('div', { class: 'col-3 widget-target-sprite' }, Mithril(targetSprite)),
            Mithril('div', { class: 'col-6 widget-json' }, Mithril(ComparingJSON, row.origin_attributes)),
            Mithril('div', { class: 'col-6 widget-json' }, Mithril(ComparingJSON, row.target_attributes)),
        ]);
    }
}

const ComparingItemList = {
    view: function () {

        const childrens = compareItemsByAttributesRepository.rows.map((row) => Mithril(ComparingItem, { class: 'col-12', row, key: row.origin_id }));

        return Mithril(BootstrapGrid, { style: 'margin-top: 15px;' }, childrens);
    }
}

const ComparingComponent = {
    view: function () {
        return [
            Mithril(TopNavigation),
            Mithril(ComparingItemList)
        ];
    }
}

export class CompareItemsByAttributesModule {

    constructor() {

        this.loadedOriginSprites = false;
        this.loadedTargetSprites = false;
    }

    onFileLoaded(path, fileId) {

        loadedFileIds[path] = fileId;

        if (this.isFilesLoaded()) {

            const originId = loadedFileIds[pathes[0]];
            const targetId = loadedFileIds[pathes[1]];

            compareItemsByAttributesRepository = new CompareItemsByAttributesRepository(originId, targetId);

            compareItemsByAttributesRepository.findMissingPickableAttributeItemsOnTarget(this.onFoundItems.bind(this));

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

        const comparingItems = compareItemsByAttributesRepository.rows && compareItemsByAttributesRepository.rows.length;

        if (!comparingItems) {

            return Mithril(LoadingComponent, 'Comparing files to find different market attributes...')
        }

        if (!this.loadedOriginSprites || !this.loadedTargetSprites) {

            return Mithril(LoadingComponent, 'Loading sprites...')
        }

        return Mithril(ComparingComponent);
    }
}