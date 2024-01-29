import { ipcMain } from "electron";
import { Database } from "../../core/database";

export function registerQueryRunnerMain() {

    ipcMain.on('query-runner-get-all', (event, query, params, uuid) => {

        const { db } = Database.getInstance();

        db.serialize(() => {

            db.all(query, params, (err, rows) => {

                if(err) {

                    event.reply('on-query-runner-get-all');

                    return;
                }

                console.log(rows)

                event.reply('on-query-runner-get-all', uuid, rows);
            });
        });
    });
}