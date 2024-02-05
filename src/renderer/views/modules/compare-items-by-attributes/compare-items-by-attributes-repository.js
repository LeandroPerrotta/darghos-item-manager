import { requestQueryRunnerGetAll } from "../../../../ipc-events/query-runner/renderer";

export class CompareItemsByAttributesRepository {

    constructor(originId, targetId) {

        this.originId = originId;
        this.targetId = targetId;
    }

    findMissingMarketAttributeItemsOnTarget(callback) {

        const query = `
        SELECT 
            target.id target_id,
            target."attributes" target_attributes,
            target."sprites_index" target_sprites,
            origin.id origin_id,
            origin."attributes" origin_attributes,
            origin."sprites_index" origin_sprites
        FROM items target
        LEFT JOIN items origin ON target.id = origin.id AND origin.file_id = ?
        WHERE target.file_id = ?
          AND target.id < 5089
          AND json_extract(target.attributes, '$.ThingAttrMarket') IS NOT NULL
          AND (origin.id IS NULL OR json_extract(origin.attributes, '$.ThingAttrMarket') IS NULL);
        `;

        const params = [ this.originId, this.targetId ];

        requestQueryRunnerGetAll(query, params, (rows) => {

            const formattedRows = rows.map(row => {

                row.origin_sprites = JSON.parse(row.origin_sprites);
                row.target_sprites = JSON.parse(row.target_sprites);

                return row;
            })

            callback(formattedRows);
        });
    }

    findMissingPickableAttributeItemsOnTarget(callback) {

        const query = `
        SELECT 
            target.id target_id,
            target."attributes" target_attributes,
            target."sprites_index" target_sprites,
            origin.id origin_id,
            origin."attributes" origin_attributes,
            origin."sprites_index" origin_sprites
        FROM items target
        LEFT JOIN items origin ON target.id = origin.id AND origin.file_id = ?
        WHERE target.file_id = ?
          AND target.id < 5089
          AND json_extract(target.attributes, '$.ThingAttrPickupable') IS NOT NULL
          AND (origin.id IS NULL OR json_extract(origin.attributes, '$.ThingAttrPickupable') IS NULL);
        `;

        const params = [ this.originId, this.targetId ];

        requestQueryRunnerGetAll(query, params, (rows) => {

            const formattedRows = rows.map(row => {

                row.origin_sprites = JSON.parse(row.origin_sprites);
                row.target_sprites = JSON.parse(row.target_sprites);

                return row;
            })

            callback(formattedRows);
        });
    }    
}