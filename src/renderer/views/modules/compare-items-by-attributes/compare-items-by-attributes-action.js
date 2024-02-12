import Mithril from "mithril"
import { FormGroup, FormGroupBuilder } from "../../components/form-group";

const actionsList = [
    { label: 'Copy market attributes from right to left', value: 'copy_market_right_to_left' },
];

export const CompareItemsByAttributesAction = {
    oninit: function(vnode) {

        vnode.state.selectedAction = null;
        vnode.state.canDoAction = false;
        vnode.state.isLoading = false;
    },
    onSelectAction: function (value, vnode) {

        if (value) {

            vnode.state.selectedAction = value;
        }

        return true;
    },    
    view: function(vnode) {

        const actionsOptions = actionsList.map((action) => Mithril('option', { value: action.value }, action.label));

        const formGroupBuilder = new FormGroupBuilder('Actions');

        formGroupBuilder.addColumn(Mithril(SelectedItemsCounter), 'col-12');

        formGroupBuilder.addSelect({
            title: 'Select an action',
            selected: !vnode.state.selectedAction,
            onchange: (event) => this.onSelectAction(event.target.value, vnode), 
            options: actionsOptions
        });
        formGroupBuilder.addSubmitButton({
            label: 'Do Action', 
            isLoading: vnode.state.isLoading, 
            disabled: !vnode.state.isLoading ? !vnode.state.canDoAction : true, 
            onclick: () => { /* to be implemented*/ }            
        })

        return Mithril(FormGroup, { builder: formGroupBuilder });
    }
}

export const SelectedItemsCounter = {
    selectedItems: [],
    append: function(itemId) {

        this.selectedItems.push(itemId);
    },
    remove: function(itemId) {

        const index = this.selectedItems.indexOf(itemId);

        if (index > -1) {
            this.selectedItems.splice(index, 1);
        }
    },
    view: function() {

        return Mithril('div', [ 
            'Total selected items: ',
            Mithril('span', { class: 'badge text-bg-info' }, this.selectedItems.length)
        ])
    }
}