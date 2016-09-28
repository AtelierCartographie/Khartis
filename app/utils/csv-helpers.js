let csvHeaderToJs = function(str) {
  str = str.replace(/^\./, "")
    .replace(/[\.\s\-]/g, "_");
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export {csvHeaderToJs};
