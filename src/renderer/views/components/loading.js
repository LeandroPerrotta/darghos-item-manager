import Mithril from "mithril";
import { Panel, PanelBuilder } from "./panel";

export const LoadingComponent = {
    view: function(vnode) {

        const Spinner = [
            Mithril('strong', { role: 'status' }, vnode.children),
            Mithril('div', { class: 'spinner-border ms-auto float-end', ['aria-hidden']: 'true' })
        ];

        const panelBuilder = new PanelBuilder();

        panelBuilder.isContainer();

        panelBuilder.addRowClass('d-flex');
        panelBuilder.addRowClass('justify-content-center');

        panelBuilder.addColumn(Spinner, 'col-6 d-flex align-items-center')

        return Mithril(Panel, { builder: panelBuilder });
    }
}