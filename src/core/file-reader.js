import { readFileSync } from 'fs';

export class FileReader {

    constructor(file_path) {

        this.buffer = readFileSync(file_path);
        this.offset = 0;
    }

    tell() {
        return this.offset;
    }

    seek(pos) {

        if (pos < 0 || pos > this.buffer.length) {
            throw new Error("Position out of bounds");
        }

        this.offset = pos;
    }

    getU8() {
        const value = this.buffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }

    getU16() {
        const value = this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    getU32() {
        const value = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    get8() {
        const value = this.buffer.readInt8(this.offset);
        this.offset += 1;
        return value;
    }

    get16() {
        const value = this.buffer.readInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    get32() {
        const value = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    getString() {
        const len = this.getU16();

        if (len > 0 && len < 8192) {
            const strBuffer = this.buffer.slice(this.offset, this.offset + len);
            this.offset += len;

            return strBuffer.toString('utf-8');
        } else if (len !== 0) {

            throw new Error("String length too large");
        }

        return '';
    }
}