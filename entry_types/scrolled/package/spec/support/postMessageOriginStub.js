// jsdom leaves the origin of messages empty. Browsers set it to the
// origin of the sending window, which same origin checks rely on.
window.postMessage = function(data, targetOrigin) {
  if (targetOrigin !== '*' && targetOrigin !== window.location.origin) {
    return;
  }

  setTimeout(() => {
    window.dispatchEvent(new MessageEvent('message', {
      data,
      origin: window.location.origin
    }));
  }, 0);
};
