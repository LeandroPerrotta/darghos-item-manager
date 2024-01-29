import "./core/globals";
import { Database } from "./core/database.js";
import { ElectronApp } from "./renderer/electron-app.js";

async function main() {

    const database = Database.getInstance();

    await database.connect();
    await database.prepare();

    ElectronApp.getInstance().setup();
}

main();