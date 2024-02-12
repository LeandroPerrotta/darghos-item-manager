import Mithril from "mithril";
import { PanelBuilder } from "./panel";

export class FormGroupBuilder extends PanelBuilder {

    constructor(title) {

        super(title);

        this.hasSubmit = false;
    }

    addSelect({ title, selected, onchange, options }) {

        this.addColumn([
            Mithril(BSSelect, { title, selected, onchange, options })
        ], 'col-6 col-xs-12');

        return this;
    }

    addSubmitButton({ label = 'Submit', isLoading = false, disabled = false, onclick = undefined }) {

        this.addNewRow(['mt-2', 'justify-content-end'])
            .addColumn(!isLoading
                ?
                    Mithril('button', {
                        class: 'btn btn-primary btn-sm', disabled, onclick
                    }, label)
                :
                    Mithril('button', {
                        class: 'btn btn-primary btn-sm', disabled: true
                    }, [
                        Mithril('span', { class: 'spinner-border spinner-border-sm', "aria-hidden": true }),
                        Mithril('span', { role: 'status' }, ' Loading...')
                    ])
                , 'col-4 col-xs-8 d-flex justify-content-center')

        this.hasSubmit = true;

        return this;
    }

    static build(vnode) {

        const config = FormGroupBuilder.getConfigFromVnode(vnode);

        if(!config.hasSubmit) {

            console.warn('FormGroupFactory should have a configured submit button');
        }

        return PanelBuilder.build(vnode);
    }

    /**
     * 
     * @param {*} vnode 
     * @returns {FormGroupBuilder}
     */
    static getConfigFromVnode(vnode) {

        return vnode.attrs.builder;
    }
}

export const FormGroup = {
    view: function (vnode) {

        return FormGroupBuilder.build(vnode);
    }
}

const BSSelect = {
    view: function ({ attrs: { title, selected, onchange, options } }) {

        return [Mithril('select', {
            onchange, class: 'form-select form-select-sm'
        }, [
            Mithril('option', { selected: selected, disabled: true }, title),
            ...options
        ])]
    }
}