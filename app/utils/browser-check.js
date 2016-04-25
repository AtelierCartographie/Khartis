var userAgent = navigator && navigator.userAgent && navigator.userAgent.toLowerCase();
var vendor = navigator && navigator.vendor && navigator.vendor.toLowerCase();
var version = navigator && navigator.appVersion && navigator.appVersion.toLowerCase();

function isChrome() {
  return /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor);
}

function isFirefox() {
  return /firefox/i.test(userAgent);
}

function isEdge() {
  return /edge/i.test(userAgent);
}

function isIE(version) {

  if (!version) {
    return /msie/i.test(userAgent) || "ActiveXObject" in window;
  }
  if (version >= 11) {
    return "ActiveXObject" in window;
  }

  return new RegExp('msie ' + version).test(userAgent);

}

function isOpera() {
  return /^Opera\//.test(userAgent) || // Opera 12 and older versions
    /\x20OPR\//.test(userAgent); // Opera 15+
}

function isSafari() {
  return /safari/i.test(userAgent) && /apple computer/i.test(vendor);
}

function isIos() {
  return isIphone() || isIpad() || isIpod();
}

function isIphone() {
  return /iphone/i.test(userAgent);
}

function isIpad() {
  return /ipad/i.test(userAgent);
}

function isIpod() {
  return /ipod/i.test(userAgent);
}

function isAndroid() {
  return /android/i.test(userAgent);
}

function isEverGreen(){
  /* Check version on safari and opera ? */
  return isChrome() || isFirefox() || isIE(11) || isEdge() || isOpera() || isSafari()
}

export {
  isChrome,
  isFirefox,
  isEdge,
  isIE,
  isOpera,
  isSafari,
  isAndroid,
  isIos,
  isIpod,
  isIpad,
  isIphone,
  isEverGreen
}