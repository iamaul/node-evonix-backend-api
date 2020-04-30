const sharp = require('sharp');

async function cropImage(path, w, h, dest) {
    const process = await sharp(path).extract({ width: w, height: h }).toFile(dest)
    console.log('cropImage: ' + process);
    return process;
}

async function resizeImage(path, w, h, dest) {
    const process = await sharp(path).resize({ width: w, height: h }).toFile(dest)
    console.log('resizeImage: ' + process);
    return process;
}

module.exports = { cropImage, resizeImage }