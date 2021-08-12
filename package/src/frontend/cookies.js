//  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
export const cookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    // eslint-disable-next-line no-useless-escape
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },

  setItem(...args) {
    document.cookie = setItemCookieString(...args);
    return true;
  },

  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    // eslint-disable-next-line no-useless-escape
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    // eslint-disable-next-line no-useless-escape
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

export function setItemCookieString(key, value, expiresOrOptions, path, domain, secure) {
  if (expiresOrOptions &&
      typeof expiresOrOptions === 'object' &&
      expiresOrOptions.constructor !== Date) {
    return setItemCookieStringFromOptions(key, value, expiresOrOptions);
  }
  else {
    return setItemCookieStringFromOptions(key, value, {
      expires: expiresOrOptions,
      path,
      domain,
      secure
    });
  }
}

function setItemCookieStringFromOptions(key, value, {expires, path, domain, secure, sameSite}) {
  let expiresPart = "";

  if (expires) {
    switch (expires.constructor) {
      case Number:
        expiresPart = expires === Infinity ?
                      "; expires=Fri, 31 Dec 9999 23:59:59 GMT" :
                      "; max-age=" + expires;
        break;
      case String:
        expiresPart = "; expires=" + expires;
        break;
      case Date:
        expiresPart = "; expires=" + expires.toUTCString();
        break;
    }
  }

  return encodeURIComponent(key) + "=" + encodeURIComponent(value) +
         expiresPart +
         (domain ? "; domain=" + domain : "") +
         (path ? "; path=" + path : "") +
         (secure ? "; Secure" : "");
}
