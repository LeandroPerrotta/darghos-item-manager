import { existsSync, readdirSync } from "fs";
import { extname, join, basename, dirname } from "path";

export function discoverDatFile(path) {

    // Verifica se o diretório existe
    if (!existsSync(path)) {

        return null;
    }

    const files = readdirSync(path);

    // Procura por "Tibia.dat"
    const tibiaDat = files.find(file => file.toLowerCase() === 'tibia.dat');
    if (tibiaDat) {

        return join(path, tibiaDat);
    }

    // Procura por qualquer arquivo .dat
    const arquivoDat = files.find(file => extname(file).toLowerCase() === '.dat');
    if (arquivoDat) {

        return join(path, arquivoDat);
    }

    // Caso nenhum arquivo .dat seja encontrado
    return null;
}

export function discoverSprFileFromDat(datFilePath) {
    if (!datFilePath) {
        return null;
    }

    // Extrai o nome do arquivo sem a extensão
    const baseName = basename(datFilePath, '.dat');

    // Adiciona a nova extensão .spr e mantém o mesmo diretório
    const sprFilePath = join(dirname(datFilePath), `${baseName}.spr`);

    return sprFilePath;
}