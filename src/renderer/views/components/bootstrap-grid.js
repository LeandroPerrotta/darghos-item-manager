import Mithril from 'mithril';

export class BootstrapGrid {

    constructor() {

        this.columns = [];
        this.rowAttr = { class: 'row' };
    }

    addColumn(attrs, children) {

        this.columns.push([ attrs, children ]);
    }

    addRowClass(rowClass) {

        this.rowAttr.class = this.rowAttr.class + ' ' + rowClass;
    }

    view() {

        const childColumns = this.columns.map((columnAttrs) => {

            const [attrs, children ] = columnAttrs;

            return Mithril('div', attrs, children);
        })

        return Mithril('div', { class: 'container' }, [
            Mithril('div', this.rowAttr, childColumns)
        ]);
    }
}