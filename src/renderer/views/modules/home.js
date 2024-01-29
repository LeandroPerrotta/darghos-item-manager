import Mithril from 'mithril';
import { TopNavigation } from '../components/top-navigation';

export const HomeModule = {
    view: function() {
        return Mithril("div", [
            Mithril(TopNavigation),
            Mithril("h1", "Home"),
            Mithril("p", "This is a toolset to help developing some parts of Darghos"),
            Mithril("p", "This toolset is developed using NodeJS & Electron")
        ]);
    }
};