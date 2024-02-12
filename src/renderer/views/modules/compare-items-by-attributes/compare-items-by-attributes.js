import Mithril from 'mithril';
import { LoadingComponent } from '../../components/loading';
import { requestFullLoadFile } from '../../../../ipc-events/full-load-file/renderer';
import { Sprite, SpritesCache } from '../../components/sprite';
import './compare-items-by-attributes.css';
import { TopNavigation } from '../../components/top-navigation';
import { CompareItemsByAttributesOptions } from './compare-items-by-attributes-options';
import { CompareItemsByAttributesAction, SelectedItemsCounter } from './compare-items.by-attributes-action';
import { Panel, PanelBuilder } from '../../components/panel';

const pathes = [];
const loadedFileIds = {};
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

        return Mithril('div', {
            class: 'row comparing-item-widget' + selectedClass,
            onclick: () => {
                vnode.state.isSelected = !vnode.state.isSelected;
                
                vnode.state.isSelected 
                    ? SelectedItemsCounter.append(row.origin_id)
                    : SelectedItemsCounter.remove(row.origin_id);
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
    view: function (vnode) {

        const panelConfigBuilder = new PanelBuilder('Item list');

        const itemList = vnode.attrs.loadedItems.map((row) => Mithril(ComparingItem, { row, key: row.origin_id }));

        panelConfigBuilder.isContainer();
        panelConfigBuilder.addColumn(itemList, 'col-sm-12');

        return Mithril(Panel, { style: 'margin-top: 15px;', builder: panelConfigBuilder });
    }
}

const ComparingComponent = {
    oninit: function (vnode) {

        this.resetStates(vnode);
    },
    resetStates: function (vnode) {

        vnode.state.loadedItems = [];
        vnode.state.loadedSprites = { origin: false, target: false };
    },
    isSpritesLoaded: function (vnode) {

        const { loadedSprites } = vnode.state;

        return loadedSprites.origin && loadedSprites.target;
    },
    shouldShowItemList: function (vnode) {

        const { loadedItems } = vnode.state;

        return loadedItems.length && this.isSpritesLoaded(vnode);
    },
    loadSprites: function (vnode) {

        const { loadedItems } = vnode.state

        const origin_sprites = loadedItems.map((row) => row.origin_sprites[0]);
        const target_sprites = loadedItems.map((row) => row.target_sprites[0]);

        return [new Promise(resolve => {

            spritesCache.preloadAllSprites(pathes[0], origin_sprites, function () {

                vnode.state.loadedSprites.origin = true;

                resolve();
            });
        }), new Promise(resolve => {

            spritesCache.preloadAllSprites(pathes[1], target_sprites, function () {

                vnode.state.loadedSprites.target = true;

                resolve();
            });
        })];
    },
    view: function (vnode) {

        const originId = loadedFileIds[pathes[0]];
        const targetId = loadedFileIds[pathes[1]];

        const OptionsForm = Mithril(CompareItemsByAttributesOptions, {
            onApplyOptions: () => {

                this.resetStates(vnode);
            },
            onLoadItems: (loadedItems, onFinishLoad) => {

                vnode.state.loadedItems = loadedItems;

                Promise.all(this.loadSprites(vnode)).then(() => {

                    onFinishLoad();
                    Mithril.redraw();
                });
            }, originId, targetId
        });

        const ActionForm = Mithril(CompareItemsByAttributesAction);

        const panelBuilder = new PanelBuilder();

        panelBuilder.isContainer();
        panelBuilder.addColumn(OptionsForm, 'compare-items-options-wrapper');
        panelBuilder.addColumn(ActionForm, 'compare-items-action-wrapper');

        return [
            Mithril(TopNavigation),
            Mithril(Panel, { builder: panelBuilder }),
            this.shouldShowItemList(vnode) ? Mithril(ComparingItemList, { loadedItems: vnode.state.loadedItems }) : null
        ];
    }
}

export class CompareItemsByAttributesModule {

    onFileLoaded(path, fileId) {

        loadedFileIds[path] = fileId;

        if (this.isFilesLoaded()) {

            Mithril.redraw();
        }

        console.log('loadedFileIds', loadedFileIds);
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

        return Mithril(ComparingComponent);
    }
}