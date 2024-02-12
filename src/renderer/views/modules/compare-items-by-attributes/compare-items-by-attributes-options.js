import Mithril from "mithril"
import { CompareItemsByAttributesRepository } from "./compare-items-by-attributes-repository";
import { FormGroup, FormGroupBuilder } from "../../components/form-group";

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
    onFinishLoad: function (vnode) {

        vnode.state.isLoading = false;
    },
    onApply: function (vnode) {

        vnode.state.isLoading = true;

        const { onApplyOptions, onLoadItems, originId, targetId } = vnode.attrs;

        onApplyOptions();

        const compareItemsByAttributesRepository = new CompareItemsByAttributesRepository(originId, targetId);

        const self = this;

        const onLoadItemsCallback = function (loadedItems) {

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

        const formGroupBuilder = new FormGroupBuilder('Filters')
            .addSelect({ 
                title: 'Select an find criteria', 
                selected: !vnode.state.criteria, 
                onchange: (event) => this.onSelectCriteria(event.target.value, vnode), 
                options: criteriaOptions })
            .addSubmitButton({ 
                label: 'Apply', 
                isLoading: vnode.state.isLoading, 
                disabled: !vnode.state.isLoading ? !vnode.state.canApply : true, 
                onclick: () => this.onApply(vnode)
            });

        return Mithril(FormGroup, { builder: formGroupBuilder });
    }
}