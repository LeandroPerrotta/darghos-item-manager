/**
 * 
 * @param {object} defaultAttrs 
 * @param {import("mithril").Vnode} vnode 
 */
export function mergeVnodeAttrs(defaultAttrs, vnode) {

    const classes = [ defaultAttrs.class, vnode.attrs.class ].join(' ').trim();

    return { ...vnode.attrs, class: classes };
}