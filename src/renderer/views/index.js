import Mithril from 'mithril';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './index.css';
import { HomeModule } from './modules/home';
import { SprMarketMergeModule } from './modules/spr-market/spr-market-merge';
import { ErrorModule } from './modules/404';
import { registerRendererList } from '../../ipc-events/register-renderer-list';
import { SprMarketCompareModule } from './modules/spr-market/spr-market-compare';

registerRendererList();

Mithril.route(document.body, "/home", {
    "/home": HomeModule,
    "/spr-market-merge": SprMarketMergeModule,
    "/spr-market-compare": SprMarketCompareModule,
    "/:404...": ErrorModule
});