import TextEncoding from 'npm:text-encoding';

function detectCharsetProblem(s) {
  
  for (var i = 0, err = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if ( c === 65533 ) {
      err++;
    }
  }
  
  return err;

};

function skipBom(buf) {
  // If we have a BOM skip it
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.subarray(3);
  }
  return buf;
};

export default function(buf) {
  
  //on décode une première fois en iso8859-1
  buf = skipBom(new Uint8Array(buf));
  
  let s = new TextEncoding.TextDecoder("UTF-8").decode(buf),
      err = detectCharsetProblem(s);
  
  //et on réencode si besoin
  if (err > 0) {
    s = new TextEncoding.TextDecoder("iso8859-1").decode(buf);
  }
  
  return s;
  
}
