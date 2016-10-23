let table = new Uint32Array(256),
    crc;
for (var i = 0, j; i < 256; i++) {
  crc = i>>>0;
  for (j = 0; j < 8; j++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  table[i] = crc;
}

function calcCRC(buffer) {
  var crc = (-1>>>0), len = buffer.length, i;
  for (i = 0; i < len; i++) crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xff];
  return (crc ^ -1)>>>0;
}

function str2Uint32(s) {
  let arr = new Uint8Array(4);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = s.charCodeAt(i);
  }
  return (arr[0])<<24 | (arr[1])<<16 | (arr[2])<<8 | arr[3];
}

function uint32ToStr(v) {
    let c = String.fromCharCode;
    return  c((v & 0xff000000)>>>24) + c((v & 0xff0000)>>>16) + 
            c((v & 0xff00)>>>8) + c((v & 0xff)>>>0);
}

function str2Uint8Arr(s) {
  var buf = new ArrayBuffer(s.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, sLen=s.length; i < sLen; i++) {
    bufView[i] = s.charCodeAt(i);
  }
  return bufView;
}

let concatBuffers = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

function build_pHYs(dpi) {

  let crcBuffer,
      pHYs = new ArrayBuffer(4+4+4+4+1+4),
      dvPHYs = new DataView(pHYs);

  dvPHYs.setUint32(0, 9, false);
  dvPHYs.setUint32(4, str2Uint32("pHYs"), false);
  dvPHYs.setUint32(8, Math.round(dpi/0.0254), false);
  dvPHYs.setUint32(12, Math.round(dpi/0.0254), false);
  dvPHYs.setUint8(16, 1, false);

  dvPHYs.setUint32(17, calcCRC(new Uint8Array(dvPHYs.buffer, 4, pHYs.byteLength-8)));

  return dvPHYs.buffer;

}

function build_tEXt(keyword, content) {

  let keywordArr = str2Uint8Arr(keyword),
      textArr = str2Uint8Arr(content),
      tEXt = new ArrayBuffer(4+4+keywordArr.byteLength+1+textArr.byteLength+4),
      dvtEXt = new DataView(tEXt),
      pos = 8;

  dvtEXt.setUint32(0, keywordArr.byteLength+1+textArr.byteLength, false);
  dvtEXt.setUint32(4, str2Uint32("tEXt"), false);

  for (let i = 0; i < keywordArr.byteLength; i++) {
    dvtEXt.setUint8(pos, keywordArr[i]);
    pos++;
  }
  dvtEXt.setUint8(pos, 0);
  pos++;
  for (let i = 0; i < textArr.byteLength; i++) {
    dvtEXt.setUint8(pos, textArr[i]);
    pos++;
  }

  dvtEXt.setUint32(pos, calcCRC(new Uint8Array(dvtEXt.buffer, 4, tEXt.byteLength-8)));

  return dvtEXt.buffer;

}

function tracePNGChunks(buffer) {
  let dv = new DataView(buffer),
      pos = 8,
      getUint32 = function() {
        var data = dv.getUint32(pos, false);
        pos += 4;
        return data;
      };
  while (pos < dv.buffer.byteLength) {
    let size = getUint32(),
        name = uint32ToStr(getUint32()),
        crc;
      pos += size;
      crc = getUint32();
  }
}

export {concatBuffers, uint32ToStr, calcCRC, build_pHYs, build_tEXt, tracePNGChunks};
