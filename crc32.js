// CRC32 code based on https://stackoverflow.com/a/18639999/387194
const crcTable = (() => {
    let c;
    const result = [];
    for (let n =0; n < 256; n++) {
        c = n;
        for(var k =0; k < 8; k++) {
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        result[n] = c;
    }
    return result;
})();

const crc32 = (str) => {
    let crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

export default (str) => {
    return crc32(str).toString(36);
};
