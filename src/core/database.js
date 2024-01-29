import { readFileSync } from 'original-fs';
import { Database as SQLiteDb } from 'sqlite3';
import { join } from 'path';

console.log('dirname', global.projectRoot)

const ASSETS_DIR = join(global.projectRoot, 'assets');
const DB_FILE = join(ASSETS_DIR, './datreader.sqlite');
const DEFAULT_SCHEMA = readFileSync(join(ASSETS_DIR, 'schema.sql'), 'utf8');

export class Database {

    constructor() {

        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            console.log('Connecting...');

            this.db = new SQLiteDb(DB_FILE, (err) => {
                if (err) {
                    console.error('Connection Error:', err);
                    return reject(err);
                }

                console.log('Connected!');
                resolve(this);
            });
        });
    }

    prepare() {

        return new Promise((resolve, reject) => {

            this.db.serialize(() => {

                this.db.exec(DEFAULT_SCHEMA, (err) => {
                    if (err) {

                        console.error(err)

                        return reject(err);
                    }

                    resolve();
                });
            });
        })
    }

    /**
     * 
     * @returns {Database}
     */
    static getInstance() {

        if (!Database.instance) {

            Database.instance = new Database();
        }

        return Database.instance;
    }
}