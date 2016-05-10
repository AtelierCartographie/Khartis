const CHAR_DEG = "\u00B0",
      CHAR_MIN = "\u0027",
      CHAR_SEC = "\u0022";
      
let decode = function(value) {
    var pattern = "";

    // deg
    pattern += "(-?\\d+)";
    pattern += CHAR_DEG;
    pattern += "\\s*";

    // min
    pattern += "(\\d+)";
    pattern += CHAR_MIN;
    pattern += "\\s*";

    // sec
    pattern += "(\\d+\\.\\d+)";
    pattern += `(?:${CHAR_SEC}|${CHAR_MIN+CHAR_MIN})`;
    
    //direction
    pattern += "(N|S|E|W)?";

    return value.match(new RegExp(pattern));
};

export default function(value) {

    var matches = decode(value);

    if (!matches) {
        return NaN;
    }

    var deg = parseFloat(matches[1]);
    var min = parseFloat(matches[2]);
    var sec = parseFloat(matches[3]);
    var direction = matches.length === 5 ? matches[4] : null;
    
    if (isNaN(deg) || isNaN(min) || isNaN(sec)) {
        return NaN;
    }
    
    let d = (direction === "S" || direction === "W") ? -1 : 1;

    console.log((deg + (min / 60.0) + (sec / 3600))*d);

    return (deg + (min / 60.0) + (sec / 3600))*d;
}
