import Mithril from "mithril";
import { propertiesBuilder } from "../helpers/properties-builder";
import { mergeVnodeAttrs } from "../helpers/merge-attrs";
import "./panel.css"

export class PanelBuilder {

    constructor(title = null) {

        this.m_rows = []
        this.m_currentRow = []
        this.m_isContainer = false;
        this.m_properties = {};
        this.m_title = title;
    }

    addColumn(child, columnClass) {

        this.m_currentRow.push({ class: columnClass, child });

        return this;
    }

    addRowClass(className) {

        if (!this.m_properties.class) {

            this.m_properties.class = [];
        }

        this.m_properties.class.push(className);

        return this;
    }

    isContainer() {

        this.m_isContainer = true;

        return this;
    }

    /**
     * 
     * @param {[] | null} rowClasses 
     * @returns 
     */
    addNewRow(rowClasses) {

        this.m_rows.push({ properties: this.m_properties, childrens: this.m_currentRow });

        this.m_currentRow = [];
        this.m_properties = {};

        if (rowClasses && rowClasses.length) {

            rowClasses.forEach(rowClass => this.addRowClass(rowClass));
        }

        return this;
    }

    static build(vnode) {

        const configs = PanelBuilder.getConfigFromVnode(vnode);

        let rows = [];

        if (configs.m_title) {

            rows.push(Mithril(BSRow, 
                Mithril(BSColumn, { class: 'col' }, Mithril('h6', { class: 'col border-bottom border-2 panel-title' }, configs.m_title))
            ));
        }

        if (configs.m_currentRow.length) {

            configs.addNewRow();
        }

        rows.push(...configs.m_rows.map(({ properties, childrens }) => {

            return Mithril(BSRow, propertiesBuilder(properties), childrens.map((children) => {

                return Mithril(BSColumn, { class: children.class }, children.child);
            }));
        }));

        return configs.m_isContainer ? Mithril(BSContainer, rows) : rows
    }

    /**
     * 
     * @param {*} vnode 
     * @returns {PanelBuilder}
     */
    static getConfigFromVnode(vnode) {

        return vnode.attrs.builder;
    }
}

export const Panel = {
    view: function (vnode) {

        return PanelBuilder.build(vnode);
    }
}

const BSContainer = {
    view: function (vnode) {

        return Mithril('div', mergeVnodeAttrs({ class: 'container' }, vnode), vnode.children);
    }
}

const BSRow = {
    view: function (vnode) {

        return Mithril('div', mergeVnodeAttrs({ class: 'row p-2' }, vnode), vnode.children);
    }
}

const BSColumn = {
    view: function (vnode) {

        return Mithril('div', mergeVnodeAttrs({ class: 'col' }, vnode), vnode.children);
    }
}

