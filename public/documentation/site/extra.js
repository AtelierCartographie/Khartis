/* Replacement des urls et des target pour
   gérer les problèmes de crossdomain 
   et d'index.html manquants pour electron */
window.onload = function() {
  _processLinks();
  var obs = new MutationObserver(_processLinks);
  obs.observe(document.body, {childList: true, subtree: true});
}

function _processLinks() {
  let links = document.querySelectorAll('a[href]');
  links = Array.prototype.slice.call(links);
  links.forEach(function(l) {
    let href = l.getAttribute("href");
    if (/^https?/.test(href)) {
      l.setAttribute("target", "_blank") 
    } else {
      _apendIndexHtml(l, href);
    }
  });
}

function _apendIndexHtml(link, href) {
  var hParts = href.split('#'),
      fragment = "";
  if (hParts.length > 1) {
    href = hParts.slice(0, hParts.length-1).join('#');
    fragment = "#"+hParts.slice(hParts.length-1);
  }
  if (href.length && !/\.\w{3,4}$/.test(href)) {
    var endsWithSlash = /\/$/.test(href);
    link.setAttribute('href',  href + (endsWithSlash ? "" : "/") + "index.html" + fragment);
  }
}