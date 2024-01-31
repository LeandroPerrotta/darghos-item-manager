import Mithril from 'mithril';

const NavItem = {
    view: (vnode) => {

        const { name, url } = vnode.attrs;

        return Mithril("li", { class: 'nav-item' }, [
            Mithril("a", {
                class: 'nav-link',
                href: url,
                onclick: (e) => {

                    e.preventDefault();

                    Mithril.route.set(url); 
                }
            }, name)
        ])
    }
}

const NavItemList = {
    view: () => {
        return Mithril("div", {
            class: 'collapse navbar-collapse',
            id: 'navbarSupportedContent'
        }, [
            Mithril("ul", { class: 'navbar-nav me-auto mb-2 mb-lg-0' }, [
                Mithril(NavItem, { name: 'Home', url: '/home' }),
                Mithril(NavItem, { name: 'Find Items by Attributes', url: '/find-items-by-attributes' })
            ])
        ])
    }
}

const buttonProperties = {
    class: 'navbar-toggler', 
    type: 'button', 
    ["data-bs-toggle"]: 'collapse', 
    ["data-bs-target"]: '#navbarSupportedContent',
    ["aria-controls"]: 'navbarSupportedContent',
    ["aria-expanded"]: 'false',
    ["aria-label"]: 'Toggle navigation',
}

export const TopNavigation = {
    view: () => {

        return Mithril("nav", {
            class: 'navbar navbar-expand-lg bg-body-tertiary'
        }, [
            Mithril("div", {
                class: 'container-fluid'
            }, [
                Mithril("a", { class: 'navbar-brand', href: '#' }, 'Darghos Spr Tools'),
                Mithril("button", buttonProperties, [
                    Mithril("span", { class: 'navbar-toggler-icon' })
                ]),
                Mithril(NavItemList)
            ])
        ])
    }
};