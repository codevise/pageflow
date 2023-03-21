// Replacement for Underscore's throttle, because scrolled entries
// don't have Underscore anymore

export function throttle(func, timeFrame) {
  var lastTime = 0;

  return function (options) {
    var now = new Date();
    func = func.bind(this);
    if (now - lastTime >= timeFrame) {
      func(options);
      lastTime = now;
    }
  };
}
