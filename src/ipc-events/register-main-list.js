import { registerDirectoryDialogMain } from "./directory-dialog/main";
import { registerFullLoadFileMain } from "./full-load-file/main";
import { registerLoadSpriteMain } from "./load-sprite/main";
import { registerPreLoadFileMain } from "./pre-load-file/main";
import { registerQueryRunnerMain } from "./query-runner/main";

const list = [
    registerDirectoryDialogMain,
    registerPreLoadFileMain,
    registerFullLoadFileMain,
    registerQueryRunnerMain,
    registerLoadSpriteMain
];

export function registerMainList() {

    for(const registerCallback of list) {

        registerCallback();
    }
}