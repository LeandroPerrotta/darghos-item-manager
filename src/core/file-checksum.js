import { createHash } from "crypto";
import { createReadStream } from "fs";

export function fileChecksum(path) {
    return new Promise((resolve, reject) => {
        const hash = createHash('md5');
        const stream = createReadStream(path);

        stream.on('data', (data) => {
            hash.update(data, 'utf8');
        });

        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}