import Mithril from 'mithril';
import { TopNavigation } from '../../components/top-navigation';
import { DirectoryPathStates, DirectorySelectorButton } from '../../components/directory-selector';
import { requestPreLoadFile } from '../../../../ipc-events/pre-load-file/renderer';

const datLoadedSummary = {
    'dat-1': null,
    'dat-2': null
}

function onDirectoryOpenCallback(id, path) {

    requestPreLoadFile(id, path, onPreLoadFile);
}

export function onPreLoadFile(id, resume) {

    datLoadedSummary[id] = resume;

    Mithril.redraw();
}

function shoudMergeButtonBeEnabled() {

    return !(datLoadedSummary['dat-1'] && datLoadedSummary['dat-2']);
}

function onCompareFiles() {

    Mithril.route.set("/spr-market-compare", null, { state: { 
        paths: [
            DirectoryPathStates.get('dat-1'), 
            DirectoryPathStates.get('dat-2')
        ] 
    }});
}

const DatFileResume = {
    view: function (vnode) {

        const { id } = vnode.attrs;

        if(!datLoadedSummary[id]) {

            return [];
        }

        const resume = datLoadedSummary[id];

        return Mithril("div", { class: 'row row-cols-2'}, [
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `version-${id}`, value: resume.version }),
                    Mithril("label", { for: `version-${id}` }, 'Version'),
                ]),
            ]),
            
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `items-${id}`, value: resume.item }),
                    Mithril("label", { for: `items-${id}` }, 'Items')
                ])
            ]),

            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `creatures-${id}`, value: resume.creature }),
                    Mithril("label", { for: `creatures-${id}` }, 'Creatures')
                ])
            ]),
            
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `effects-${id}`, value: resume.effect }),
                    Mithril("label", { for: `effects-${id}` }, 'Effects')
                ])
            ]),   
            
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `missiles-${id}`, value: resume.missile }),
                    Mithril("label", { for: `missiles-${id}` }, 'Missiles')
                ])
            ]),   
            
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `sprites-${id}`, value: resume.spr_size }),
                    Mithril("label", { for: `missiles-${id}` }, 'Sprites')
                ])
            ]),   
            
            Mithril("div", { class: 'col' }, [ 
                Mithril("div", {
                    class: 'g-col form-floating mb-3'
                }, [
                    Mithril("input", { type: 'text', readonly: true, class: 'form-control-plaintext', id: `spr-version-${id}`, value: resume.spr_version }),
                    Mithril("label", { for: `missiles-${id}` }, 'Spr Version')
                ])
            ])             
        ])
    }
}

const DirectorySelector = {
    view: function () {
        return Mithril("div", {
            class: 'row'
        }, [
            Mithril("div", { class: 'col-6' }, [
                Mithril(DirectorySelectorButton, { id: 'dat-1', onDirectoryOpenCallback }),
                Mithril(DatFileResume, { id: 'dat-1' })
            ]),
            Mithril("div", { class: 'col-6' }, [
                Mithril(DirectorySelectorButton, { id: 'dat-2', onDirectoryOpenCallback }),
                Mithril(DatFileResume, { id: 'dat-2' })
            ])
        ]);
    }
};

export const SprMarketMergeModule = {
    view: function () {
        return Mithril("div", [
            Mithril(TopNavigation),
            Mithril("h1", "Spr Market Merge"),
            Mithril("p", "This tool is maded to make easier the merge of Market properties from two different Dat files."),
            Mithril(DirectorySelector),
            Mithril("div", { class: "row d-flex justify-content-center" }, [
                Mithril("div", { class: 'col-1' }, [
                    Mithril("button", { class: 'btn btn-primary', disabled: shoudMergeButtonBeEnabled(), onclick: () => onCompareFiles() }, "Compare")
                ])
            ])
        ]);
    }
};