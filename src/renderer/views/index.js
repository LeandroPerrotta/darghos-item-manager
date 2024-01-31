import Mithril from 'mithril';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './index.css';
import { HomeModule } from './modules/home';
import { CompareItemsFileSelectionModule } from './modules/compare-items-by-attributes/compare-items-file-selection';
import { ErrorModule } from './modules/404';
import { registerRendererList } from '../../ipc-events/register-renderer-list';
import { CompareItemsByAttributesModule } from './modules/compare-items-by-attributes/compare-items-by-attributes';

registerRendererList();

Mithril.route(document.body, "/home", {
    "/home": HomeModule,
    "/find-items-by-attributes": CompareItemsFileSelectionModule,
    "/compare-items": CompareItemsByAttributesModule,
    "/:404...": ErrorModule
});