import Mithril from 'mithril';

export const BootstrapGrid = {

    view(vnode) {

        const { children, attrs } = vnode;
        const rowClass = (attrs && attrs.class) ? ' ' + attrs.class : '';
        const containerStyle = (attrs && attrs.style) ? attrs.style : undefined;

        return Mithril('div', { class: 'container', style: containerStyle }, [
            Mithril('div', { 
                class: 'row' + rowClass
            }, children)
        ]);
    }    
}