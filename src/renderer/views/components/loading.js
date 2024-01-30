import Mithril from "mithril";
import { BootstrapGrid } from "./bootstrap-grid";

export const LoadingComponent = {
    view: function(vnode) {

        const Spinner = [
            Mithril('strong', { role: 'status' }, vnode.children),
            Mithril('div', { class: 'spinner-border ms-auto float-end', ['aria-hidden']: 'true' })
        ];

        return Mithril(BootstrapGrid, { class: 'd-flex justify-content-center', style: 'margin-top: 15px;' },
            Mithril('div', { class: 'col-6 d-flex align-items-center' }, Spinner));
    }
}