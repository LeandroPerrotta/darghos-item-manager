import { Statement } from "sqlite3";
import { Database } from "../core/database";
import { ThingItem } from "../core/thing-item";

export class ItemIoRepository {

    constructor() {

        this.insertingItems = [];
        this.db = Database.getInstance().db;
    }

    /**
    * 
    * @param {Statement} stmt 
    * @param {*} item 
    */
    insertItem(stmt, item) {

        return new Promise((resolve, reject) => {

            stmt.run(item, (err) => {

                if (err) {

                    reject(err);
                }

                resolve();
            })
        })
    }

    insertAllItems() {

        console.log('Going to insert items', this.insertingItems[0].file_id)

        return new Promise((resolve, reject) => {

            this.db.serialize(() => {

                this.db.run('BEGIN TRANSACTION', () => {

                    const stmt = this.db.prepare(`INSERT INTO items (
                        id, file_id, attributes, group_count, size_width, size_height,
                        real_size, layers, pattern_y, pattern_x, pattern_z,
                        group_animation_phases, animation, sprites_index
                    ) values (
                        :id, :file_id, :attributes, :group_count, :size_width, :size_height,
                        :real_size, :layers, :pattern_y, :pattern_x, :pattern_z,
                        :group_animation_phases, :animation, :sprites_index
                    )`);

                    const insertPromises = this.insertingItems.map(item => this.insertItem(stmt, item));

                    Promise.all(insertPromises).then(() => {

                        console.log(`All ${insertPromises.length} items inserted`)

                        stmt.finalize();
                        this.db.run('COMMIT', () => {

                            resolve();
                        });

                        
                    }).catch(err => {

                        console.error('Failed to insert: ', err)

                        stmt.finalize();
                        this.db.run('ROLLBACK', () => {

                            reject(err);
                        });
                    })
                });
            });
        });
    }

    /**
     * 
     * @param {ThingItem} item 
     */
    addItemToBeInserted(item, file_id) {

        this.insertingItems.push({
            ':id': item.id,
            ':attributes': JSON.stringify(item.attributes),
            ':group_count': item.groupCount,
            ':size_width': item.size.width,
            ':size_height': item.size.height,
            ':real_size': item.realSize,
            ':layers': item.layers,
            ':pattern_y': item.numPatternY,
            ':pattern_x': item.numPatternX,
            ':pattern_z': item.numPatternZ,
            ':group_animation_phases': item.animationPhases,
            ':animation': JSON.stringify(item.animator),
            ':sprites_index': JSON.stringify(item.spritesindex),
            ':file_id': file_id,
        })
    }
}