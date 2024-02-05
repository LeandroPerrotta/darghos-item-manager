import Mithril from "mithril"
import { CompareItemsByAttributesRepository } from "./compare-items-by-attributes-repository";

const findItemsByCriteria = [
    { label: 'Missing market attributes on left', value: 'missing_market_attributes' },
    { label: 'Missing pickeable attribute on left', value: 'missing_pickeable_attributes' }
];

export const CompareItemsByAttributesOptions = {
    oninit: function (vnode) {

        vnode.state.criteria = null;
        vnode.state.canApply = false;
        vnode.state.isLoading = false;
    },
    onSelectCriteria: function (value, vnode) {

        if (value) {

            vnode.state.criteria = value;
            vnode.state.canApply = true;
        }

        return true;
    },
    onFinishLoad: function(vnode) {

        vnode.state.isLoading = false;
    },
    onApply: function(vnode) {

        vnode.state.isLoading = true;

        const { onApplyOptions, onLoadItems, originId, targetId } = vnode.attrs;

        onApplyOptions();

        const compareItemsByAttributesRepository = new CompareItemsByAttributesRepository(originId, targetId);

        const self = this;

        const onLoadItemsCallback = function(loadedItems) {

            onLoadItems(loadedItems, () => self.onFinishLoad(vnode));
        };

        const criteriaCallbacks = {
            missing_market_attributes: compareItemsByAttributesRepository.findMissingMarketAttributeItemsOnTarget.bind(compareItemsByAttributesRepository),
            missing_pickeable_attributes: compareItemsByAttributesRepository.findMissingPickableAttributeItemsOnTarget.bind(compareItemsByAttributesRepository),
        };

        criteriaCallbacks[vnode.state.criteria](onLoadItemsCallback);
    },
    view: function (vnode) {

        const criteriaOptions = findItemsByCriteria.map((criteria) => Mithril('option', { value: criteria.value }, criteria.label));

        return [
            Mithril('div', { class: 'col p-2 compare-items-options-wrapper' }, [

                Mithril('div', { class: 'row' }, [

                    Mithril('div', { class: 'col-4' }, [

                        Mithril('select', {
                            onchange: (event) => this.onSelectCriteria(event.target.value, vnode), class: 'form-select form-select-sm'
                        }, [
                            Mithril('option', { selected: !vnode.state.criteria, disabled: true }, 'Select an find criteria'),
                            ...criteriaOptions
                        ])
                    ])
                ]),

                Mithril('div', { class: 'row mt-2 justify-content-end' }, [

                    Mithril('div', { class: 'col-2' }, [

                        !vnode.state.isLoading 
                            ? 
                                Mithril('button', {
                                    class: 'btn btn-primary btn-sm', disabled: !vnode.state.canApply, onclick: () => this.onApply(vnode)
                                }, 'Apply') 
                            : 
                                Mithril('button', {
                                    class: 'btn btn-primary btn-sm', disabled: true }, [
                                        Mithril('span', { class: 'spinner-border spinner-border-sm', "aria-hidden": true }),
                                        Mithril('span', { role: 'status' }, ' Loading...')
                                    ])                             
                    ])
                ])
            ])
        ];
    }
}