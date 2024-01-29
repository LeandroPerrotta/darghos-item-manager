import { registerDirectoryDialogRenderer } from "./directory-dialog/renderer";
import { registerFullLoadFileRenderer } from "./full-load-file/renderer";
import { registerLoadSpriteRenderer } from "./load-sprite/renderer";
import { registerPreLoadFileRenderer } from "./pre-load-file/renderer";
import { registerQueryRunnerRenderer } from "./query-runner/renderer";

const list = [
    registerDirectoryDialogRenderer,
    registerPreLoadFileRenderer,
    registerFullLoadFileRenderer,
    registerQueryRunnerRenderer,
    registerLoadSpriteRenderer
];

export function registerRendererList() {

    for(const registerCallback of list) {

        registerCallback();
    }
}