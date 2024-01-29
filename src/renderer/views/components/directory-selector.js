import Mithril from 'mithril';
import { requestOpenDirectoryDialog } from "../../../ipc-events/directory-dialog/renderer";

export const DirectoryPathStates = new Map();
const OnDirectoryOpenCallbacks = new Map();

function onDirectoryOpen(id, path) {

    DirectoryPathStates.set(id, path);

    if (OnDirectoryOpenCallbacks.has(id)) {

        const onDirectoryOpenCallback = OnDirectoryOpenCallbacks.get(id);

        if(typeof onDirectoryOpenCallback === 'function')
            onDirectoryOpenCallback(id, path);

        OnDirectoryOpenCallbacks.delete(id);
    }

    Mithril.redraw();
}

export const DirectorySelectorButton = {
    view: (vnode) => {

        const { id, onDirectoryOpenCallback } = vnode.attrs;

        if(!OnDirectoryOpenCallbacks.has(id))
            OnDirectoryOpenCallbacks.set(id, onDirectoryOpenCallback);

        if(!DirectoryPathStates.has(id))
            DirectoryPathStates.set(id, 'None');

        return Mithril("div", {
            class: 'input-group mb-3'
        }, [
            Mithril("button", {
                class: "btn btn-outline-secondary",
                type: "button",
                id: id,
                onclick: () => { requestOpenDirectoryDialog(id, onDirectoryOpen) } 
            }, id),            
            Mithril("input", {
                class: "form-control",
                type: 'text',
                value: DirectoryPathStates.get(id)
            }),
        ])
    }
}