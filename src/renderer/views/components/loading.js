import Mithril from "mithril";
import { BootstrapGrid } from "./bootstrap-grid";

export const LoadingComponent = {
    view: function(vnode) {

        const grid = new BootstrapGrid();

        const Spinner = [
            Mithril('strong', { role: 'status' }, vnode.children),
            Mithril('div', { class: 'spinner-border ms-auto float-end', ['aria-hidden']: 'true' })
        ];
        
        grid.addRowClass('d-flex justify-content-center');
        grid.addColumn({ class: 'col-6 d-flex align-items-center' }, Spinner);

        return Mithril(grid);
    }
}