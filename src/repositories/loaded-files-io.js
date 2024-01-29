import { Database } from "../core/database";

export class LoadedFilesIoRepository {

    constructor() {

        this.insertingItems = [];
        this.db = Database.getInstance().db;
    }

    getFileIdIfExists(checksum, file_path) {

        return new Promise((resolve, reject) => {

            this.db.serialize(() => {

                this.db.all('SELECT id FROM loaded_files WHERE file_path = ? AND checksum = ? ', [file_path, checksum], (err, rows) => {

                    if (err) {

                        return reject(err);
                    }

                    if (rows.length > 0) {

                        resolve(rows[0].id);
                    } else {

                        resolve();
                    }
                });
            });
        });
    }

    insertFile(checksum, file_path) {

        return new Promise((resolve, reject) => {

            this.db.serialize(() => {

                this.db.run('INSERT INTO loaded_files (checksum, file_path, added_in) values (?, ?, strftime(\'%s\', \'now\'))', [checksum, file_path], function (err) {

                    if (err) {

                        return reject(err);
                    }

                    resolve(this.lastID);
                });
            });
        });
    }
}