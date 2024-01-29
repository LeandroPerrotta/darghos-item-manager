import Mithril from 'mithril';
import { TopNavigation } from '../components/top-navigation';

export const ErrorModule = {
    view: function() {
        return Mithril("div", [
            Mithril(TopNavigation),
            Mithril("p", "This page does not exists"),
        ]);
    }
};