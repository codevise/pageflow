import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classnames = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
});

var images = {
  lightPattern: {
    id: "lightPattern",
    width: 1920,
    height: 1279,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  darkPattern: {
    id: "darkPattern",
    width: 1920,
    height: 1279,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  wasser: {
    id: "wasser",
    width: 1920,
    height: 1280,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  boot: {
    id: "boot",
    width: 1920,
    height: 1279,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  schildkroete: {
    id: "schildkroete",
    width: 1920,
    height: 1440,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    focusX: 24,
    focusY: 40
  },
  strand: {
    id: "strand",
    width: 2500,
    height: 1000,
    motiveArea: {
      top: 0,
      left: 0,
      width: 100,
      height: 30
    }
  },
  strandDrohne: {
    id: "strandDrohne",
    width: 1920,
    height: 2560,
    motiveArea: {
      top: 0,
      left: 0,
      width: 100,
      height: 20
    }
  },
  strandTouristen: {
    id: "strandTouristen",
    width: 2121,
    height: 2651,
    motiveArea: {
      top: 0,
      left: 0,
      width: 100,
      height: 60
    }
  },
  brandung: {
    id: "brandung",
    width: 1920,
    height: 1536,
    motiveArea: {
      top: 45,
      left: 0,
      width: 50,
      height: 45
    }
  },
  fisch: {
    id: "fisch",
    width: 1920,
    height: 1280,
    motiveArea: {
      top: 20,
      left: 30,
      width: 35,
      height: 70
    },
    focusX: 45,
    focusY: 50
  },
  turm: {
    id: "turm",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 4,
      left: 63,
      width: 25,
      height: 50
    },
    focusX: 80,
    focusY: 0
  },
  wegweiser: {
    id: "wegweiser",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 27,
      left: 17,
      width: 25,
      height: 45
    },
    focusX: 19,
    focusY: 0
  },
  werkzeuge: {
    id: "werkzeuge",
    width: 1920,
    height: 1081,
    motiveArea: {
      top: 0,
      left: -10,
      width: 0,
      height: 0
    },
    focusX: 0,
    focusY: 50
  },
  wanderromantik: {
    id: "wanderromantik",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 7,
      left: 15,
      width: 40,
      height: 50
    },
    focusX: 30,
    focusY: 0
  },
  wandervoegel: {
    id: "wandervoegel",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 20,
      left: 0,
      width: 60,
      height: 50
    },
    focusX: 10,
    focusY: 50
  },
  person: {
    id: "person",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 15,
      left: 48,
      width: 35,
      height: 63
    },
    focusX: 73,
    focusY: 0
  },
  haldernChurch1: {
    id: "haldernChurch1",
    width: 4752,
    height: 3168,
    motiveArea: {
      top: 0,
      left: 30,
      width: 40,
      height: 100
    },
    focusX: 50,
    focusY: 50
  },
  haldernChurch2: {
    id: "haldernChurch2",
    width: 4752,
    height: 3168,
    motiveArea: {
      top: 0,
      left: 30,
      width: 40,
      height: 100
    },
    focusX: 50,
    focusY: 50
  },
  chernobylBefore: {
    id: "chernobylBefore",
    width: 689,
    height: 623,
    motiveArea: {
      top: 30,
      left: 30,
      width: 40,
      height: 40
    },
    focusX: 50,
    focusY: 50
  },
  chernobylAfter: {
    id: "chernobylAfter",
    width: 689,
    height: 623,
    motiveArea: {
      top: 30,
      left: 30,
      width: 40,
      height: 40
    },
    focusX: 50,
    focusY: 50
  },
  aleppoBefore: {
    id: "aleppoBefore",
    width: 731,
    height: 385,
    motiveArea: {
      top: 0,
      left: 30,
      width: 35,
      height: 100
    },
    focusX: 50,
    focusY: 50
  },
  aleppoAfter: {
    id: "aleppoAfter",
    width: 731,
    height: 385,
    motiveArea: {
      top: 0,
      left: 30,
      width: 35,
      height: 100
    },
    focusX: 50,
    focusY: 50
  },
  xray1: {
    id: "xray1",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: 20,
      width: 50,
      height: 70
    },
    focusX: 35,
    focusY: 35
  },
  xray2: {
    id: "xray2",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: 20,
      width: 50,
      height: 70
    },
    focusX: 35,
    focusY: 35
  },
  xray3: {
    id: "xray3",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: 20,
      width: 50,
      height: 70
    },
    focusX: 35,
    focusY: 35
  },
  xray1Stripe: {
    id: "xray1Stripe",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: -10,
      width: 0,
      height: 0
    },
    focusX: 35,
    focusY: 35
  },
  xray2Stripe: {
    id: "xray2Stripe",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: -10,
      width: 0,
      height: 0
    },
    focusX: 35,
    focusY: 35
  },
  xray3Stripe: {
    id: "xray3Stripe",
    width: 798,
    height: 772,
    motiveArea: {
      top: 0,
      left: -10,
      width: 0,
      height: 0
    },
    focusX: 35,
    focusY: 35
  },
  braunkohleBackground1: {
    id: "braunkohleBackground1",
    width: 3694,
    height: 2078,
    motiveArea: {
      top: 0,
      left: 0,
      width: 50,
      height: 60
    },
    focusX: 25,
    focusY: 25
  },
  braunkohleInline1: {
    id: "braunkohleInline1",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleInline2: {
    id: "braunkohleInline2",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleInline3: {
    id: "braunkohleInline3",
    width: 1920,
    height: 1439,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleInline4: {
    id: "braunkohleInline4",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleInline5: {
    id: "braunkohleInline4",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleBackground2: {
    id: "braunkohleBackground2",
    width: 3840,
    height: 2878,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleSticky1: {
    id: "braunkohleSticky1",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleSticky2: {
    id: "braunkohleSticky2",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleSticky3: {
    id: "braunkohleSticky3",
    width: 1920,
    height: 1439,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  braunkohleBaggerSelfie: {
    id: "braunkohleBaggerSelfie",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 35,
      height: 65
    },
    focusX: 0,
    focusY: 25
  },
  presentationScrollmation1Desktop: {
    id: "presentationScrollmation1Desktop",
    width: 3000,
    height: 2000,
    motiveArea: {
      top: 10,
      left: 25,
      width: 50,
      height: 80
    }
  },
  presentationScrollmation2Desktop: {
    id: "presentationScrollmation2Desktop",
    width: 3000,
    height: 2000,
    motiveArea: {
      top: 10,
      left: 25,
      width: 50,
      height: 80
    }
  },
  presentationScrollmation3Desktop: {
    id: "presentationScrollmation3Desktop",
    width: 3000,
    height: 2000,
    motiveArea: {
      top: 10,
      left: 25,
      width: 50,
      height: 80
    }
  },
  presentationScrollmation1Mobile: {
    id: "presentationScrollmation1Mobile",
    width: 1080,
    height: 1920,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  presentationScrollmation2Mobile: {
    id: "presentationScrollmation2Mobile",
    width: 1080,
    height: 1920,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  presentationScrollmation3Mobile: {
    id: "presentationScrollmation3Mobile",
    width: 1080,
    height: 1920,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  presentationFeedbackBg: {
    id: "presentationFeedbackBg",
    width: 1920,
    height: 1200,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  }
};

function useOnScreen(ref) {
  var rootMargin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0px';
  var cb = arguments.length > 2 ? arguments[2] : undefined;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isIntersecting = _useState2[0],
      setIntersecting = _useState2[1];

  useEffect(function () {
    var current = ref.current;
    var observer = new IntersectionObserver(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          entry = _ref2[0];

      setIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && cb) {
        cb();
      }
    }, {
      rootMargin: rootMargin
    });

    if (ref.current) {
      observer.observe(current);
    }

    return function () {
      observer.unobserve(current);
    };
  }, [ref, rootMargin, cb]);
  return isIntersecting;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".Fullscreen-module_root__1N3CI {\n  width: 100%;\n  height: 100vh;\n  position: relative;\n  overflow: hidden;\n}\n";
var styles = {"root":"Fullscreen-module_root__1N3CI"};
styleInject(css);

var Fullscreen = React.forwardRef(function Fullscreen(props, ref) {
  return React.createElement("div", {
    ref: ref,
    className: styles.root
  }, props.children);
});

var css$1 = ".Image-module_root__1ef3j {\n  background-size: cover;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n\n@media (orientation: landscape) {\n  .Image-module_portrait__1mRha {\n    display: none;\n  }\n}\n\n@media (orientation: portrait) {\n  .Image-module_portrait__1mRha {\n    display: block;\n  }\n}";
var styles$1 = {"root":"Image-module_root__1ef3j","portrait":"Image-module_portrait__1mRha"};
styleInject(css$1);

function Image(props) {
  var awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-images/';
  var wasser = awsBucket + 'wasser.jpg';
  var fisch = awsBucket + 'fisch.jpg';
  var schildkroete = awsBucket + 'schildkroete.jpg';
  var boot = awsBucket + 'boot.jpg';
  var darkPattern = awsBucket + 'darkPattern.jpg';
  var lightPattern = awsBucket + 'lightPattern.jpg';
  var turm = awsBucket + 'turm.jpg';
  var wegweiser = awsBucket + 'wegweiser.jpg';
  var wanderromantik = awsBucket + 'wanderromantik.jpg';
  var wandervoegel = awsBucket + 'wandervoegel.jpg';
  var werkzeuge = awsBucket + 'werkzeuge.jpg';
  var schleifstein = awsBucket + 'schleifstein.jpg';
  var person = awsBucket + 'person.jpg';
  var tool1 = awsBucket + 'tool1.jpg';
  var tool2 = awsBucket + 'tool2.jpg';
  var tool3 = awsBucket + 'tool3.jpg';
  var brandung = awsBucket + 'brandung.jpg';
  var strand = awsBucket + 'strand.jpg';
  var strandDrohne = awsBucket + 'strandDrohne.jpg';
  var strandTouristen = awsBucket + 'strandTouristen.jpg';
  var braunkohleBackground1 = awsBucket + 'braunkohle/hintergrund1.jpeg';
  var braunkohleBackground2 = awsBucket + 'braunkohle/hintergrund2.jpeg';
  var braunkohleInline1 = awsBucket + 'braunkohle/inline1.jpeg';
  var braunkohleInline2 = awsBucket + 'braunkohle/inline2.jpeg';
  var braunkohleInline3 = awsBucket + 'braunkohle/inline3.jpeg';
  var braunkohleInline4 = awsBucket + 'braunkohle/inline1.jpeg';
  var braunkohleInline5 = awsBucket + 'braunkohle/inline3.jpeg';
  var braunkohleSticky1 = awsBucket + 'braunkohle/sticky1.jpeg';
  var braunkohleSticky2 = awsBucket + 'braunkohle/sticky2.jpeg';
  var braunkohleSticky3 = awsBucket + 'braunkohle/sticky3.jpeg';
  var braunkohleBaggerSelfie = awsBucket + 'braunkohle/baggerselfie.jpg';
  /* before/after example images */

  var haldernChurch1 = awsBucket + 'before_after/haldern_church1.jpg';
  var haldernChurch2 = awsBucket + 'before_after/haldern_church2.jpg';
  var chernobylBefore = awsBucket + 'before_after/chernobyl_before.png';
  var chernobylAfter = awsBucket + 'before_after/chernobyl_after.png';
  var aleppoBefore = awsBucket + 'before_after/aleppo_before.jpg';
  var aleppoAfter = awsBucket + 'before_after/aleppo_after.jpg';
  /* x-ray example images */

  var xray1 = awsBucket + 'x_ray/1.jpg';
  var xray2 = awsBucket + 'x_ray/2.jpg';
  var xray3 = awsBucket + 'x_ray/3.jpg';
  var xray1Stripe = awsBucket + 'x_ray/1.jpg';
  var xray2Stripe = awsBucket + 'x_ray/2.jpg';
  var xray3Stripe = awsBucket + 'x_ray/3.jpg';
  var presentationScrollmation1Desktop = awsBucket + 'scrollmation/desktop/1.jpg';
  var presentationScrollmation2Desktop = awsBucket + 'scrollmation/desktop/2.jpg';
  var presentationScrollmation3Desktop = awsBucket + 'scrollmation/desktop/3.jpg';
  var presentationScrollmation1Mobile = awsBucket + 'scrollmation/mobile/1.jpg';
  var presentationScrollmation2Mobile = awsBucket + 'scrollmation/mobile/2.jpg';
  var presentationScrollmation3Mobile = awsBucket + 'scrollmation/mobile/3.jpg';
  var presentationFeedbackBg = awsBucket + 'beton-mauer_fragezeichen.jpg';
  var imageUrl = {
    wasser: wasser,
    fisch: fisch,
    schildkroete: schildkroete,
    boot: boot,
    brandung: brandung,
    strand: strand,
    strandDrohne: strandDrohne,
    strandTouristen: strandTouristen,
    darkPattern: darkPattern,
    lightPattern: lightPattern,
    turm: turm,
    wegweiser: wegweiser,
    wanderromantik: wanderromantik,
    wandervoegel: wandervoegel,
    werkzeuge: werkzeuge,
    schleifstein: schleifstein,
    person: person,
    tool1: tool1,
    tool2: tool2,
    tool3: tool3,
    haldernChurch1: haldernChurch1,
    haldernChurch2: haldernChurch2,
    chernobylBefore: chernobylBefore,
    chernobylAfter: chernobylAfter,
    aleppoBefore: aleppoBefore,
    aleppoAfter: aleppoAfter,
    xray1: xray1,
    xray2: xray2,
    xray3: xray3,
    xray1Stripe: xray1Stripe,
    xray2Stripe: xray2Stripe,
    xray3Stripe: xray3Stripe,
    braunkohleBackground1: braunkohleBackground1,
    braunkohleInline1: braunkohleInline1,
    braunkohleInline2: braunkohleInline2,
    braunkohleInline3: braunkohleInline3,
    braunkohleInline4: braunkohleInline4,
    braunkohleInline5: braunkohleInline5,
    braunkohleBackground2: braunkohleBackground2,
    braunkohleSticky1: braunkohleSticky1,
    braunkohleSticky2: braunkohleSticky2,
    braunkohleSticky3: braunkohleSticky3,
    braunkohleBaggerSelfie: braunkohleBaggerSelfie,
    presentationScrollmation1Desktop: presentationScrollmation1Desktop,
    presentationScrollmation2Desktop: presentationScrollmation2Desktop,
    presentationScrollmation3Desktop: presentationScrollmation3Desktop,
    presentationScrollmation1Mobile: presentationScrollmation1Mobile,
    presentationScrollmation2Mobile: presentationScrollmation2Mobile,
    presentationScrollmation3Mobile: presentationScrollmation3Mobile,
    presentationFeedbackBg: presentationFeedbackBg
  }[props.id];
  return React.createElement("div", {
    className: classnames(styles$1.root, _defineProperty({}, styles$1.portrait, props.id.indexOf('Mobile') >= 0)),
    style: {
      backgroundImage: "url(".concat(imageUrl, ")"),
      backgroundPosition: "".concat(props.focusX, "% ").concat(props.focusY, "%")
    }
  });
}
Image.defaultProps = {
  focusX: 50,
  focusY: 50
};

var ScrollToSceneContext = React.createContext();

var MutedContext = React.createContext();

var css$2 = ".Video-module_root__30u0y {\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.Video-module_video__3FJvj {\n  width: 100%;\n  height: 100%;\n  transition: transform ease 0.2s;\n  outline: none;\n}\n\n.Video-module_video__3FJvj:focus {\n  outline: none;\n}\n\n.Video-module_backdrop__1R7f4 {\n  object-fit: cover;\n}\n";
var styles$2 = {"root":"Video-module_root__30u0y","video":"Video-module_video__3FJvj","backdrop":"Video-module_backdrop__1R7f4"};
styleInject(css$2);

function Video(props) {
  var awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-videos/';
  var videoBoatSunset = awsBucket + 'floodplain-clean.mp4';
  var poster_videoBoatSunset = awsBucket + 'posterframes/poster_katerchen.jpeg';
  var videoBoatDark = awsBucket + 'floodplain-dirty.mp4';
  var poster_videoBoatDark = awsBucket + 'posterframes/poster_katerchen.jpeg';
  var videoKaterchen = awsBucket + 'katerchen.mp4';
  var poster_videoKaterchen = awsBucket + 'posterframes/poster_katerchen.jpeg';
  var videoGarzweilerLoop1 = awsBucket + 'braunkohle_loop1.mp4';
  var poster_videoGarzweilerLoop1 = awsBucket + 'posterframes/poster_braunkohle_loop1.jpeg';
  var videoGarzweilerLoop2 = awsBucket + 'braunkohle_loop2.mp4';
  var poster_videoGarzweilerLoop2 = awsBucket + 'posterframes/poster_braunkohle_loop2.jpeg';
  var videoGarzweilerDrohne = awsBucket + 'braunkohle_drone.mp4';
  var poster_videoGarzweilerDrohne = awsBucket + 'posterframes/poster_braunkohle_drone.jpeg';
  var videoInselInterviewToni = awsBucket + 'pageflow_insel_interview_toni02.mp4';
  var poster_videoInselInterviewToni = awsBucket + 'posterframes/poster_pageflow_insel_interview_toni02.jpg';
  var videoUrl = {
    videoBoatSunset: videoBoatSunset,
    videoBoatDark: videoBoatDark,
    videoKaterchen: videoKaterchen,
    videoGarzweilerLoop1: videoGarzweilerLoop1,
    videoGarzweilerLoop2: videoGarzweilerLoop2,
    videoGarzweilerDrohne: videoGarzweilerDrohne,
    videoInselInterviewToni: videoInselInterviewToni
  }[props.id];
  var posterUrl = {
    poster_videoBoatSunset: poster_videoBoatSunset,
    poster_videoBoatDark: poster_videoBoatDark,
    poster_videoKaterchen: poster_videoKaterchen,
    poster_videoGarzweilerLoop1: poster_videoGarzweilerLoop1,
    poster_videoGarzweilerLoop2: poster_videoGarzweilerLoop2,
    poster_videoGarzweilerDrohne: poster_videoGarzweilerDrohne,
    poster_videoInselInterviewToni: poster_videoInselInterviewToni
  }['poster_' + props.id];
  var videoRef = useRef();
  var state = props.state;
  useEffect(function () {
    var video = videoRef.current;

    if (video) {
      if (state === 'active') {
        if (video.readyState > 0) {
          video.play();
        } else {
          video.addEventListener('loadedmetadata', play);
          return function () {
            return video.removeEventListener('loadedmetadata', play);
          };
        }
      } else {
        video.pause();
      }
    }

    function play() {
      video.play();
    }
  }, [state, videoRef]);
  return React.createElement("div", {
    className: styles$2.root
  }, React.createElement(MutedContext.Consumer, null, function (mutedSettings) {
    return React.createElement(ScrollToSceneContext.Consumer, null, function (scrollToScene) {
      return React.createElement("video", {
        src: videoUrl,
        ref: videoRef,
        className: classnames(styles$2.video, _defineProperty({}, styles$2.backdrop, !props.interactive)),
        controls: props.controls,
        playsInline: true,
        onEnded: function onEnded() {
          return props.nextSceneOnEnd && scrollToScene('next');
        },
        loop: !props.interactive,
        muted: mutedSettings.muted,
        poster: posterUrl
      });
    });
  }));
}
Video.defaultProps = {
  interactive: false,
  controls: false
};

var css$3 = ".FillColor-module_FillColor__S1uEG {\n  width: 100%;\n  height: 100vh;\n}\n";
var styles$3 = {"FillColor":"FillColor-module_FillColor__S1uEG"};
styleInject(css$3);

function FillColor(props) {
  return React.createElement("div", {
    className: styles$3.FillColor,
    style: {
      backgroundColor: props.color
    }
  });
}

var css$4 = ".MotifArea-module_root__1_ACd {\n  position: absolute;\n  background: hsla(0, 0%, 100%, 0.2);\n  z-index: 2;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n\n.MotifArea-module_active__1q4z2 {\n  opacity: 1;\n}\n\n.MotifArea-module_corner__3hB5t {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n.MotifArea-module_topLeft__3vHHi {\n  border-top: solid 2px #fff;\n  border-left: solid 2px #fff;\n}\n\n.MotifArea-module_topRight__2gNmC {\n  right: 0;\n  border-top: solid 2px #fff;\n  border-right: solid 2px #fff;\n}\n\n.MotifArea-module_bottomLeft__2qEqb {\n  bottom: 0;\n  border-bottom: solid 2px #fff;\n  border-left: solid 2px #fff;\n}\n\n.MotifArea-module_bottomRight__3OjTb {\n  right: 0;\n  bottom: 0;\n  border-bottom: solid 2px #fff;\n  border-right: solid 2px #fff;\n}\n";
var styles$4 = {"root":"MotifArea-module_root__1_ACd","active":"MotifArea-module_active__1q4z2","corner":"MotifArea-module_corner__3hB5t","topLeft":"MotifArea-module_topLeft__3vHHi MotifArea-module_corner__3hB5t","topRight":"MotifArea-module_topRight__2gNmC MotifArea-module_corner__3hB5t","bottomLeft":"MotifArea-module_bottomLeft__2qEqb MotifArea-module_corner__3hB5t","bottomRight":"MotifArea-module_bottomRight__3OjTb MotifArea-module_corner__3hB5t"};
styleInject(css$4);

var MotifArea = React.forwardRef(function MotifArea(props, ref) {
  return React.createElement("div", {
    ref: ref,
    className: classnames(styles$4.root, _defineProperty({}, styles$4.active, props.active)),
    style: position(props),
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave
  }, React.createElement("div", {
    className: styles$4.topLeft
  }), React.createElement("div", {
    className: styles$4.topRight
  }), React.createElement("div", {
    className: styles$4.bottomLeft
  }), React.createElement("div", {
    className: styles$4.bottomRight
  }));
});

function position(props) {
  var image = props.image;
  var originalRatio = image.width / image.height;
  var containerRatio = props.containerWidth / props.containerHeight;
  var scale = containerRatio > originalRatio ? props.containerWidth / image.width : props.containerHeight / image.height;
  var contentWidth = image.width * scale;
  var contentHeight = image.height * scale;
  var focusX = image.focusX === undefined ? 50 : image.focusX;
  var focusY = image.focusY === undefined ? 50 : image.focusY;
  var cropLeft = (contentWidth - props.containerWidth) * focusX / 100;
  var cropTop = (contentHeight - props.containerHeight) * focusY / 100;
  return {
    top: contentHeight * image.motiveArea.top / 100 - cropTop,
    left: contentWidth * image.motiveArea.left / 100 - cropLeft,
    width: contentWidth * image.motiveArea.width / 100,
    height: contentHeight * image.motiveArea.height / 100
  };
}

function getSize(el) {
  if (!el) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
  }

  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight
  };
}

function useDimension(ref) {
  var _useState = useState(getSize(ref && ref.current)),
      _useState2 = _slicedToArray(_useState, 2),
      componentSize = _useState2[0],
      setComponentSize = _useState2[1];

  useLayoutEffect(function () {
    var node = ref.current;

    function handleResize() {
      if (node) {
        setComponentSize(getSize(node));
      }
    }

    if (!node) {
      return;
    }

    setTimeout(handleResize, 0);
    window.addEventListener('resize', handleResize);
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);
  return componentSize;
}

var videos = {
  videoBoatSunset: {
    id: "videoBoatSunset",
    width: 960,
    height: 406,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    focusX: 50,
    focusY: 50
  },
  videoBoatDark: {
    id: "videoBoatDark",
    width: 960,
    height: 406,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    focusX: 50,
    focusY: 50
  },
  videoKaterchen: {
    id: "videoKaterchen",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    focusX: 50,
    focusY: 50
  },
  videoGarzweilerLoop1: {
    id: "videoGarzweilerLoop1",
    width: 3840,
    height: 2160,
    motiveArea: {
      top: 0,
      left: 0,
      width: 1,
      height: 1
    },
    focusX: 50,
    focusY: 50
  },
  videoGarzweilerLoop2: {
    id: "videoGarzweilerLoop2",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 1,
      height: 1
    },
    focusX: 15,
    focusY: 20
  },
  videoGarzweilerDrohne: {
    id: "videoGarzweilerDrohne",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  videoInselInterviewToni: {
    id: "videoInselInterviewToni",
    width: 1920,
    height: 1080,
    motiveArea: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  }
};

var ResizeSensor = createCommonjsModule(function (module, exports) {
// Copyright (c) 2013 Marc J. Schmidt
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// Originally based on version 1.2.1,
// https://github.com/marcj/css-element-queries/tree/1.2.1
// Some lines removed for compatibility.
(function (root, factory) {
  {
    module.exports = factory();
  }
})(typeof window !== 'undefined' ? window : commonjsGlobal, function () {
  // Make sure it does not throw in a SSR (Server Side Rendering) situation
  if (typeof window === "undefined") {
    return null;
  } // https://github.com/Semantic-Org/Semantic-UI/issues/3855
  // https://github.com/marcj/css-element-queries/issues/257


  var globalWindow = window; // Only used for the dirty checking, so the event callback count is limited to max 1 call per fps per sensor.
  // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
  // would generate too many unnecessary events.

  var requestAnimationFrame = globalWindow.requestAnimationFrame || globalWindow.mozRequestAnimationFrame || globalWindow.webkitRequestAnimationFrame || function (fn) {
    return globalWindow.setTimeout(fn, 20);
  };
  /**
   * Iterate over each of the provided element(s).
   *
   * @param {HTMLElement|HTMLElement[]} elements
   * @param {Function}                  callback
   */


  function forEachElement(elements, callback) {
    var elementsType = Object.prototype.toString.call(elements);
    var isCollectionTyped = '[object Array]' === elementsType || '[object NodeList]' === elementsType || '[object HTMLCollection]' === elementsType || '[object Object]' === elementsType;
    var i = 0,
        j = elements.length;

    if (isCollectionTyped) {
      for (; i < j; i++) {
        callback(elements[i]);
      }
    } else {
      callback(elements);
    }
  }
  /**
  * Get element size
  * @param {HTMLElement} element
  * @returns {Object} {width, height}
  */


  function getElementSize(element) {
    if (!element.getBoundingClientRect) {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    }

    var rect = element.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }
  /**
   * Apply CSS styles to element.
   *
   * @param {HTMLElement} element
   * @param {Object} style
   */


  function setStyle(element, style) {
    Object.keys(style).forEach(function (key) {
      element.style[key] = style[key];
    });
  }
  /**
   * Class for dimension change detection.
   *
   * @param {Element|Element[]|Elements|jQuery} element
   * @param {Function} callback
   *
   * @constructor
   */


  var ResizeSensor = function ResizeSensor(element, callback) {
    /**
     *
     * @constructor
     */
    function EventQueue() {
      var q = [];

      this.add = function (ev) {
        q.push(ev);
      };

      var i, j;

      this.call = function (sizeInfo) {
        for (i = 0, j = q.length; i < j; i++) {
          q[i].call(this, sizeInfo);
        }
      };

      this.remove = function (ev) {
        var newQueue = [];

        for (i = 0, j = q.length; i < j; i++) {
          if (q[i] !== ev) newQueue.push(q[i]);
        }

        q = newQueue;
      };

      this.length = function () {
        return q.length;
      };
    }
    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */


    function attachResizeEvent(element, resized) {
      if (!element) return;

      if (element.resizedAttached) {
        element.resizedAttached.add(resized);
        return;
      }

      element.resizedAttached = new EventQueue();
      element.resizedAttached.add(resized);
      element.resizeSensor = document.createElement('div');
      element.resizeSensor.dir = 'ltr';
      element.resizeSensor.className = 'resize-sensor';
      var style = {
        pointerEvents: 'none',
        position: 'absolute',
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
        overflow: 'hidden',
        zIndex: '-1',
        visibility: 'hidden',
        maxWidth: '100%'
      };
      var styleChild = {
        position: 'absolute',
        left: '0px',
        top: '0px',
        transition: '0s'
      };
      setStyle(element.resizeSensor, style);
      var expand = document.createElement('div');
      expand.className = 'resize-sensor-expand';
      setStyle(expand, style);
      var expandChild = document.createElement('div');
      setStyle(expandChild, styleChild);
      expand.appendChild(expandChild);
      var shrink = document.createElement('div');
      shrink.className = 'resize-sensor-shrink';
      setStyle(shrink, style);
      var shrinkChild = document.createElement('div');
      setStyle(shrinkChild, styleChild);
      setStyle(shrinkChild, {
        width: '200%',
        height: '200%'
      });
      shrink.appendChild(shrinkChild);
      element.resizeSensor.appendChild(expand);
      element.resizeSensor.appendChild(shrink);
      element.appendChild(element.resizeSensor);
      var computedStyle = window.getComputedStyle(element);
      var position = computedStyle ? computedStyle.getPropertyValue('position') : null;

      if ('absolute' !== position && 'relative' !== position && 'fixed' !== position) {
        element.style.position = 'relative';
      }

      var dirty, rafId;
      var size = getElementSize(element);
      var lastWidth = 0;
      var lastHeight = 0;
      var initialHiddenCheck = true;
      var lastAnimationFrame = 0;

      var resetExpandShrink = function resetExpandShrink() {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        expandChild.style.width = width + 10 + 'px';
        expandChild.style.height = height + 10 + 'px';
        expand.scrollLeft = width + 10;
        expand.scrollTop = height + 10;
        shrink.scrollLeft = width + 10;
        shrink.scrollTop = height + 10;
      };

      var reset = function reset() {
        // Check if element is hidden
        if (initialHiddenCheck) {
          var invisible = element.offsetWidth === 0 && element.offsetHeight === 0;

          if (invisible) {
            // Check in next frame
            if (!lastAnimationFrame) {
              lastAnimationFrame = requestAnimationFrame(function () {
                lastAnimationFrame = 0;
                reset();
              });
            }

            return;
          } else {
            // Stop checking
            initialHiddenCheck = false;
          }
        }

        resetExpandShrink();
      };

      element.resizeSensor.resetSensor = reset;

      var onResized = function onResized() {
        rafId = 0;
        if (!dirty) return;
        lastWidth = size.width;
        lastHeight = size.height;

        if (element.resizedAttached) {
          element.resizedAttached.call(size);
        }
      };

      var onScroll = function onScroll() {
        size = getElementSize(element);
        dirty = size.width !== lastWidth || size.height !== lastHeight;

        if (dirty && !rafId) {
          rafId = requestAnimationFrame(onResized);
        }

        reset();
      };

      var addEvent = function addEvent(el, name, cb) {
        if (el.attachEvent) {
          el.attachEvent('on' + name, cb);
        } else {
          el.addEventListener(name, cb);
        }
      };

      addEvent(expand, 'scroll', onScroll);
      addEvent(shrink, 'scroll', onScroll); // Fix for custom Elements

      requestAnimationFrame(reset);
    }

    forEachElement(element, function (elem) {
      attachResizeEvent(elem, callback);
    });

    this.detach = function (ev) {
      ResizeSensor.detach(element, ev);
    };

    this.reset = function () {
      element.resizeSensor.resetSensor();
    };
  };

  ResizeSensor.reset = function (element) {
    forEachElement(element, function (elem) {
      elem.resizeSensor.resetSensor();
    });
  };

  ResizeSensor.detach = function (element, ev) {
    forEachElement(element, function (elem) {
      if (!elem) return;

      if (elem.resizedAttached && typeof ev === "function") {
        elem.resizedAttached.remove(ev);
        if (elem.resizedAttached.length()) return;
      }

      if (elem.resizeSensor) {
        if (elem.contains(elem.resizeSensor)) {
          elem.removeChild(elem.resizeSensor);
        }

        delete elem.resizeSensor;
        delete elem.resizedAttached;
      }
    });
  };

  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      for (var i in mutations) {
        if (mutations.hasOwnProperty(i)) {
          var items = mutations[i].addedNodes;

          for (var j = 0; j < items.length; j++) {
            if (items[j].resizeSensor) {
              ResizeSensor.reset(items[j]);
            }
          }
        }
      }
    });
    document.addEventListener("DOMContentLoaded", function (event) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  return ResizeSensor;
});
});

var cssElementQueries = {
  ResizeSensor: ResizeSensor
};
var cssElementQueries_1 = cssElementQueries.ResizeSensor;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var defaultProps = {
  handleSize: 40,
  handle: null,
  hover: false,
  leftImageAlt: '',
  leftImageCss: {},
  leftImageLabel: null,
  onSliderPositionChange: function onSliderPositionChange() {},
  rightImageAlt: '',
  rightImageCss: {},
  rightImageLabel: null,
  skeleton: null,
  sliderLineColor: '#ffffff',
  sliderLineWidth: 2,
  sliderPositionPercentage: 0.5
};

function ReactCompareImage(props) {
  var handleSize = props.handleSize,
      handle = props.handle,
      hover = props.hover,
      leftImage = props.leftImage,
      leftImageAlt = props.leftImageAlt,
      leftImageCss = props.leftImageCss,
      leftImageLabel = props.leftImageLabel,
      onSliderPositionChange = props.onSliderPositionChange,
      rightImage = props.rightImage,
      rightImageAlt = props.rightImageAlt,
      rightImageCss = props.rightImageCss,
      rightImageLabel = props.rightImageLabel,
      skeleton = props.skeleton,
      sliderLineColor = props.sliderLineColor,
      sliderLineWidth = props.sliderLineWidth,
      sliderPositionPercentage = props.sliderPositionPercentage,
      sliderPosition = props.sliderPosition,
      setSliderPosition = props.setSliderPosition,
      isSliding = props.isSliding,
      setIsSliding = props.setIsSliding,
      classicMode = props.classicMode,
      wiggle = props.wiggle;

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      containerWidth = _useState2[0],
      setContainerWidth = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      leftImgLoaded = _useState4[0],
      setLeftImgLoaded = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      rightImgLoaded = _useState6[0],
      setRightImgLoaded = _useState6[1];

  var containerRef = useRef();
  var rightImageRef = useRef();
  var leftImageRef = useRef(); // keep track container's width in local state

  useEffect(function () {
    var updateContainerWidth = function updateContainerWidth() {
      var currentContainerWidth = containerRef.current.getBoundingClientRect().width;
      setContainerWidth(currentContainerWidth);
    }; // initial execution must be done manually


    updateContainerWidth(); // update local state if container size is changed

    var containerElement = containerRef.current;
    var resizeSensor = new cssElementQueries_1(containerElement, function () {
      updateContainerWidth();
    });
    return function () {
      resizeSensor.detach(containerElement);
    };
  }, []);
  useEffect(function () {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    var alreadyDone = leftImageRef.current.complete;
    alreadyDone && setLeftImgLoaded(true);
    return function () {
      // when the left image source is changed
      setLeftImgLoaded(false);
    };
  }, [leftImage]);
  useEffect(function () {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    var alreadyDone = rightImageRef.current.complete;
    alreadyDone && setRightImgLoaded(true);
    return function () {
      // when the right image source is changed
      setRightImgLoaded(false);
    };
  }, [rightImage]);
  var allImagesLoaded = rightImgLoaded && leftImgLoaded;
  useEffect(function () {
    var handleSliding = function handleSliding(event) {
      var e = event || window.event; // Calc Cursor Position from the left edge of the viewport

      var cursorXfromViewport = e.touches ? e.touches[0].pageX : e.pageX; // Calc Cursor Position from the left edge of the window (consider any page scrolling)

      var cursorXfromWindow = cursorXfromViewport - window.pageXOffset; // Calc Cursor Position from the left edge of the image

      var imagePosition = rightImageRef.current.getBoundingClientRect();
      var pos = cursorXfromWindow - imagePosition.left; // Set minimum and maximum values to prevent the slider from overflowing

      var minPos = 0 + sliderLineWidth / 2;
      var maxPos = containerWidth - sliderLineWidth / 2;
      if (pos < minPos) pos = minPos;
      if (pos > maxPos) pos = maxPos;
      setSliderPosition(pos / containerWidth); // If there's a callback function, invoke it everytime the slider changes

      if (onSliderPositionChange) {
        onSliderPositionChange(pos / containerWidth);
      }
    };

    var startSliding = function startSliding(e) {
      setIsSliding(true); // Prevent default behavior other than mobile scrolling

      if (!('touches' in e)) {
        e.preventDefault();
      } // Slide the image even if you just click or tap (not drag)


      handleSliding(e);
      window.addEventListener('mousemove', handleSliding); // 07

      window.addEventListener('touchmove', handleSliding); // 08
    };

    var finishSliding = function finishSliding() {
      setIsSliding(false);
      window.removeEventListener('mousemove', handleSliding);
      window.removeEventListener('touchmove', handleSliding);
    };

    var containerElement = containerRef.current;

    if (allImagesLoaded) {
      if (classicMode) {
        // it's necessary to reset event handlers each time the canvasWidth changes
        // for mobile
        containerElement.addEventListener('touchstart', startSliding); // 01

        window.addEventListener('touchend', finishSliding); // 02
        // for desktop

        if (hover) {
          containerElement.addEventListener('mousemove', handleSliding); // 03

          containerElement.addEventListener('mouseleave', finishSliding); // 04
        } else {
          containerElement.addEventListener('mousedown', startSliding); // 05

          window.addEventListener('mouseup', finishSliding); // 06
        }
      }
    }

    return function () {
      if (classicMode) {
        // cleanup all event resteners
        containerElement.removeEventListener('touchstart', startSliding); // 01

        window.removeEventListener('touchend', finishSliding); // 02

        containerElement.removeEventListener('mousemove', handleSliding); // 03

        containerElement.removeEventListener('mouseleave', finishSliding); // 04

        containerElement.removeEventListener('mousedown', startSliding); // 05

        window.removeEventListener('mouseup', finishSliding); // 06

        window.removeEventListener('mousemove', handleSliding); // 07

        window.removeEventListener('touchmove', handleSliding); // 08
      }
    };
  }, [allImagesLoaded, containerWidth, hover, sliderLineWidth]); // eslint-disable-line
  // Image size set as follows.
  //
  // 1. right(under) image:
  //     width  = 100% of container width
  //     height = auto
  //
  // 2. left(over) imaze:
  //     width  = 100% of container width
  //     height = right image's height
  //              (protrudes is hidden by css 'object-fit: hidden')

  var styles = {
    container: {
      boxSizing: 'border-box',
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    },
    rightImage: _objectSpread({
      display: 'block',
      height: 'auto',
      // Respect the aspect ratio
      width: '100%'
    }, rightImageCss),
    leftImage: _objectSpread({
      clip: "rect(auto, ".concat(containerWidth * sliderPosition, "px, auto, auto)"),
      display: 'block',
      height: '100%',
      // fit to the height of right(under) image
      objectFit: 'cover',
      // protrudes is hidden
      position: 'absolute',
      top: 0,
      width: '100%'
    }, leftImageCss),
    slider: {
      alignItems: 'center',
      cursor: !hover && 'ew-resize',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      left: "".concat(containerWidth * sliderPosition - handleSize / 2, "px"),
      position: 'absolute',
      top: 0,
      width: "".concat(handleSize, "px")
    },
    line: {
      background: sliderLineColor,
      boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      flex: '0 1 auto',
      height: '100%',
      width: "".concat(sliderLineWidth, "px")
    },
    handleCustom: {
      alignItems: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: 'auto',
      justifyContent: 'center',
      width: 'auto'
    },
    handleDefault: {
      alignItems: 'center',
      border: "".concat(sliderLineWidth, "px solid ").concat(sliderLineColor),
      borderRadius: '100%',
      boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: "".concat(handleSize, "px"),
      justifyContent: 'center',
      width: "".concat(handleSize, "px")
    },
    leftArrow: {
      border: "inset ".concat(handleSize * 0.15, "px rgba(0,0,0,0)"),
      borderRight: "".concat(handleSize * 0.15, "px solid ").concat(sliderLineColor),
      height: '0px',
      marginLeft: "-".concat(handleSize * 0.25, "px"),
      // for IE11
      marginRight: "".concat(handleSize * 0.25, "px"),
      width: '0px'
    },
    rightArrow: {
      border: "inset ".concat(handleSize * 0.15, "px rgba(0,0,0,0)"),
      borderLeft: "".concat(handleSize * 0.15, "px solid ").concat(sliderLineColor),
      height: '0px',
      marginRight: "-".concat(handleSize * 0.25, "px"),
      // for IE11
      width: '0px'
    },
    leftLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      left: '5%',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      top: '50%',
      transform: 'translate(0,-50%)',
      transition: 'opacity 0.1s ease-out 0.5s',
      maxWidth: '30%',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none'
    },
    rightLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      right: '5%',
      top: '50%',
      transform: 'translate(0,-50%)',
      transition: 'opacity 0.1s ease-out 0.5s',
      maxWidth: '30%',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none'
    }
  };
  return React.createElement(React.Fragment, null, skeleton && !allImagesLoaded && React.createElement("div", {
    style: _objectSpread({}, styles.container)
  }, skeleton), React.createElement("div", {
    style: _objectSpread({}, styles.container, {
      display: allImagesLoaded ? 'block' : 'none'
    }),
    ref: containerRef,
    "data-testid": "container"
  }, React.createElement("img", {
    onLoad: function onLoad() {
      return setRightImgLoaded(true);
    },
    alt: rightImageAlt,
    "data-testid": "right-image",
    ref: rightImageRef,
    src: rightImage,
    style: styles.rightImage
  }), React.createElement("img", {
    onLoad: function onLoad() {
      return setLeftImgLoaded(true);
    },
    alt: leftImageAlt,
    "data-testid": "left-image",
    ref: leftImageRef,
    src: leftImage,
    style: styles.leftImage
  }), React.createElement("div", {
    style: styles.slider,
    className: classnames(_defineProperty({}, 'wiggle', wiggle))
  }, React.createElement("div", {
    style: styles.line
  }), handle ? React.createElement("div", {
    style: styles.handleCustom
  }, handle) : React.createElement("div", {
    style: styles.handleDefault
  }, React.createElement("div", {
    style: styles.leftArrow
  }), React.createElement("div", {
    style: styles.rightArrow
  })), React.createElement("div", {
    style: styles.line
  })), leftImageLabel && React.createElement("div", {
    style: styles.leftLabel
  }, leftImageLabel), rightImageLabel && React.createElement("div", {
    style: styles.rightLabel
  }, rightImageLabel)));
}

ReactCompareImage.defaultProps = defaultProps;

var css$5 = ".BeforeAfter-module_container__38Dru {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.wiggle {\n  animation: BeforeAfter-module_shake__3iLe8 1.5s cubic-bezier(.36,.07,.19,.97) both;\n}\n\n@keyframes BeforeAfter-module_shake__3iLe8 {\n  10%, 90% {\n    transform: translate3d(-20%, 0, 0);\n  }\n\n  20%, 80% {\n    transform: translate3d(40%, 0, 0);\n  }\n\n  30%, 50%, 70% {\n    transform: translate3d(-80%, 0, 0);\n  }\n\n  40%, 60% {\n    transform: translate3d(80%, 0, 0);\n  }\n}";
var styles$5 = {"container":"BeforeAfter-module_container__38Dru","shake":"BeforeAfter-module_shake__3iLe8"};
styleInject(css$5);

var BeforeAfter = (function (_ref) {
  var state = _ref.state,
      leftImageLabel = _ref.leftImageLabel,
      rightImageLabel = _ref.rightImageLabel,
      _ref$startPos = _ref.startPos,
      startPos = _ref$startPos === void 0 ? 0 : _ref$startPos,
      _ref$slideMode = _ref.slideMode,
      slideMode = _ref$slideMode === void 0 ? 'both' : _ref$slideMode;

  var _useState = useState({
    pos: window.pageYOffset || document.documentElement.scrollTop,
    dir: 'unknown'
  }),
      _useState2 = _slicedToArray(_useState, 2),
      scrollPos = _useState2[0],
      setScrollPos = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isSliding = _useState4[0],
      setIsSliding = _useState4[1];

  var _useState5 = useState(startPos),
      _useState6 = _slicedToArray(_useState5, 2),
      beforeAfterPos = _useState6[0],
      setBeforeAfterPos = _useState6[1];

  var beforeAfterRef = useRef();
  var slideOnScroll = slideMode === 'both' || slideMode === 'scroll';
  var slideClassic = slideMode === 'both' || slideMode === 'classic';
  var current = beforeAfterRef.current;

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      wiggle = _useState8[0],
      setWiggle = _useState8[1];

  useEffect(function () {
    var node = current;

    if (node) {
      setWiggle(state === 'active');
    }
  }, [state, current]);
  useEffect(function () {
    var node = current;

    function handler() {
      if (node) {
        setScrollPos(function (prevPos) {
          var currPos = window.pageYOffset || document.documentElement.scrollTop;

          if (currPos > prevPos['pos']) {
            return {
              pos: currPos,
              dir: 'down'
            };
          }

          if (currPos < prevPos['pos']) {
            return {
              pos: currPos,
              dir: 'up'
            };
          }

          return prevPos;
        });

        if (slideOnScroll) {
          if (scrollPos['dir'] === 'down' && beforeAfterPos < 1) {
            setBeforeAfterPos(function (prev) {
              return prev + 0.025;
            });
            setIsSliding(true);
            setTimeout(function () {
              return setIsSliding(false);
            }, 200);
          } else if (scrollPos['dir'] === 'up' && beforeAfterPos > 0) {
            setBeforeAfterPos(function (prev) {
              return prev - 0.025;
            });
            setIsSliding(true);
            setTimeout(function () {
              return setIsSliding(false);
            }, 250);
          } else {
            setIsSliding(false);
          }
        }
      }
    }

    if (!node) {
      return;
    }

    setTimeout(handler, 0);

    if (state === 'active') {
      window.addEventListener('scroll', handler);
      return function () {
        window.removeEventListener('scroll', handler);
      };
    }
  }, [current, setBeforeAfterPos, scrollPos, state, setIsSliding]);
  var awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-images/';
  var beforeImage = awsBucket + 'before_after/haldern_church1.jpg';
  var afterImage = awsBucket + 'before_after/haldern_church2.jpg';
  return React.createElement("div", {
    ref: beforeAfterRef,
    className: styles$5.container
  }, React.createElement(ReactCompareImage, {
    leftImage: beforeImage,
    rightImage: afterImage,
    sliderPosition: beforeAfterPos,
    setSliderPosition: setBeforeAfterPos,
    isSliding: isSliding,
    setIsSliding: setIsSliding,
    leftImageLabel: leftImageLabel,
    rightImageLabel: rightImageLabel,
    classicMode: slideClassic,
    wiggle: wiggle
  }));
});

var css$6 = ".Backdrop-module_Backdrop__1w4UZ {\n  width: 100%;\n  z-index: 2;\n}\n\n.Backdrop-module_offScreen__2_FYZ {\n}\n";
var styles$6 = {"Backdrop":"Backdrop-module_Backdrop__1w4UZ","offScreen":"Backdrop-module_offScreen__2_FYZ"};
styleInject(css$6);

function Backdrop(props) {
  var containerRef = useRef();
  var containerDimension = useDimension(containerRef);
  return React.createElement("div", {
    className: classnames(styles$6.Backdrop, props.transitionStyles.backdrop, props.transitionStyles["backdrop-".concat(props.state)], _defineProperty({}, styles$6.offScreen, props.offScreen))
  }, React.createElement("div", {
    className: props.transitionStyles.backdropInner
  }, React.createElement("div", {
    className: props.transitionStyles.backdropInner2
  }, props.children(renderContent(props, containerDimension, containerRef)))));
}

function renderContent(props, containerDimension, containerRef) {
  if (props.image.startsWith('#')) {
    return React.createElement(FillColor, {
      color: props.image
    });
  } else if (props.image.startsWith('video')) {
    var video = videos[props.image];
    return React.createElement(Fullscreen, {
      ref: containerRef
    }, React.createElement(Video, {
      state: props.onScreen ? 'active' : 'inactive',
      id: props.image,
      offset: props.offset,
      interactive: props.interactive,
      nextSceneOnEnd: props.nextSceneOnEnd
    }), React.createElement(MotifArea, {
      active: props.editMode,
      ref: props.motifAreaRef,
      image: video,
      containerWidth: containerDimension.width,
      containerHeight: containerDimension.height
    }));
  } else if (props.image.startsWith('beforeAfter')) {
    return React.createElement(Fullscreen, {
      ref: containerRef
    }, React.createElement(BeforeAfter, {
      state: props.state,
      leftImageLabel: props.leftImageLabel,
      rightImageLabel: props.rightImageLabel,
      startPos: props.startPos,
      slideMode: props.slideMode
    }));
  } else {
    var image = images[props.image];
    var imageMobile = images[props.imageMobile];
    var backgroundImages;

    if (imageMobile === undefined) {
      backgroundImages = React.createElement(Image, {
        id: image.id,
        focusX: image.focusX,
        focusY: image.focusY
      });
    } else {
      backgroundImages = React.createElement(React.Fragment, null, React.createElement(Image, {
        id: image.id,
        focusX: image.focusX,
        focusY: image.focusY
      }), React.createElement(Image, {
        id: imageMobile.id,
        focusX: imageMobile.focusX,
        focusY: imageMobile.focusY
      }));
    }

    return React.createElement(Fullscreen, {
      ref: containerRef
    }, backgroundImages, React.createElement(MotifArea, {
      active: props.editMode,
      ref: props.motifAreaRef,
      image: image,
      containerWidth: containerDimension.width,
      containerHeight: containerDimension.height
    }));
  }
}

var css$7 = ".Foreground-module_Foreground__13ODU {\n  position: relative;\n  z-index: 3;\n\n  box-sizing: border-box;\n\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.Foreground-module_fullFadeHeight__2p9dx {\n  min-height: 51vh;\n}\n\n.Foreground-module_fullHeight__1vMXb {\n  min-height: 100vh;\n}\n\n.Foreground-module_fullFadeHeight__2p9dx.Foreground-module_enlarge__14Plm,\n.Foreground-module_fullHeight__1vMXb.Foreground-module_enlarge__14Plm {\n  min-height: 130vh;\n}\n\n.Foreground-module_hidden__2dmAx {\n  visibility: hidden;\n}\n";
var styles$7 = {"Foreground":"Foreground-module_Foreground__13ODU","fullFadeHeight":"Foreground-module_fullFadeHeight__2p9dx","fullHeight":"Foreground-module_fullHeight__1vMXb","enlarge":"Foreground-module_enlarge__14Plm","hidden":"Foreground-module_hidden__2dmAx"};
styleInject(css$7);

function Foreground(props) {
  return React.createElement("div", {
    className: className(props)
  }, props.children);
}

function className(props) {
  var _classNames;

  return classnames(styles$7.Foreground, props.transitionStyles.foreground, props.transitionStyles["foreground-".concat(props.state)], styles$7["".concat(props.heightMode, "Height")], (_classNames = {}, _defineProperty(_classNames, styles$7.hidden, props.hidden), _defineProperty(_classNames, styles$7.enlarge, props.hidden && !props.disableEnlarge), _classNames));
}

var css$8 = ".EditInlinePosition-module_root__25XhQ {\n  position: relative;\n}\n\n.EditInlinePosition-module_select__35wKR {\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  z-index: 4;\n}\n";
var styles$8 = {"root":"EditInlinePosition-module_root__25XhQ","select":"EditInlinePosition-module_select__35wKR"};
styleInject(css$8);

function EditInlinePosition(props) {
  return React.createElement("div", {
    className: styles$8.root
  }, props.children, React.createElement("select", {
    className: styles$8.select,
    value: props.position,
    onChange: function onChange(event) {
      return props.onChange(event.target.value);
    }
  }, props.availablePositions.map(function (position) {
    return React.createElement("option", {
      key: position,
      value: position
    }, position);
  })));
}

var css$9 = "\n\n.Heading-module_Heading__1YSiy {\n  font-size: 66px;\n  font-weight: 700;\n  margin-top: 0;\n  margin-bottom: 0.5em;\n  padding-top: 0.5em;\n}\n\n.Heading-module_first__1yPxD {\n  font-size: 110px;\n  line-height: 1;\n}\n\n@media (orientation: landscape) {\n  .Heading-module_first__1yPxD {\n    padding-top: 25%;\n  }\n}\n\n@media (max-width: 600px) {\n  .Heading-module_Heading__1YSiy {\n    font-size: 40px;\n  }\n\n  .Heading-module_first__1yPxD {\n    font-size: 66px;\n  }\n}\n";
var styles$9 = {"text-l":"40px","text-xl":"66px","text-2xl":"110px","Heading":"Heading-module_Heading__1YSiy","first":"Heading-module_first__1yPxD"};
styleInject(css$9);

function Heading(props) {
  return React.createElement("h1", {
    className: classnames(styles$9.Heading, _defineProperty({}, styles$9.first, props.first)),
    style: props.style,
    id: props.anchor
  }, props.children);
}
Heading.defaultProps = {
  anchor: ''
};

var css$a = "\n\n.TextBlock-module_TextBlock__5Zpj7 {\n  font-size: 22px;\n  line-height: 1.4;\n\n  padding: 1em 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  text-shadow: none;\n}\n\n.TextBlock-module_dummy__3W5ls {\n  opacity: 0.7;\n}\n\n.TextBlock-module_TextBlock__5Zpj7 a {\n  color: #fff;\n  word-wrap: break-word;\n}\n\n.TextBlock-module_TextBlock__5Zpj7 ol,\n.TextBlock-module_TextBlock__5Zpj7 ul {\n  padding-left: 20px;\n}\n";
var styles$a = {"text-base":"22px","TextBlock":"TextBlock-module_TextBlock__5Zpj7","dummy":"TextBlock-module_dummy__3W5ls"};
styleInject(css$a);

function TextBlock(props) {
  return React.createElement("div", {
    className: classnames(styles$a.TextBlock, _defineProperty({}, styles$a.dummy, props.dummy)),
    style: props.style
  }, props.children);
}

var css$b = ".InlineCaption-module_root__1R8Ib {\n  padding: 3px 10px 5px;\n  background-color: #fff;\n  color: #222;\n  font-size: text-s;\n  line-height: 1.4;\n  text-shadow: none;\n}\n";
var styles$b = {"text-base":"22px","root":"InlineCaption-module_root__1R8Ib"};
styleInject(css$b);

function InlineCaption(props) {
  if (props.text) {
    return React.createElement("div", {
      className: styles$b.root
    }, props.text);
  } else {
    return null;
  }
}

var css$c = ".InlineImage-module_root__1DvUb {\n  position: relative;\n  margin-top: 1em;\n}\n\n.InlineImage-module_container__Pui7E {\n  position: relative;\n  margin-top: 1em;\n}\n\n.InlineImage-module_spacer__2rMkE {\n  padding-top: 75%;\n}\n\n.InlineImage-module_inner__2AMK- {\n  border: solid 2px #fff;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n";
var styles$c = {"root":"InlineImage-module_root__1DvUb","container":"InlineImage-module_container__Pui7E","spacer":"InlineImage-module_spacer__2rMkE","inner":"InlineImage-module_inner__2AMK-"};
styleInject(css$c);

function InlineImage(props) {
  return React.createElement("div", {
    className: classnames(styles$c.root)
  }, React.createElement("div", {
    className: styles$c.container
  }, React.createElement("div", {
    className: styles$c.spacer
  }, React.createElement("div", {
    className: styles$c.inner
  }, React.createElement(Image, props)))), React.createElement(InlineCaption, {
    text: props.caption
  }));
}

var css$d = ".InlineVideo-module_root__2UD3D {\n  position: relative;\n  max-height: 98vh;\n}\n\n.InlineVideo-module_inner__H81_g {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n";
var styles$d = {"root":"InlineVideo-module_root__2UD3D","inner":"InlineVideo-module_inner__H81_g"};
styleInject(css$d);

function InlineVideo(props) {
  var ref = useRef();
  var onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  return React.createElement("div", {
    ref: ref,
    className: classnames(styles$d.root)
  }, React.createElement("div", {
    style: {
      paddingTop: props.wideFormat ? '41.15%' : '56.25%'
    }
  }, React.createElement("div", {
    className: styles$d.inner
  }, React.createElement(Video, Object.assign({}, props, {
    state: onScreen ? 'active' : 'inactive',
    interactive: true
  })))));
}

var css$e = ".InlineBeforeAfter-module_root__2O9F8 {\n  position: relative;\n  margin: 0 auto;\n}\n";
var styles$e = {"root":"InlineBeforeAfter-module_root__2O9F8"};
styleInject(css$e);

function InlineBeforeAfter(props) {
  var ref = useRef();
  var onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  return React.createElement("div", {
    ref: ref,
    className: styles$e.root
  }, React.createElement(BeforeAfter, Object.assign({}, props, {
    state: onScreen ? 'active' : 'inactive'
  })));
}

var css$f = ".SoundDisclaimer-module_soundDisclaimer__1sAiH {\n  text-align: center;\n  border: 1px solid white;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: inherit;\n}\n\n.SoundDisclaimer-module_soundDisclaimer__1sAiH:hover {\n  background: rgba(255, 255, 255, 0.25);\n}";
var styles$f = {"soundDisclaimer":"SoundDisclaimer-module_soundDisclaimer__1sAiH"};
styleInject(css$f);

function UnmuteButton() {
  return React.createElement(MutedContext.Consumer, null, function (mutedSettings) {
    return React.createElement("div", {
      className: classnames(styles$f.soundDisclaimer),
      onClick: function onClick() {
        return mutedSettings.setMuted(false);
      }
    }, React.createElement("p", null, "Dieser Artikel wirkt am besten mit eingeschaltetem Ton.", React.createElement("br", null), "Klicken Sie einmal in dieses Feld, um den Ton f\xFCr die gesamte Geschichte zu aktivieren."));
  });
}

var loremIpsum1 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ';
var loremIpsum2 = 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';
var loremIpsum3 = 'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.';

var foregroundItemTemplates = {
  heading: {
    name: 'Überschrift',
    component: Heading,
    props: {
      children: 'Heading'
    }
  },
  textBlock: {
    name: 'Text Block',
    component: TextBlock
  },
  loremIpsum1: {
    name: 'Blindtext 1',
    component: TextBlock,
    props: {
      children: loremIpsum1
    }
  },
  loremIpsum2: {
    name: 'Blindtext 2',
    component: TextBlock,
    props: {
      children: loremIpsum2
    }
  },
  loremIpsum3: {
    name: 'Blindtext 3',
    component: TextBlock,
    props: {
      children: loremIpsum3
    }
  },
  inlineImage1: {
    name: 'Inline Bild 1',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'tool1'
    }
  },
  inlineImage2: {
    name: 'Inline Bild 2',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'tool2'
    }
  },
  inlineImage3: {
    name: 'Inline Bild 3',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'tool3'
    }
  },
  inlineVideo: {
    name: 'Inline Video',
    component: InlineVideo,
    inlinePositioning: true,
    props: {
      id: 'videoKaterchen'
    }
  },
  inlineVideoFullWidth: {
    name: 'Inline Video Full Width',
    component: InlineVideo,
    inlinePositioning: true,
    props: {
      id: 'videoInselInterviewToni',
      controls: true
    }
  },
  inlineVideoDrone: {
    name: 'Inline Video Full Width',
    component: InlineVideo,
    inlinePositioning: true,
    props: {
      id: 'videoGarzweilerDrohne',
      controls: true
    }
  },
  inlineBeforeAfter: {
    name: 'Inline Before/After',
    component: InlineBeforeAfter,
    inlinePositioning: true,
    props: {
      leftImageLabel: 'Hier kann Text zum "Vorher"-Bild angegeben werden',
      rightImageLabel: 'Hier kann Text zum "Nachher"-Bild angegeben werden',
      slideMode: 'classic',
      startPos: 0.5
    }
  },
  beforeAfterHeading: {
    component: Heading,
    props: {
      children: 'Vorher / Nachher'
    }
  },
  beforeAfterText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In diesem Beispiel wird ein Vorgeschmack auf horizontales Vorher-Nachher geboten. Der Slider steht anf\xE4nglich auf einer redaktionell festzulegenden Startposition.", React.createElement("br", null), React.createElement("br", null), "Als Schiebem\xF6glichkeiten bestehen dabei vertikales Scrollen, horizontales Scrollen mit Schieber, und Tap/Klick ins Bild. Der Vorher-Nachher-Szene wird hierbei die volle Bildschirmh\xF6he einger\xE4umt, wobei sich das Vorher-Nachher-Bild auf die volle Bildschirmbreite erstreckt.")
    }
  },
  beforeAfterLabelHeading: {
    component: Heading,
    props: {
      children: 'Vorher / Nachher mit Beschriftung, kein Scrollen'
    }
  },
  beforeAfterLabelText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In diesem Beispiel wird ein Vorgeschmack auf horizontales Vorher-Nachher mit Beschriftung der Bilder geboten. Der Slider steht anf\xE4nglich auf einer redaktionell festzulegenden Startposition.", React.createElement("br", null), React.createElement("br", null), "Die Bildbeschriftungen sind hierbei Teil des Hintergrunds, und sind zur Darstellung einer kurzen Erkl\xE4rung des Unterschieds zwischen den beiden Bildern vorgesehen.", React.createElement("br", null), React.createElement("br", null), "Schieben durch Scrollen des Beitrags ist deaktiviert. Nur durch Klick ins Bild oder Bet\xE4tigen des Schiebers erfolgt ein \xDCbergang zwischen Vorher-Bild und Nachher-Bild.")
    }
  },
  beforeAfterScrollmodeHeading: {
    component: Heading,
    props: {
      children: 'Vorher / Nachher, nur Scrollen'
    }
  },
  beforeAfterScrollmodeText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In diesem Beispiel wird ein Vorgeschmack auf horizontales Vorher-Nachher mit Beschriftung der Bilder geboten. Der Slider steht anf\xE4nglich auf einer redaktionell festzulegenden Startposition.", React.createElement("br", null), React.createElement("br", null), "Der klassische Schiebemodus ist hier deaktiviert. Nur durch Scrollen erfolgt ein \xDCbergang zwischen Vorher-Bild und Nachher-Bild.")
    }
  },
  beforeAfterXRayScrollmationExampleHeading: {
    component: Heading,
    props: {
      children: 'Vorher/Nachher, X-Ray und Scrollmation'
    }
  },
  beforeAfterHaldernChurchText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In diesem Beispiel sollen die M\xF6glichkeiten zur Komposition von Phasen- und Vergleichsbildern mithilfe von \"Bordmitteln\" (Szenen\xFCberg\xE4ngen) in Pageflow Next veranschaulicht werden.", React.createElement("br", null), React.createElement("br", null), "Dazu sehen wir als erstes ein klassisches Vorher/Nachher-Bild, welches aus einem Pageflow-Beitrag entnommen wurde. Das Verhalten basiert auf zwei vollfl\xE4chigen Bildern die statisch im Hintergrund positioniert werden. Wie man sieht, funktioniert der Vorher/Nachher-Effekt auch per nativem Scrolling einwandfrei.")
    }
  },
  beforeAfterChernobylText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Der Vorher/Nachher-Effekt eigenet sich hervorragend zur Darstellung zeitlicher Ver\xE4nderungen, hier am Beispiel der Stadt Prypjat nahe dem Kernreaktor Tschernobyl vor dem Unfall und heutzutage.")
    }
  },
  beforeAfterAleppoText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Als einzelne Szene in einem Beitrag funktioniert die vertikale Variante sehr gut. Wenn man jedoch viele Vorher/Nachher-Beispiele am St\xFCck darstellen m\xF6chte, z.B. die Ver\xE4nderung von Gletschern anhand von 10 Beispielen oder eine Reihe von Bildern einer Stadt vor und nach einem Krieg, kann die vollfl\xE4chige Darstellung mit vertikalem Scroll-\xDCbergang erm\xFCdend wirken.", React.createElement("br", null), React.createElement("br", null), "F\xFCr solche F\xE4lle - oder auch wenn das Bildmaterial nicht gut genug f\xFCr die vollfl\xE4chige Darstellung ist - sollte die Inline-Darstellung mit horizontalem Schieberegler, wie bisher aus Pageflow bekannt, trotzdem noch eine zus\xE4tzliche Option sein.")
    }
  },
  aleppoInlineText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Selbstverst\xE4ndlich kann auch bei Vorher/Nachher-Szenen Text in die Vordergrundebene gelegt werden wie bei allen anderen Szenen. Dieser kann das Vorher/Nachher Bild weiter kommentieren.", React.createElement("br", null), "Dabei gelten die gleichen Regeln zum responsiven Verhalten basierend auf dem definierten Bildausschnitt (zu beobachten bei Ver\xE4nderung der Gr\xF6\xDFe des Browserfensters).")
    }
  },
  xRayHeading: {
    component: Heading,
    props: {
      children: 'Umsetzung des "X-Ray"-Effekts'
    }
  },
  xRayText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Ein anderer Einsatz des Vorher/Nachher-Szenen\xFCbergangs ist die Umsetzung des X-Ray-Effekts. Dabei werden zwei Szenen mit voller H\xF6he von einer Szene mit dynamischer H\xF6he unterbrochen. Durch die Zuweisung aufeinander abgestimmter, statischer Hintergrundbilder l\xE4sst sich so eine R\xF6ntgen-Optik erzielen, mit der Objekte \"durchleuchtet\" oder anderweitig unterbrochen werden k\xF6nnen.")
    }
  },
  xRayInlineText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In diesem \"Durchleuchtungs\"-Abschnitt kann der Unterschied zum Original veranschaulicht werden.", React.createElement("br", null), React.createElement("br", null), "Durch die direkte Nebeneinanderstellung und Unterbrechung des Originalbilds wirkt die Komposition wie eine einzelne Szene.")
    }
  },
  phasesHeading: {
    component: Heading,
    props: {
      children: 'Umsetzung als Phasenbild'
    }
  },
  phasesText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "M\xF6chte man eine Ver\xE4nderung in mehreren Stufen oder Schichten darstellen, l\xE4sst sich der Vorher/Nachher-Szenen\xFCbergang gepaart mit dynamischer H\xF6he der einzelenen Szenen auch dazu nutzen ein Phasenbild zu konstruieren.")
    }
  },
  phasesSpacer: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null))
    }
  },
  scrollmationHeading: {
    component: Heading,
    props: {
      children: 'Umsetzung als Hintergrund-Scrollmation'
    }
  },
  scrollmationText1: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Wenn man statt des Vorher/Nachher-Szenen\xFCbergangs die Fade-Variante konfiguriert, l\xE4sst sich dasselbe Bildmaterial auch als Scrollmation darstellen. Hierbei \xE4ndert sich das Hintergrundbild kontextbezogen an verschiedenen im Text verankerten Stellen.")
    }
  },
  scrollmationText2: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Dabei gilt genau wie f\xFCr Vorher/Nachher-Motive: Gibt das Bildmaterial keine vollfl\xE4chige Darstellung her oder m\xF6chte man das Material eher begleitend darstellen, kommt jederzeit auch die Positionierung als begleitendes Inline-element in Frage.")
    }
  },
  scrollmationText3: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Die Hintergrund-Scrollmation besteht dabei aus mehreren aufeinanderfolgenden Szenen mit vollfl\xE4chigen Hintergundbildern, zwischen denen ein entsprechender Szenen\xFCbergang konfiguriert wurde. Dabei scrollt der Text kontinuierlich in der Vordergrundebene w\xE4hrend die Hintergrund-Bilder kontextbezogen ausgetauscht werden.")
    }
  },
  videoExamplesHeading: {
    component: Heading,
    props: {
      children: 'Video-Backdrops und interaktive Videos'
    }
  },
  videoExamplesText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In dieser Demo wechseln sich jeweils Hintergrund-Video und ineraktives Video ab. Es werden alle Szenen\xFCberg\xE4nge verwendet um die Szenenwechsel in allen Variationen wirken lassen zu k\xF6nnen.", React.createElement("br", null), "Hintergrund-Videos spielen automatisch (AutoPlay), in Endlosschleife (Loop) und sind grunds\xE4tzlich zentriert und Viewport-f\xFCllend positioniert.", React.createElement("br", null), "Interaktive Videos werden auf Viewport-Breite skaliert und oben und unten mit schwarzen R\xE4ndern dargestellt.")
    }
  },
  videoExamplesTextBeforeAfter: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "F\xFCr den Before/After Szenen\xFCbergang werden in dieser Szene zwei Varianten des Hintergrund-Videos verwendet.", React.createElement("br", null), React.createElement("br", null), React.createElement("b", null, "Dazu nochmal der explizite Hinweis, dass Before/After in diesem Kontext nur der Name f\xFCr den Szenen\xFCbergang ist"), ". Der Szenen-Typ \"Interaktive Szene\" mit horizontalem Before/After-Schieberegler wird Teil einer der n\xE4chsten Demos sein.")
    }
  },
  // PresentationExample
  presentationIntroductionHeading: {
    component: Heading,
    props: {
      children: 'Pageflow Next',
      anchor: 'introduction'
    }
  },
  soundDisclaimer: {
    component: UnmuteButton
  },
  presentationIntroductionText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Dies ist der Prototyp von \u201CPageflow Next\u201D - einer grundlegend \xFCberarbeiteten Version des bekannten Storytelling-Tools.", React.createElement("br", null), React.createElement("br", null), "Im Fokus der Entwicklung standen drei Punkte:", React.createElement("br", null), React.createElement("ol", null, React.createElement("li", null, "Optimale Darstellung auf mobilen Ger\xE4ten"), React.createElement("li", null, "Neues User Interface"), React.createElement("li", null, "Wegfall der \u201CEinrastfunktion\u201D am Ende jeder Seite und grundlegend neue Darstellungsm\xF6glichkeiten.")), "Der Prototyp l\xE4uft am besten im Chrome-Browser, auf mobilen Ger\xE4ten mit dem Betriebssystem iOS auch in Safari.", React.createElement("br", null), React.createElement("br", null), React.createElement("b", null, "Was gibt es hier zu sehen?"), React.createElement("ul", null, React.createElement("li", null, "Die ", React.createElement("b", null, "mobile Ausspielung"), " ist der eigentliche Star von \u201CPageflow Next\u201D - alle Funktionen der Desktop-Version funktionieren problemlos auch auf dem Handy und das Layout passt sich intelligent an das Hochkantformat an.", React.createElement("br", null), "Zum Testen am besten diese Seite parallel auf Desktop und Mobiltelefon \xF6ffnen und durchscrollen. Vieles wird auch mit einem auf Handy-Format verkleinerten Browser-Fenster sichtbar."), React.createElement("li", null, "Das ", React.createElement("b", null, "User Interface"), " ist an verschiedenen Stellen \xFCberarbeitet worden. Die Navigationsleiste befindet sich jetzt am oberen Rand. Sie enth\xE4lt Sprungmarken zu den Kapiteln des Beitrags. Der horizontale Fortschrittsbalken zeigt dem Leser an welcher Stelle des Beitrags er sich gerade befindet. Um m\xF6glichst viel Platz f\xFCr die Story zu schaffen, wird die Navigationsleiste eingefahren w\xE4hrend man sich durch den Beitrag bewegt. Durch die Bewegung des Cursors auf den (immer sichtbaren) Fortschrittsbalken (oder durch Scrolling entgegen der Leserichtung) wird die Navigationsleiste wieder ausgefahren."), React.createElement("li", null, "Die neuen ", React.createElement("b", null, "Darstellungsm\xF6glichkeiten"), " werden auf den folgenden Seiten gezeigt und im Text jeweils auch kurz erkl\xE4rt. Es gibt neue M\xF6glichkeiten f\xFCr Szenen\xFCberg\xE4nge, Positionierung von Text und Medien und das Layout.")), "Zum besseren Vergleich gibt es diese Demo-Seiten auch im \u201Calten Pageflow\u201D-Design unter folgender Adresse:", React.createElement("a", {
        href: "https://reportage.wdr.de/pageflow-next-lang",
        target: "_blank"
      }, "https://reportage.wdr.de/pageflow-next-lang"), " (Benutzername: WDR, Passwort: moreflow)", React.createElement("br", null), React.createElement("br", null), "(#1)")
    }
  },
  presentationSceneTransitionsHeading: {
    component: Heading,
    props: {
      children: 'Szenen-Übergänge',
      anchor: 'scene-transitions'
    }
  },
  presentationSceneTransitionsRevealText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Wie am \xDCbergang der beiden Szenen (Bilder) zu sehen, entf\xE4llt in \u201CPageflow Next\u201D das \u201CEinrasten\u201D jeder Seite beim Weiterscrollen. Damit soll sich f\xFCr den Nutzer der Flow im Pageflow verbessern, es soll klarer werden, dass das Ende der Geschichte noch nicht erreicht ist.", React.createElement("br", null), React.createElement("br", null), "Es gibt verschiedene neue Szenen\xFCberg\xE4nge und Textformatierungen.", React.createElement("br", null), React.createElement("br", null), React.createElement("u", null, "Szenen\xFCbergang: \"Reveal\""), React.createElement("br", null), "Dieser Szenen\xFCbergang legt die n\xE4chste Szene frei indem das neue Hintergrundbild \"aufgedeckt\" wird. Der Text scrollt kontinuierlich weiter, womit die Kontinuit\xE4t des Leseflusses beibehalten wird.", React.createElement("br", null), React.createElement("br", null), "(#2)")
    }
  },
  presentationSceneTransitionsScrollOverText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, React.createElement("u", null, "Szenen\xFCbergang: \"ScrollOver\""), React.createElement("br", null), "Bei diesem Szenen\xFCbergang scrollt das neue Hintergrundbild \xFCber das vorherige und bleibt dann, sobald es den Viewport ausf\xFCllt, an dieser Position stehen.", React.createElement("br", null), React.createElement("br", null), React.createElement("u", null, "Positionierung: Zentriert"), React.createElement("br", null), "Der Begleittext ist in dieser Szene zentriert dargestellt. Diese Option eignet sich besonders bei Hintergrundbildern deren Motiv ebenfalls mittig liegt. Neu in \u201CPageflow Next\u201D: Der wichtige Bildteil (in diesem Fall der Fisch) kann markiert werden und wird so zun\xE4chst nicht von Text verdeckt.", React.createElement("br", null), React.createElement("br", null), React.createElement("u", null, "Layout:"), " Als Layout kommt hier die Option \"Karte\" zum Einsatz. Bei dieser Option wird der Text mit einer einfarbigen Fl\xE4che mit abgerundeten Ecken hinterlegt. Die Option bietet maximalen Kontrast und optimale Lesbarkeit und hebt den Text von der Hintergrundebene ab.", React.createElement("br", null), React.createElement("br", null), "Bei allen gezeigten Layouts sind Variationen denkbar, wie z.B. konfigurierbare Intensit\xE4t der Abdunklung bei Layout \"Abdunkeln\" Oder Hintergrund- und Textfarbe bei Option \"Karte\".", React.createElement("br", null), React.createElement("br", null), "(#3)")
    }
  },
  presentationShortSceneHeading: {
    component: Heading,
    props: {
      children: 'Kurze Szenen'
    }
  },
  presentationShortSceneBeforeText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Einzelne Szenen m\xFCssen nicht mehr zwingend bildschirmf\xFCllend sein.", React.createElement("br", null), React.createElement("br", null), "Durch die neue Scrollmechanik in \u201CPageflow Next\u201D sind auch Szenen m\xF6glich, die nicht den ganzen Viewport ausf\xFCllen, sondern eher eine Auflockerung des Leseflusses bieten. Im Hintergrund kann ein Bild mit geringer H\xF6he oder eine einfarbige Fl\xE4che liegen.", React.createElement("br", null), React.createElement("br", null), "Einsatzm\xF6glichkeiten sind beispielsweise kurze Anmoderationen f\xFCr Videos oder abgehoben dargestellte Zitate.", React.createElement("br", null), React.createElement("br", null), "(#4)")
    }
  },
  shortSceneSpacer: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null))
    }
  },
  presentationShortSceneAfterText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Hier sind der Kreativit\xE4t beim Szenenaufbau keine Grenzen gesetzt.", React.createElement("br", null), React.createElement("br", null), "Denkbar sind auch mehrere aneinandergereihte kurze Szenen mit verschiedenen Versionen des selben Motivs. So lassen sich Overlay-, X-Ray oder Scheiben-Effekte erzielen. Durch geschickte Bildauswahl wirken die kurzen Szenen dann wie eine semantisch zusammenh\xE4ngende Szene.", React.createElement("br", null), React.createElement("br", null), "\xDCbrigens: Bei Pageflow Next ist rechtsb\xFCndig jetzt auch wirklich richtig weit rechts. Das war vorher mit der alten Navigation nicht m\xF6glich.", React.createElement("br", null), React.createElement("br", null), "(#5)")
    }
  },
  presentationFadeText1: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Hintergrundbilder k\xF6nnen auch ganz ohne Scroll-Animation einfach passend zum Kontext ausgetauscht werden.", React.createElement("br", null), React.createElement("br", null), "Bei solchen sogenannten \"Fade\"-Szenen\xFCberg\xE4ngen wird von einem Hintergrundbild zum anderen \xFCberblendet.", React.createElement("br", null), React.createElement("br", null), "(#6)")
    }
  },
  presentationFadeText2: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Dabei lassen sich interessante Effekte erzielen indem der Content beider Szenen lesbar ist und je nach Scrollposition das eine oder das andere Hintergrundbild verwendet wird.", React.createElement("br", null), React.createElement("br", null), "(#7)")
    }
  },
  presentationMediaHeading: {
    component: Heading,
    props: {
      children: 'Einsatz von Medien',
      anchor: 'media'
    }
  },
  presentationMediaVideosText1: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Selbstverst\xE4ndlich sind auch Hintergrundvideos/Loops in Pageflow Next wieder m\xF6glich.", React.createElement("br", null), React.createElement("br", null), "Video mit O-T\xF6nen etc. k\xF6nnen nahtlos anschlie\xDFen und starten automatisch.", React.createElement("br", null), React.createElement("br", null), "(#8)")
    }
  },
  presentationMediaInlineHeading: {
    component: Heading,
    props: {
      children: 'Inline-Medien'
    }
  },
  presentationMediaImagesText1: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Medien k\xF6nnen nicht nur bildschirmf\xFCllend im Hintergrund platziert werden, sondern auch \"inline\" im Vordergrund. Beispielsweise k\xF6nnen Fotos in den Flie\xDFtext integriert werden.")
    }
  },
  presentationMediaInlineImage1: {
    name: 'braunkohleInline1',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'braunkohleInline1',
      focusX: 12,
      focusY: 90
    }
  },
  presentationMediaImagesText2: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Hier zu sehen ist auch eine neue rechtsb\xFCndige Formatierung. Bisher steht rechtsb\xFCndig formatierter Text oft eher in der Mitte des Bildes, weil der rechte Rand durch die Navigation belegt ist.", React.createElement("br", null), React.createElement("br", null), "Auch Videos k\xF6nnen \u201Cinline\u201D ablaufen.")
    }
  },
  presentationMediaImagesText3: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Die Inline-Video-Funktion soll die M\xF6glichkeit bieten auch Videos zu verwenden, die qualitativ nicht f\xFCr eine Vollbildausspielung geeignet sind. Beispielsweise historisches Archivmaterial.", React.createElement("br", null), React.createElement("br", null), "(#9)")
    }
  },
  presentationMediaImagesText4: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Weiterhin ist es in Pageflow Next m\xF6glich, Medien nicht nur inline im Textfluss zu positionieren, sondern auch begleitend neben dem Text.")
    }
  },
  presentationMediaStickyImage1: {
    name: 'braunkohleSticky1',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'braunkohleSticky1',
      focusX: 12,
      focusY: 90
    }
  },
  presentationMediaImagesText5: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Das Element bleibt dann so lange statisch an seiner Position neben dem Text stehen, bis entweder die Szene aus dem Viewport gescrollt wird oder es vom n\xE4chsten begleitenden Element verdr\xE4ngt wird.", React.createElement("br", null), "Diese Positionierung wird im Gegensatz zu inline \"sticky\" genannt.")
    }
  },
  presentationMediaImagesText6: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "In Mobildarstellung werden sticky images einfach zu inline images. Auf diese Weise kann das Erscheinungsbild aufgelockert werden und dabei trotzdem verschiedenen Screengr\xF6\xDFen optimal Rechnung getragen werden.", React.createElement("br", null), React.createElement("br", null), "(#10)")
    }
  },
  presentationMediaStickyImage2: {
    name: 'braunkohleSticky2',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'braunkohleSticky2'
    }
  },
  presentationMediaImagesText7: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Sticky images funktionieren besonders gut bei Desktop-Darstellung und langen Textpassagen:")
    }
  },
  presentationMediaStickyImage3: {
    name: 'braunkohleSticky3',
    component: InlineImage,
    inlinePositioning: true,
    props: {
      id: 'braunkohleSticky3'
    }
  },
  presentationMediaVideosHeading: {
    component: Heading,
    props: {
      children: 'Videos'
    }
  },
  presentationMediaVideosText2: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Auf diese Weise k\xF6nnen sich auch verschieden Video-Loops hintereinander abl\xF6sen ohne zu viel Unruhe in den Lesefluss zu bringen.", React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), "Soll ein Video als Teil der Erz\xE4hlung voll zur Geltung kommen, so wird es in Pageflow Next als \"interaktives\" Video gekennzeichnet. Interaktive Elemente stehen in einer Szene f\xFCr sich allein. Es gibt keine weitere Ebene auf der Content stattfindet.", React.createElement("br", null), "Dies erlaubt den Zugriff auf Steuerelemente ohne vorherige Aktivierung, wie es derzeit in Pageflow oft n\xF6tig ist (z.B. bei Vorher/Nachher-Seiten).", React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), "Die folgenden zwei Szenen sind interaktive Szenen, zuerst vom Typ Video und danach vom Typ Vorher/Nachher. (#9)")
    }
  },
  presentationHeadSolutionHeading: {
    component: Heading,
    props: {
      children: React.createElement(React.Fragment, null, "L\xF6sung f\xFCr K\xF6pfe")
    }
  },
  presentationHeadSolutionText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Ein Problem der alten Pageflow-Version: Wenn Personen im Bild zu sehen waren, lief der Text je nach Aufl\xF6sung und Ger\xE4t, mitten durch deren Gesicht. Das ist jetzt gel\xF6st. Selbst auf Smartphones bleibt das Gesicht in diesem Beispiel zun\xE4chst sichtbar und wird beim Scrollen des Textes erst abgedunkelt und dann vom Text verdeckt.", React.createElement("br", null), React.createElement("br", null), "Die Auswahl der Positionierung erfolgt passend zum Hintergrundbild-Motiv. Dazu wird beim Upload neuer Bilder grunds\xE4tzlich ein Bereich markiert, der das wesentliche Motiv umschlie\xDFt. Bei der Positonierung der scrollenden Vordergrundeben wird dann versucht diesen Bereich weitestgehend freizulassen damit er zur Geltung kommen kann.", React.createElement("br", null), "In der Mobildarstellung wird der Text dementsprechend innerhalb der Szene nach unten geschoben, w\xE4hrend in der Desktop-Darstellung genug Platz ist um das Motiv neben dem Text anzuzeigen.", React.createElement("br", null), React.createElement("br", null), "(#11)")
    }
  },
  presentationBeforeAfterHeading: {
    component: Heading,
    props: {
      children: React.createElement(React.Fragment, null, "Vorher/Nachher")
    }
  },
  presentationBeforeAfterText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Das beliebte Storytelling-Feature Vorher/Nachher-Vergleichsbild ist selbstverst\xE4ndlich auch bereits in Pageflow Next integriert.", React.createElement("br", null), React.createElement("br", null), "Der Schieberegler kann durch ziehen oder klicken beweget werden. Neu ist die M\xF6glichkeit der Beschriftung der einzelnen Bilder, wobei der Text bei der Bedienung des Schiebreglers ausgeblendet wird.", React.createElement("br", null), React.createElement("br", null), "Der Vorher/Nachher-Modus muss nicht mehr wie aktuell in Pageflow \"aktiviert\" bzw. \"gestartet\" werden, sondern l\xE4dt durch eine kurze Animation beim Betreten der Szene direkt zum Ausprobieren ein.", React.createElement("br", null), React.createElement("br", null), "(#12)")
    }
  },
  presentationScrollmationHeading: {
    component: Heading,
    props: {
      children: 'Phasenbilder'
    }
  },
  presentationScrollmationText1: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Mit Hilfe der vordefinierten Szenen\xFCberg\xE4nge lassen sich auch zeitliche Abfolgen simulieren. In diesem Beispiel wird ein Schaubild in 3 Schritten passend zum Text aufgedeckt.")
    }
  },
  presentationScrollmationText2: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Das Scrollen des Nutzers veranlasst im Hintergrund den Szenen\xFCbergang (in diesem Fall die Variante \"Fade\").")
    }
  },
  presentationScrollmationText3: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Durch die Anfertigung passenden Bildmaterials und die Konfiguration entsprechender Szenen\xFCberg\xE4nge und Positionierungen (achten sie auch hier wieder auf die Mobildarstellung) lassen sich so komplexe Abfolgen, Datendiagramme oder zeitliche Ver\xE4nderungen St\xFCck f\xFCr St\xFCck \xFCbertragen. (#13)")
    }
  },
  presentationFeedbackHeading: {
    component: Heading,
    props: {
      children: 'Feedback Pageflow Next?'
    }
  },
  presentationFeedbackText: {
    component: TextBlock,
    props: {
      children: React.createElement(React.Fragment, null, "Dieser Prototyp ist in vier einw\xF6chigen Sprints entstanden. Wie bei der agilen Softwareentwicklung \xFCblich, haben wir jede Woche neu entschieden welche Ideen wir weiter verfolgen wollen und welche Dinge wir niedriger priorisieren.", React.createElement("br", null), "Dieser Prototyp zeigt deswegen wichtige neue Darstellungs- und Bedienm\xF6glichkeiten, aber er ist noch kein fertiges Produkt. Die Navigationsleiste haben wir beispielsweise nur skizziert, der Prototyp ist nur auf den Chrome-Browser (iOS auch Safari) optimiert und er enth\xE4lt auch noch kein intelligentes Lademanagement f\xFCr Videos.", React.createElement("br", null), React.createElement("br", null), "Wir freuen uns \xFCber Feedback! Sind die neuen Mechanismen sinnvoll oder \xFCberfl\xFCssig? Wie f\xFChlt sich Pageflow ohne Einrasten am Seitenende an? Was fehlt? Was ist toll?", React.createElement("br", null), React.createElement("br", null), React.createElement("a", {
        mailto: "pageflow@wdr.de"
      }, "pageflow@wdr.de"), React.createElement("br", null), React.createElement("br", null), "Aus dem Pageflow-Labor: Stefan Domke (WDR), Tim Fischbach (Codevise), Daniel Kuhn (Codevise), David Ohrndorf (WDR).")
    }
  }
};

function ForegroundItem(props) {
  var template = foregroundItemTemplates[props.type];
  var Component = template.component;

  if (template.inlinePositioning) {
    return React.createElement(EditInlinePosition, {
      position: props.position,
      availablePositions: props.availablePositions,
      onChange: props.onPositionChange
    }, React.createElement(Component, Object.assign({}, template.props, props.itemProps)));
  } else {
    return React.createElement(Component, Object.assign({}, template.props, props.itemProps));
  }
}

function ForegroundItems(props) {
  return React.createElement(React.Fragment, null, props.items.map(function (item, index) {
    return props.children(item, React.createElement(ForegroundItem, {
      key: index,
      type: item.type,
      position: item.position,
      availablePositions: props.availablePositions,
      onPositionChange: function onPositionChange(position) {
        return props.onPositionChange(item.index, position);
      },
      itemProps: item.props
    }));
  }));
}
ForegroundItems.defaultProps = {
  children: function children(item, child) {
    return child;
  }
};

var css$g = ".TwoColumn-module_root__37EqL {\n}\n\n.TwoColumn-module_group__3Hg2y {\n  clear: right;\n  margin-left: 8%;\n  margin-right: 8%;\n}\n\n.TwoColumn-module_group-full__2OT4o {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.TwoColumn-module_sticky__4LCDO,\n.TwoColumn-module_inline__1fPfM {\n  max-width: 500px;\n}\n\n.TwoColumn-module_right__Fr52a .TwoColumn-module_inline__1fPfM {\n  margin-left: auto;\n}\n\n@media (max-width: 949px) {\n  .TwoColumn-module_right__Fr52a .TwoColumn-module_sticky__4LCDO {\n    margin-left: auto;\n  }\n}\n\n@media (min-width: 950px) {\n  .TwoColumn-module_sticky__4LCDO {\n    position: sticky;\n    float: right;\n    top: 33%;\n    width: 30%;\n    max-width: 600px;\n  }\n\n  .TwoColumn-module_right__Fr52a .TwoColumn-module_sticky__4LCDO {\n    float: left;\n  }\n}\n";
var styles$g = {"root":"TwoColumn-module_root__37EqL","group":"TwoColumn-module_group__3Hg2y","group-full":"TwoColumn-module_group-full__2OT4o","sticky":"TwoColumn-module_sticky__4LCDO","inline":"TwoColumn-module_inline__1fPfM","right":"TwoColumn-module_right__Fr52a"};
styleInject(css$g);

var availablePositions = ['inline', 'sticky', 'full'];
function TwoColumn(props) {
  return React.createElement("div", {
    className: classnames(styles$g.root, styles$g[props.align])
  }, React.createElement("div", {
    className: styles$g.inline,
    ref: props.contentAreaRef
  }), renderItems(props));
}
TwoColumn.defaultProps = {
  align: 'left'
};

function renderItems(props) {
  return groupItemsByPosition(props.items).map(function (group, index) {
    return React.createElement("div", {
      key: index,
      className: classnames(styles$g.group, styles$g["group-".concat(group.position)])
    }, renderItemGroup(props, group, 'sticky'), renderItemGroup(props, group, 'inline'), renderItemGroup(props, group, 'full'));
  });
}

function renderItemGroup(props, group, position) {
  if (group[position].length) {
    return React.createElement("div", {
      className: styles$g[position]
    }, props.children(React.createElement(ForegroundItems, {
      items: group[position],
      availablePositions: availablePositions,
      onPositionChange: props.onPositionChange
    })));
  }
}

function groupItemsByPosition(items) {
  var groups = [];
  var currentGroup;
  items.reduce(function (previousItemPosition, item, index) {
    var position = availablePositions.indexOf(item.position) >= 0 ? item.position : 'inline';

    if (!previousItemPosition || previousItemPosition !== position && (previousItemPosition !== 'sticky' || position !== 'inline')) {
      currentGroup = {
        position: position,
        sticky: [],
        inline: [],
        full: []
      };
      groups = [].concat(_toConsumableArray(groups), [currentGroup]);
    }

    currentGroup[position].push(item);
    return position;
  }, null);
  return groups;
}

var css$h = ".Center-module_outer__3Rr0H {\n  margin-left: 8%;\n  margin-right: 8%;\n}\n\n.Center-module_outer-full__3dknO {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.Center-module_item__1KSs3 {\n  margin-left: auto;\n  margin-right: auto;\n  max-width: 700px;\n}\n\n.Center-module_item-full__1cEuv {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: none;\n}\n\n@media (min-width: 950px) {\n  .Center-module_inner-left__2z9Ea {\n    float: left;\n    width: 60%;\n    margin-left: -10%;\n    margin-right: 1em;\n    margin-bottom: 1em;\n  }\n\n  .Center-module_inner-right__KBkVt {\n    float: right;\n    width: 60%;\n    margin-right: -10%;\n    margin-left: 1em;\n    margin-bottom: 1em;\n  }\n}\n";
var styles$h = {"outer":"Center-module_outer__3Rr0H","outer-full":"Center-module_outer-full__3dknO","item":"Center-module_item__1KSs3","item-full":"Center-module_item-full__1cEuv","inner-left":"Center-module_inner-left__2z9Ea","inner-right":"Center-module_inner-right__KBkVt"};
styleInject(css$h);

function Center(props) {
  return React.createElement("div", {
    className: classnames(styles$h.root)
  }, React.createElement("div", {
    ref: props.contentAreaRef
  }), React.createElement(ForegroundItems, {
    items: props.items,
    availablePositions: ['inline', 'left', 'right', 'full'],
    onPositionChange: props.onPositionChange
  }, function (item, child) {
    return React.createElement("div", {
      key: item.index,
      className: classnames(styles$h.outer, styles$h["outer-".concat(item.position)])
    }, React.createElement("div", {
      className: classnames(styles$h.item, styles$h["item-".concat(item.position)])
    }, props.children(React.createElement("div", {
      className: styles$h["inner-".concat(item.position)]
    }, child))));
  }));
}

function Layout(props) {
  if (props.layout === 'center') {
    return React.createElement(Center, props);
  } else if (props.layout === 'right') {
    return React.createElement(TwoColumn, Object.assign({
      align: "right"
    }, props));
  } else {
    return React.createElement(TwoColumn, props);
  }
}
Layout.defaultProps = {
  layout: 'left'
};

function isIntersectingX(rectA, rectB) {
  return rectA.left < rectB.right && rectA.right > rectB.left || rectB.left < rectA.right && rectB.right > rectA.left;
}

function getBoundingClientRect(el) {
  if (!el) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0
    };
  }

  return el.getBoundingClientRect();
}

function useBoundingClientRect(ref, dependecy) {
  var _useState = useState(getBoundingClientRect(ref && ref.current)),
      _useState2 = _slicedToArray(_useState, 2),
      boundingClientRect = _useState2[0],
      setBoundingClientRect = _useState2[1];

  var current = ref.current;
  useLayoutEffect(function () {
    var node = current;

    function handler() {
      if (node) {
        setBoundingClientRect(getBoundingClientRect(node));
      }
    }

    if (!node) {
      return;
    }

    setTimeout(handler, 0);
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);
    return function () {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    };
  }, [current, dependecy]);
  return boundingClientRect;
}

function useScrollTarget(ref, isScrollTarget) {
  useEffect(function () {
    if (ref.current && isScrollTarget) {
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25,
        behavior: 'smooth'
      });
    }
  }, [ref, isScrollTarget]);
}

var css$i = ".Scene-module_Scene__3AYfT {\n  position: relative;\n}\n\n.Scene-module_invert__8TDeu {\n  color: #222;\n}\n\n.Scene-module_activityProbe__1S2fj {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 2px;\n  width: 1px;\n}\n";
var styles$i = {"Scene":"Scene-module_Scene__3AYfT","invert":"Scene-module_invert__8TDeu","activityProbe":"Scene-module_activityProbe__1S2fj"};
styleInject(css$i);

var css$j = "\n\n.fadeInBgConceal-module_backdrop__11JGO {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInBgConceal-module_backdropInner__1IAYD {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInBgConceal-module_backdrop__11JGO {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInBgConceal-module_backdrop-below__3E6Uk {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var fadeInBgConceal = {"fade-duration":"0.5s","backdrop":"fadeInBgConceal-module_backdrop__11JGO","backdropInner":"fadeInBgConceal-module_backdropInner__1IAYD","backdrop-below":"fadeInBgConceal-module_backdrop-below__3E6Uk"};
styleInject(css$j);

var css$k = "\n\n.fadeInBgFadeOut-module_backdrop__r0YXp {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInBgFadeOut-module_backdropInner__IQp87 {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInBgFadeOut-module_backdrop__r0YXp .fadeInBgFadeOut-module_backdropInner__IQp87,\n.fadeInBgFadeOut-module_foreground__Q2vkT {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInBgFadeOut-module_foreground-above__3pmz9,\n.fadeInBgFadeOut-module_backdrop-below__2G-Ic .fadeInBgFadeOut-module_backdropInner__IQp87 {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.fadeInBgFadeOut-module_bbackdrop__1thge::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.fadeInBgFadeOut-module_bbackdrop-below__yaeMc::before {\n  visibility: hidden;\n}\n";
var fadeInBgFadeOut = {"fade-duration":"0.5s","backdrop":"fadeInBgFadeOut-module_backdrop__r0YXp","backdropInner":"fadeInBgFadeOut-module_backdropInner__IQp87","foreground":"fadeInBgFadeOut-module_foreground__Q2vkT","foreground-above":"fadeInBgFadeOut-module_foreground-above__3pmz9","backdrop-below":"fadeInBgFadeOut-module_backdrop-below__2G-Ic","bbackdrop":"fadeInBgFadeOut-module_bbackdrop__1thge","bbackdrop-below":"fadeInBgFadeOut-module_bbackdrop-below__yaeMc"};
styleInject(css$k);

var css$l = "\n\n.fadeInBgFadeOutBg-module_backdrop__15ocl {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInBgFadeOutBg-module_backdropInner__sAnz6 {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInBgFadeOutBg-module_boxShadow__xUKyj,\n.fadeInBgFadeOutBg-module_backdrop__15ocl .fadeInBgFadeOutBg-module_backdropInner__sAnz6 {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInBgFadeOutBg-module_boxShadow-above__2bY0E,\n.fadeInBgFadeOutBg-module_backdrop-below__1rDT6 .fadeInBgFadeOutBg-module_backdropInner__sAnz6 {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.fadeInBgFadeOutBg-module_bbackdrop__25Ux-::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.fadeInBgFadeOutBg-module_bbackdrop-below__2MPgj::before {\n  visibility: hidden;\n}\n";
var fadeInBgFadeOutBg = {"fade-duration":"0.5s","backdrop":"fadeInBgFadeOutBg-module_backdrop__15ocl","backdropInner":"fadeInBgFadeOutBg-module_backdropInner__sAnz6","boxShadow":"fadeInBgFadeOutBg-module_boxShadow__xUKyj","boxShadow-above":"fadeInBgFadeOutBg-module_boxShadow-above__2bY0E","backdrop-below":"fadeInBgFadeOutBg-module_backdrop-below__1rDT6","bbackdrop":"fadeInBgFadeOutBg-module_bbackdrop__25Ux-","bbackdrop-below":"fadeInBgFadeOutBg-module_bbackdrop-below__2MPgj"};
styleInject(css$l);

var css$m = "\n\n.fadeInBgScrollOut-module_backdrop__1bSsb {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n\n.fadeInBgScrollOut-module_backdropInner__3JZBG {\n  position: sticky;\n  bottom: 0;\n  width: 100%;\n}\n\n.fadeInBgScrollOut-module_backdropInner2__q-00L {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n}\n\n.fadeInBgScrollOut-module_foreground__1ODH9 {\n  min-height: 100vh;\n}\n\n.fadeInBgScrollOut-module_backdrop__1bSsb {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInBgScrollOut-module_backdrop-below__2Dbkr {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var fadeInBgScrollOut = {"fade-duration":"0.5s","backdrop":"fadeInBgScrollOut-module_backdrop__1bSsb","backdropInner":"fadeInBgScrollOut-module_backdropInner__3JZBG","backdropInner2":"fadeInBgScrollOut-module_backdropInner2__q-00L","foreground":"fadeInBgScrollOut-module_foreground__1ODH9","backdrop-below":"fadeInBgScrollOut-module_backdrop-below__2Dbkr"};
styleInject(css$m);

var css$n = "\n\n.fadeInConceal-module_backdrop__1zaRO {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInConceal-module_backdropInner__1AIvq {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInConceal-module_backdrop__1zaRO,\n.fadeInConceal-module_foreground__3giM9 {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInConceal-module_backdrop-below__AWyQe,\n.fadeInConceal-module_foreground-below__2z5Op {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var fadeInConceal = {"fade-duration":"0.5s","backdrop":"fadeInConceal-module_backdrop__1zaRO","backdropInner":"fadeInConceal-module_backdropInner__1AIvq","foreground":"fadeInConceal-module_foreground__3giM9","backdrop-below":"fadeInConceal-module_backdrop-below__AWyQe","foreground-below":"fadeInConceal-module_foreground-below__2z5Op"};
styleInject(css$n);

var css$o = "\n\n.fadeInFadeOut-module_backdrop__Y4xOA {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInFadeOut-module_backdropInner__1oRfP {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInFadeOut-module_backdrop__Y4xOA .fadeInFadeOut-module_backdropInner__1oRfP,\n.fadeInFadeOut-module_foreground__1eleZ {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInFadeOut-module_foreground-above__249wa,\n.fadeInFadeOut-module_backdrop-below__1h2I4 .fadeInFadeOut-module_backdropInner__1oRfP,\n.fadeInFadeOut-module_foreground-below__3mE6f {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.fadeInFadeOut-module_bbackdrop__WJjFl::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.fadeInFadeOut-module_bbackdrop-below__1Htkz::before {\n  visibility: hidden;\n}\n";
var fadeInFadeOut = {"fade-duration":"0.5s","backdrop":"fadeInFadeOut-module_backdrop__Y4xOA","backdropInner":"fadeInFadeOut-module_backdropInner__1oRfP","foreground":"fadeInFadeOut-module_foreground__1eleZ","foreground-above":"fadeInFadeOut-module_foreground-above__249wa","backdrop-below":"fadeInFadeOut-module_backdrop-below__1h2I4","foreground-below":"fadeInFadeOut-module_foreground-below__3mE6f","bbackdrop":"fadeInFadeOut-module_bbackdrop__WJjFl","bbackdrop-below":"fadeInFadeOut-module_bbackdrop-below__1Htkz"};
styleInject(css$o);

var css$p = "\n\n.fadeInFadeOutBg-module_backdrop__2-IF3 {\n  position: absolute;\n  height: 100%;\n}\n\n.fadeInFadeOutBg-module_backdropInner__3r_bo {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n}\n\n.fadeInFadeOutBg-module_backdrop__2-IF3 .fadeInFadeOutBg-module_backdropInner__3r_bo,\n.fadeInFadeOutBg-module_boxShadow__3x7Ki,\n.fadeInFadeOutBg-module_foreground__24f_M {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInFadeOutBg-module_backdrop-below__4Ys_2 .fadeInFadeOutBg-module_backdropInner__3r_bo,\n.fadeInFadeOutBg-module_boxShadow-above__3T2K5,\n.fadeInFadeOutBg-module_foreground-below__3pTRc {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.fadeInFadeOutBg-module_bbackdrop__MVdvw::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.fadeInFadeOutBg-module_bbackdrop-below__30mpF::before {\n  visibility: hidden;\n}\n";
var fadeInFadeOutBg = {"fade-duration":"0.5s","backdrop":"fadeInFadeOutBg-module_backdrop__2-IF3","backdropInner":"fadeInFadeOutBg-module_backdropInner__3r_bo","boxShadow":"fadeInFadeOutBg-module_boxShadow__3x7Ki","foreground":"fadeInFadeOutBg-module_foreground__24f_M","backdrop-below":"fadeInFadeOutBg-module_backdrop-below__4Ys_2","boxShadow-above":"fadeInFadeOutBg-module_boxShadow-above__3T2K5","foreground-below":"fadeInFadeOutBg-module_foreground-below__3pTRc","bbackdrop":"fadeInFadeOutBg-module_bbackdrop__MVdvw","bbackdrop-below":"fadeInFadeOutBg-module_bbackdrop-below__30mpF"};
styleInject(css$p);

var css$q = "\n\n.fadeInScrollOut-module_backdrop__2FhBb {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n\n.fadeInScrollOut-module_backdropInner__1OfNZ {\n  position: sticky;\n  bottom: 0;\n  width: 100%;\n}\n\n.fadeInScrollOut-module_backdropInner2__5bNPT {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n}\n\n.fadeInScrollOut-module_foreground__3h0EX {\n  min-height: 100vh;\n}\n\n.fadeInScrollOut-module_backdrop__2FhBb,\n.fadeInScrollOut-module_foreground__3h0EX {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.fadeInScrollOut-module_backdrop-below__3cRLH,\n.fadeInScrollOut-module_foreground-below__1Jcql {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var fadeInScrollOut = {"fade-duration":"0.5s","backdrop":"fadeInScrollOut-module_backdrop__2FhBb","backdropInner":"fadeInScrollOut-module_backdropInner__1OfNZ","backdropInner2":"fadeInScrollOut-module_backdropInner2__5bNPT","foreground":"fadeInScrollOut-module_foreground__3h0EX","backdrop-below":"fadeInScrollOut-module_backdrop-below__3cRLH","foreground-below":"fadeInScrollOut-module_foreground-below__1Jcql"};
styleInject(css$q);

var css$r = ".revealConceal-module_backdrop__dLUhU {\n  position: absolute;\n  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);\n  height: 100%;\n}\n\n.revealConceal-module_backdropInner__2k1Z- {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n";
var revealConceal = {"backdrop":"revealConceal-module_backdrop__dLUhU","backdropInner":"revealConceal-module_backdropInner__2k1Z-"};
styleInject(css$r);

var css$s = "\n\n.revealFadeOut-module_backdrop___Q1QF {\n  position: absolute;\n  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);\n  height: 200%;\n}\n\n.revealFadeOut-module_backdropInner__17qRn {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n\n.revealFadeOut-module_foreground__1GzBs {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.revealFadeOut-module_foreground-above__3GxOf {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var revealFadeOut = {"fade-duration":"0.5s","backdrop":"revealFadeOut-module_backdrop___Q1QF","backdropInner":"revealFadeOut-module_backdropInner__17qRn","foreground":"revealFadeOut-module_foreground__1GzBs","foreground-above":"revealFadeOut-module_foreground-above__3GxOf"};
styleInject(css$s);

var css$t = "\n\n.revealFadeOutBg-module_backdrop__30OCF {\n  position: absolute;\n  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);\n  height: 200%;\n}\n\n.revealFadeOutBg-module_backdropInner__3v3tM {\n  position: fixed;\n  top: 0;\n  height: 100vh;\n  width: 100%;\n\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n\n.revealFadeOutBg-module_boxShadow__1NZRz {\n  transition: opacity 1s ease, visibility 1s;\n}\n\n.revealFadeOutBg-module_boxShadow-above__2r4ov {\n  opacity: 0;\n  visibility: hidden;\n}\n";
var revealFadeOutBg = {"fade-duration":"0.5s","backdrop":"revealFadeOutBg-module_backdrop__30OCF","backdropInner":"revealFadeOutBg-module_backdropInner__3v3tM","boxShadow":"revealFadeOutBg-module_boxShadow__1NZRz","boxShadow-above":"revealFadeOutBg-module_boxShadow-above__2r4ov"};
styleInject(css$t);

var css$u = ".revealScrollOut-module_backdrop__2yOXd {\n  position: absolute;\n  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);\n  top: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n\n.revealScrollOut-module_backdropInner__211p3 {\n  position: sticky;\n  bottom: 0;\n  width: 100%;\n\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n\n.revealScrollOut-module_backdropInner2__v6WqM {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n}\n\n.revealScrollOut-module_foreground__3z-hw {\n}\n";
var revealScrollOut = {"backdrop":"revealScrollOut-module_backdrop__2yOXd","backdropInner":"revealScrollOut-module_backdropInner__211p3","backdropInner2":"revealScrollOut-module_backdropInner2__v6WqM","foreground":"revealScrollOut-module_foreground__3z-hw"};
styleInject(css$u);

var css$v = ".scrollInConceal-module_backdrop__2OJJC {\n  position: sticky;\n  top: 0;\n  height: 0;\n}\n";
var scrollInConceal = {"backdrop":"scrollInConceal-module_backdrop__2OJJC"};
styleInject(css$v);

var css$w = "\n\n.scrollInFadeOut-module_backdrop__1vXJd {\n  position: sticky;\n  top: 0;\n  height: 0;\n}\n\n.scrollInFadeOut-module_foreground__3Ikxb {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.scrollInFadeOut-module_foreground-above__6ipm- {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.scrollInFadeOut-module_bbackdrop__2C-bf::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.scrollInFadeOut-module_bbackdrop-below__3tq0M::before {\n  visibility: hidden;\n}\n";
var scrollInFadeOut = {"fade-duration":"0.5s","backdrop":"scrollInFadeOut-module_backdrop__1vXJd","foreground":"scrollInFadeOut-module_foreground__3Ikxb","foreground-above":"scrollInFadeOut-module_foreground-above__6ipm-","bbackdrop":"scrollInFadeOut-module_bbackdrop__2C-bf","bbackdrop-below":"scrollInFadeOut-module_bbackdrop-below__3tq0M"};
styleInject(css$w);

var css$x = "\n\n.scrollInFadeOutBg-module_backdrop__zw95c {\n  position: sticky;\n  top: 0;\n  height: 0;\n}\n\n.scrollInFadeOutBg-module_boxShadow__3UxCQ {\n  transition: opacity 0.5s ease, visibility 0.5s;\n}\n\n.scrollInFadeOutBg-module_boxShadow-above__3kfau {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.scrollInFadeOutBg-module_bbackdrop__2pO9o::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: #000;\n}\n\n.scrollInFadeOutBg-module_bbackdrop-below__1Ky2w::before {\n  visibility: hidden;\n}\n";
var scrollInFadeOutBg = {"fade-duration":"0.5s","backdrop":"scrollInFadeOutBg-module_backdrop__zw95c","boxShadow":"scrollInFadeOutBg-module_boxShadow__3UxCQ","boxShadow-above":"scrollInFadeOutBg-module_boxShadow-above__3kfau","bbackdrop":"scrollInFadeOutBg-module_bbackdrop__2pO9o","bbackdrop-below":"scrollInFadeOutBg-module_bbackdrop-below__1Ky2w"};
styleInject(css$x);

var css$y = ".scrollInScrollOut-module_backdrop__XzCge {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n}\n\n.scrollInScrollOut-module_foreground__1yyY8 {\n  margin-top: -100vh;\n}\n";
var scrollInScrollOut = {"backdrop":"scrollInScrollOut-module_backdrop__XzCge","foreground":"scrollInScrollOut-module_foreground__1yyY8"};
styleInject(css$y);

var styles$j = {
  fadeInBgConceal: fadeInBgConceal,
  fadeInBgFadeOut: fadeInBgFadeOut,
  fadeInBgFadeOutBg: fadeInBgFadeOutBg,
  fadeInBgScrollOut: fadeInBgScrollOut,
  fadeInConceal: fadeInConceal,
  fadeInFadeOut: fadeInFadeOut,
  fadeInFadeOutBg: fadeInFadeOutBg,
  fadeInScrollOut: fadeInScrollOut,
  revealConceal: revealConceal,
  revealFadeOut: revealFadeOut,
  revealFadeOutBg: revealFadeOutBg,
  revealScrollOut: revealScrollOut,
  scrollInConceal: scrollInConceal,
  scrollInFadeOut: scrollInFadeOut,
  scrollInFadeOutBg: scrollInFadeOutBg,
  scrollInScrollOut: scrollInScrollOut
};
var enterTransitions = {
  fade: 'fadeIn',
  fadeBg: 'fadeInBg',
  scroll: 'scrollIn',
  scrollOver: 'scrollIn',
  reveal: 'reveal',
  beforeAfter: 'reveal'
};
var exitTransitions = {
  fade: 'fadeOut',
  fadeBg: 'fadeOutBg',
  scroll: 'scrollOut',
  scrollOver: 'conceal',
  reveal: 'scrollOut',
  beforeAfter: 'conceal'
};
function getTransitionStyles(scene, previousScene, nextScene) {
  var enterTransition = enterTransitions[scene.transition];
  var exitTransition = exitTransitions[nextScene ? nextScene.transition : 'scroll'];
  var name = "".concat(enterTransition).concat(capitalize(exitTransition));

  if (!styles$j[name]) {
    throw new Error("Unknown transition ".concat(name));
  }

  return styles$j[name];
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function NoOpShadow(props) {
  return React.createElement("div", null, props.children);
}

var css$z = ".GradientShadow-module_shadow__2UiDH {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  z-index: 1;\n  transition: opacity 1s ease;\n}\n\n.GradientShadow-module_align-right__3iXZs .GradientShadow-module_shadow__2UiDH,\n.GradientShadow-module_align-left__3qcNM .GradientShadow-module_shadow__2UiDH {\n  background: linear-gradient(to right, #000 0%,rgba(0, 0, 0, 0) 100%);\n}\n\n@media (min-width: 950px) {\n  .GradientShadow-module_align-right__3iXZs .GradientShadow-module_shadow__2UiDH {\n    background: linear-gradient(to left, #000 0%,rgba(0, 0, 0, 0) 100%);\n  }\n}\n\n.GradientShadow-module_intersecting__h6vpz .GradientShadow-module_shadow__2UiDH,\n.GradientShadow-module_align-center__2C7cl .GradientShadow-module_shadow__2UiDH {\n  background: #000;\n}\n";
var styles$k = {"shadow":"GradientShadow-module_shadow__2UiDH","align-right":"GradientShadow-module_align-right__3iXZs","align-left":"GradientShadow-module_align-left__3qcNM","intersecting":"GradientShadow-module_intersecting__h6vpz","align-center":"GradientShadow-module_align-center__2C7cl"};
styleInject(css$z);

function GradientShadow(props) {
  var maxOpacityOverlap = props.motifAreaRect.height / 2;
  var motifAreaOverlap = Math.min(maxOpacityOverlap, props.motifAreaRect.bottom - props.contentAreaRect.top);
  var opacityFactor = props.intersecting && props.motifAreaRect.height > 0 ? motifAreaOverlap / maxOpacityOverlap : 1;
  return React.createElement("div", {
    className: classnames(styles$k.root, styles$k["align-".concat(props.align)], _defineProperty({}, styles$k.intersecting, props.intersecting))
  }, React.createElement("div", {
    className: styles$k.shadow,
    style: {
      opacity: props.opacity * Math.round(opacityFactor * 10) / 10
    }
  }), props.children);
}
GradientShadow.defaultProps = {
  opacity: 0.7,
  align: 'left'
};

function NoOpBoxWrapper(props) {
  return React.createElement("div", null, props.children);
}

var css$A = ".GradientBox-module_wrapper__1Jj7N {\n  padding-bottom: 50px;\n}\n\n.GradientBox-module_shadow__2XilX {\n  --background: rgba(0, 0, 0, 0.7);\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  pointer-events: none;\n}\n\n.GradientBox-module_long__10s6v .GradientBox-module_shadow__2XilX {\n  bottom: -100vh;\n}\n\n.GradientBox-module_gradient__31tJ- {\n  text-shadow: 0px 1px 5px black;\n}\n\n.GradientBox-module_gradient__31tJ- .GradientBox-module_shadow__2XilX {\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0px,rgba(0, 0, 0, 0.3) 100px,rgba(0, 0, 0, 0.3) 100%);\n}\n\n.GradientBox-module_content__96lDk {\n  position: relative;\n}\n";
var styles$l = {"wrapper":"GradientBox-module_wrapper__1Jj7N","shadow":"GradientBox-module_shadow__2XilX","long":"GradientBox-module_long__10s6v","gradient":"GradientBox-module_gradient__31tJ-","content":"GradientBox-module_content__96lDk"};
styleInject(css$A);

function GradientBox(props) {
  var _classNames;

  var padding = props.active ? props.padding : 0;
  return React.createElement("div", {
    className: classnames(styles$l.root, (_classNames = {}, _defineProperty(_classNames, styles$l.gradient, padding > 0), _defineProperty(_classNames, styles$l["long"], props.coverInvisibleNextScene), _classNames)),
    style: {
      paddingTop: padding
    }
  }, React.createElement("div", {
    className: styles$l.wrapper
  }, React.createElement("div", {
    className: classnames(styles$l.shadow, props.transitionStyles.boxShadow, props.transitionStyles["boxShadow-".concat(props.state)]),
    style: {
      top: padding,
      opacity: props.opacity
    }
  }), React.createElement("div", {
    className: styles$l.content
  }, props.children)));
}
GradientBox.defaultProps = {
  opacity: 1
};

var css$B = ".CardBox-module_wrapper__3vnaH {\n}\n\n.CardBox-module_content__36v7J {\n  position: relative;\n}\n";
var styles$m = {"wrapper":"CardBox-module_wrapper__3vnaH","content":"CardBox-module_content__36v7J"};
styleInject(css$B);

function CardBox(props) {
  var padding = props.active ? props.padding : 0;
  return React.createElement("div", {
    style: {
      paddingTop: padding
    }
  }, React.createElement("div", {
    className: styles$m.wrapper
  }, React.createElement("div", {
    style: {
      top: padding
    }
  }), React.createElement("div", {
    className: styles$m.content
  }, props.children)));
}

var css$C = ".CardBoxWrapper-module_cardBg__154o2 {\n  background: white;\n  color: black;\n  padding: 4%;\n  margin: 0 -4% 50px 0;\n  border-radius: 15px;\n  opacity: 1;\n}\n";
var styles$n = {"cardBg":"CardBoxWrapper-module_cardBg__154o2"};
styleInject(css$C);

function CardBoxWrapper(props) {
  return React.createElement("div", {
    className: styles$n.cardBg
  }, props.children);
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var OnScreenContext = React.createContext({
  center: false,
  top: false,
  bottom: false
});
function Scene(props) {
  var activityProbeRef = useRef();
  useOnScreen(activityProbeRef, '-50% 0px -50% 0px', props.onActivate);
  var ref = useRef();
  var onScreen = useOnScreen(ref, '0px 0px 0px 0px');
  useScrollTarget(ref, props.isScrollTarget);
  var motifAreaRef = useRef();
  var contentAreaRef = useRef();
  var motifAreaRect = useBoundingClientRect(motifAreaRef);
  var motifAreaDimension = useDimension(motifAreaRef);
  var contentAreaRect = useBoundingClientRect(contentAreaRef, props.layout);
  var intersecting = isIntersectingX(motifAreaRect, contentAreaRect);
  var contentAreaRect2 = useBoundingClientRect(contentAreaRef, intersecting);
  var heightOffset = 0; //(props.backdrop.first || props.transition === 'scrollOver') ? 0 : (window.innerHeight / 3);

  var transitionStyles = getTransitionStyles(props, props.previousScene, props.nextScene);
  var appearance = {
    shadow: {
      background: GradientShadow,
      foreground: GradientBox,
      foregroundWrapper: NoOpBoxWrapper
    },
    transparent: {
      background: NoOpShadow,
      foreground: CardBox,
      foregroundWrapper: NoOpBoxWrapper
    },
    cards: {
      background: NoOpShadow,
      foreground: CardBox,
      foregroundWrapper: CardBoxWrapper
    }
  }[props.appearance || 'shadow'];
  var Shadow = appearance.background;
  var Box = appearance.foreground;
  var BoxWrapper = appearance.foregroundWrapper;
  return React.createElement("section", {
    ref: ref,
    className: classnames(styles$i.Scene, transitionStyles.scene, _defineProperty({}, styles$i.invert, props.invert))
  }, React.createElement("div", {
    ref: activityProbeRef,
    className: styles$i.activityProbe
  }), React.createElement(Backdrop, Object.assign({}, props.backdrop, {
    editMode: props.editMode,
    motifAreaRef: motifAreaRef,
    onScreen: onScreen,
    offset: Math.max(0, Math.max(1, -contentAreaRect.top / 200)),
    state: props.state,
    transitionStyles: transitionStyles,
    nextSceneOnEnd: props.nextSceneOnEnd,
    interactive: props.interactiveBackdrop
  }), function (children) {
    return props.interactiveBackdrop ? children : React.createElement(Shadow, {
      align: props.layout,
      intersecting: intersecting,
      opacity: props.shadowOpacity >= 0 ? props.shadowOpacity / 100 : 0.7,
      motifAreaRect: motifAreaRect,
      contentAreaRect: contentAreaRect2
    }, children);
  }), React.createElement(Foreground, {
    transitionStyles: transitionStyles,
    hidden: props.interactiveBackdrop,
    disableEnlarge: props.disableEnlarge,
    state: props.state,
    heightMode: heightMode(props)
  }, React.createElement(Box, {
    active: intersecting,
    coverInvisibleNextScene: props.nextScene && props.nextScene.transition.startsWith('fade'),
    transitionStyles: transitionStyles,
    state: props.state,
    padding: Math.max(0, motifAreaDimension.top + motifAreaDimension.height - heightOffset),
    opacity: props.shadowOpacity
  }, React.createElement(Layout, {
    items: indexItems(props.foreground),
    appearance: props.appearance,
    contentAreaRef: contentAreaRef,
    layout: props.layout,
    onPositionChange: props.onForgroundItemPositionChange
  }, function (children) {
    return React.createElement(BoxWrapper, null, children);
  }), renderAddSelect(props), React.createElement("button", {
    onClick: props.onReset
  }, "Abschnitt leeren"))));
}

function indexItems(items) {
  return items.map(function (item, index) {
    return _objectSpread$1({}, item, {
      index: index
    });
  });
}

function heightMode(props) {
  if (props.fullHeight) {
    if (props.transition.startsWith('fade') || props.nextScene && props.nextScene.transition.startsWith('fade')) {
      return 'fullFade';
    } else {
      return 'full';
    }
  }

  return 'dynamic';
}

function renderAddSelect(props) {
  return React.createElement("select", {
    value: "blank",
    onChange: function onChange(event) {
      return props.onAdd(event.target.value);
    }
  }, React.createElement("option", {
    value: "blank"
  }, "(Hinzuf\xFCgen)"), Object.keys(foregroundItemTemplates).map(function (key) {
    return React.createElement("option", {
      key: key,
      value: key
    }, foregroundItemTemplates[key].name);
  }));
}

var css$D = ".EditableScene-module_root__1aCEK {\n  position: relative;\n}\n\n.EditableScene-module_showBorder__31SLY::before {\n  z-index: 3;\n  content: \"\";\n  position: absolute;\n  top: 0;\n  width: 100%;\n  left: 0;\n  border-top: dashed 1px #fff;\n}\n\n.EditableScene-module_heightSelect__2PN3R {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  z-index: 3;\n}\n\n.EditableScene-module_transitionSelect__2V1Ah {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n\n.EditableScene-module_hideControls__iAfJn select,\n.EditableScene-module_hideControls__iAfJn button {\n  display: none;\n}\n";
var styles$o = {"root":"EditableScene-module_root__1aCEK","showBorder":"EditableScene-module_showBorder__31SLY","heightSelect":"EditableScene-module_heightSelect__2PN3R","transitionSelect":"EditableScene-module_transitionSelect__2V1Ah","hideControls":"EditableScene-module_hideControls__iAfJn"};
styleInject(css$D);

function EditableScene(props) {
  var _classNames;

  return React.createElement("div", {
    className: classnames(styles$o.root, (_classNames = {}, _defineProperty(_classNames, styles$o.showBorder, props.editMode && props.transition.startsWith('fade')), _defineProperty(_classNames, styles$o.hideControls, !props.editMode), _classNames))
  }, React.createElement(Scene, props), React.createElement("div", {
    className: styles$o.heightSelect
  }, renderModeSelect(props), renderBgSelect(props), renderShadowOpacitySelect(props), renderForegroundLayoutSelect(props)), renderTransitionSelect(props));
}

function renderModeSelect(props) {
  return React.createElement("select", {
    value: props.fullHeight ? 'full' : 'dynamic',
    onChange: function onChange(event) {
      return props.onConfigChange({
        fullHeight: event.target.value === 'full'
      });
    }
  }, React.createElement("option", {
    value: "dynamic"
  }, "Dynamische H\xF6he"), React.createElement("option", {
    value: "full"
  }, "Volle H\xF6he"));
}

function renderBgSelect(props) {
  return React.createElement("select", {
    value: props.backdrop.image,
    onChange: function onChange(event) {
      return props.onConfigChange({
        backdropImage: event.target.value
      });
    }
  }, Object.keys(images).concat(['#000', '#fff']).map(function (id) {
    return React.createElement("option", {
      key: id,
      value: id
    }, id);
  }));
}

function renderShadowOpacitySelect(props) {
  return React.createElement("select", {
    value: props.shadowOpacity >= 0 ? props.shadowOpacity.toString() : "70",
    onChange: function onChange(event) {
      return props.onConfigChange({
        shadowOpacity: parseInt(event.target.value, 10)
      });
    }
  }, [0, 20, 50, 70].map(function (percent) {
    return React.createElement("option", {
      key: percent.toString(),
      value: percent.toString()
    }, percent, "%");
  }));
}

function renderForegroundLayoutSelect(props) {
  return React.createElement("select", {
    value: props.layout,
    onChange: function onChange(event) {
      return props.onConfigChange({
        layout: event.target.value
      });
    }
  }, React.createElement("option", {
    value: "left"
  }, "Links"), React.createElement("option", {
    value: "right"
  }, "Rechts"), React.createElement("option", {
    value: "center"
  }, "Mittig"));
}

function renderTransitionSelect(props) {
  if (props.previousScene) {
    var options = [{
      value: 'scroll',
      name: 'Scroll'
    }, {
      value: 'scrollOver',
      name: 'Scroll Over'
    }, {
      value: 'reveal',
      name: 'Reveal'
    }, {
      value: 'beforeAfter',
      name: 'Before/After'
    }];

    if (props.fullHeight && props.previousScene.fullHeight) {
      options = [].concat(_toConsumableArray(options), [{
        value: 'fade',
        name: 'Fade'
      }, {
        value: 'fadeBg',
        name: 'Fade Background'
      }]);
    }

    return React.createElement("select", {
      className: styles$o.transitionSelect,
      value: props.transition,
      onChange: function onChange(event) {
        return props.onConfigChange({
          transition: event.target.value
        });
      }
    }, options.map(function (option) {
      return React.createElement("option", {
        key: option.value,
        value: option.value
      }, option.name);
    }));
  }
}

var css$E = "\n\n.Entry-module_Entry__1nDGh {\n  font-family: 'Source Sans Pro', sans-serif;\n  background-color: #000;\n  color: #fff;\n}\n\n.Entry-module_exampleSelect__1uAJs {\n  position: absolute;\n  top: 5px;\n  left: 50%;\n  z-index: 10;\n  transform: translateX(-50%);\n}\n";
var styles$p = {"font-sans":"'Source Sans Pro', sans-serif","Entry":"Entry-module_Entry__1nDGh","exampleSelect":"Entry-module_exampleSelect__1uAJs"};
styleInject(css$E);

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var MutedContextConsumer = MutedContext.Consumer;
var fragment = window.location.hash.replace('#', '');
var localStorageKey = "scene".concat(fragment);

window.exportExample = function () {
  console.log(JSON.stringify(JSON.parse(localStorage[localStorageKey]), null, 2));
};

function Entry(props) {
  var editMode = window.location.search.indexOf('edit') >= 0;

  var _useState = useState(fragment && localStorage[localStorageKey] ? JSON.parse(localStorage[localStorageKey]) : props.examples[props.defaultExample]),
      _useState2 = _slicedToArray(_useState, 2),
      scenes = _useState2[0],
      setScenes = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      currentSceneIndex = _useState4[0],
      setCurrentSceneIndex = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      scrollTargetSceneIndex = _useState6[0],
      setScrollTargetSceneIndex = _useState6[1];

  var _useState7 = useState(true),
      _useState8 = _slicedToArray(_useState7, 2),
      muted = _useState8[0],
      setMuted = _useState8[1];

  function scrollToScene(index) {
    if (index === 'next') {
      index = currentSceneIndex + 1;
    }

    setScrollTargetSceneIndex(index);
  }

  return React.createElement("div", {
    className: styles$p.Entry
  }, React.createElement(MutedContext.Provider, {
    value: {
      muted: muted,
      setMuted: setMuted
    }
  }, React.createElement(ScrollToSceneContext.Provider, {
    value: scrollToScene
  }, renderExamplesSelect(props, setScenes, editMode), renderScenes(scenes, currentSceneIndex, setCurrentSceneIndex, scrollTargetSceneIndex, setScrollTargetSceneIndex, setScenes, editMode))));
}

function renderExamplesSelect(props, setScenes, editMode) {
  if (editMode) {
    return React.createElement("select", {
      className: styles$p.exampleSelect,
      value: "blank",
      onChange: function onChange(event) {
        return updateAndStoreScenes(setScenes, function () {
          return props.examples[event.target.value];
        });
      }
    }, React.createElement("option", {
      key: "blank",
      value: "blank"
    }, "(Beispiel laden)"), Object.keys(props.examples).map(function (key) {
      return React.createElement("option", {
        key: key,
        value: key
      }, key);
    }));
  }
}

function renderScenes(scenes, currentSceneIndex, setCurrentSceneIndex, scrollTargetSceneIndex, setScrollTargetSceneIndex, setScenes, editMode) {
  function updateScene(index, properties) {
    var scene = scenes[index];
    var nextScene = scenes[index + 1];
    var nextSceneProperties = {};

    if (properties.fullHeight === false && scene.fullHeight) {
      if (['fade'].indexOf(scene.transition) >= 0) {
        properties = _objectSpread$2({}, properties, {
          transition: 'scroll'
        });
      }

      if (['fade'].indexOf(nextScene.transition) >= 0) {
        nextSceneProperties = {
          transition: 'scroll'
        };
      }
    }

    if (properties.backdropImage) {
      properties = {
        invert: properties.backdropImage === '#fff',
        backdrop: _objectSpread$2({}, scene.backdrop, {
          image: properties.backdropImage
        })
      };
    }

    updateScenes(function (scenes) {
      return [].concat(_toConsumableArray(scenes.slice(0, index)), [_objectSpread$2({}, scene, {}, properties), nextScene && _objectSpread$2({}, nextScene, {}, nextSceneProperties)], _toConsumableArray(scenes.slice(index + 2))).filter(Boolean);
    });
  }

  function addItem(index, type) {
    var scene = scenes[index];
    var properties = {
      foreground: [].concat(_toConsumableArray(scene.foreground), [{
        type: type
      }])
    };
    updateScenes(function (scenes) {
      return [].concat(_toConsumableArray(scenes.slice(0, index)), [_objectSpread$2({}, scene, {}, properties)], _toConsumableArray(scenes.slice(index + 1))).filter(Boolean);
    });
  }

  function updateForegroundItemPosition(index, itemIndex, position) {
    var scene = scenes[index];
    var properties = {
      foreground: [].concat(_toConsumableArray(scene.foreground.slice(0, itemIndex)), [_objectSpread$2({}, scene.foreground[itemIndex], {
        position: position
      })], _toConsumableArray(scene.foreground.slice(itemIndex + 1)))
    };
    updateScenes(function (scenes) {
      return [].concat(_toConsumableArray(scenes.slice(0, index)), [_objectSpread$2({}, scene, {}, properties)], _toConsumableArray(scenes.slice(index + 1))).filter(Boolean);
    });
  }

  function resetItems(index, type) {
    var scene = scenes[index];
    var properties = {
      foreground: []
    };
    updateScenes(function (scenes) {
      return [].concat(_toConsumableArray(scenes.slice(0, index)), [_objectSpread$2({}, scene, {}, properties)], _toConsumableArray(scenes.slice(index + 1))).filter(Boolean);
    });
  }

  function updateScenes(fn) {
    updateAndStoreScenes(setScenes, fn);
  }

  function _onActivate(index) {
    setCurrentSceneIndex(index);
    setScrollTargetSceneIndex(null);
  }

  return scenes.map(function (scene, index) {
    var previousScene = scenes[index - 1];
    var nextScene = scenes[index + 1];
    return React.createElement(EditableScene, Object.assign({
      key: index,
      state: index > currentSceneIndex ? 'below' : index < currentSceneIndex ? 'above' : 'active',
      isScrollTarget: index === scrollTargetSceneIndex,
      onActivate: function onActivate() {
        return _onActivate(index);
      },
      onAdd: function onAdd(type) {
        return addItem(index, type);
      },
      onForgroundItemPositionChange: function onForgroundItemPositionChange(itemIndex, position) {
        return updateForegroundItemPosition(index, itemIndex, position);
      },
      onReset: function onReset(type) {
        return resetItems(index);
      },
      onConfigChange: function onConfigChange(attribute) {
        return updateScene(index, attribute);
      }
    }, scene, {
      previousScene: previousScene,
      nextScene: nextScene,
      editMode: editMode
    }));
  });
}

function updateAndStoreScenes(setScenes, fn) {
  setScenes(function (scenes) {
    var newScenes = fn(scenes);
    localStorage[localStorageKey] = JSON.stringify(newScenes);
    return newScenes;
  });
}

var example = [{
  transition: 'scroll',
  fullHeight: true,
  backdrop: {
    image: 'wasser'
  },
  foreground: [{
    type: 'presentationIntroductionHeading',
    props: {
      first: true
    }
  }, {
    type: 'soundDisclaimer'
  }, {
    type: 'presentationIntroductionText'
  }]
}, {
  transition: 'reveal',
  fullHeight: true,
  appearance: 'transparent',
  backdrop: {
    image: 'boot'
  },
  foreground: [{
    type: 'presentationSceneTransitionsHeading'
  }, {
    type: 'presentationSceneTransitionsRevealText'
  }]
}, {
  transition: 'scrollOver',
  fullHeight: true,
  appearance: 'cards',
  layout: "center",
  backdrop: {
    image: 'fisch'
  },
  foreground: [{
    type: 'presentationSceneTransitionsScrollOverText'
  }]
}, {
  transition: 'scrollOver',
  fullHeight: false,
  appearance: 'transparent',
  layout: "left",
  invert: true,
  backdrop: {
    image: '#fff'
  },
  foreground: [{
    type: 'presentationShortSceneHeading'
  }, {
    type: 'presentationShortSceneBeforeText'
  }]
}, {
  transition: 'reveal',
  fullHeight: false,
  appearance: 'transparent',
  layout: "right",
  backdrop: {
    image: 'schildkroete'
  },
  foreground: [{
    type: 'shortSceneSpacer'
  }]
}, {
  transition: 'scrollOver',
  fullHeight: false,
  appearance: 'transparent',
  invert: true,
  layout: "right",
  backdrop: {
    image: '#fff'
  },
  foreground: [{
    type: 'presentationShortSceneAfterText'
  }]
}, {
  transition: 'scrollOver',
  fullHeight: false,
  appearance: 'cards',
  layout: "left",
  backdrop: {
    image: 'strandTouristen'
  },
  foreground: [{
    type: 'presentationFadeText1'
  }]
}, {
  transition: 'fadeBg',
  fullHeight: false,
  appearance: 'cards',
  layout: "right",
  backdrop: {
    image: 'strandDrohne'
  },
  foreground: [{
    type: 'presentationFadeText2'
  }]
}, {
  transition: 'reveal',
  fullHeight: true,
  appearance: 'shadow',
  layout: "right",
  backdrop: {
    image: 'videoGarzweilerLoop1'
  },
  foreground: [{
    type: 'presentationMediaHeading'
  }, {
    type: 'presentationMediaVideosText1'
  }]
}, {
  transition: 'scroll',
  fullHeight: false,
  appearance: 'transparent',
  layout: "right",
  backdrop: {
    image: '#000'
  },
  foreground: [{
    type: 'inlineVideoFullWidth',
    position: 'full',
    autoplay: true
  }]
}, {
  transition: 'scroll',
  fullHeight: true,
  appearance: 'shadow',
  layout: "right",
  backdrop: {
    image: 'braunkohleBackground1'
  },
  foreground: [{
    type: 'presentationMediaInlineHeading'
  }, {
    type: 'presentationMediaImagesText1'
  }, {
    type: 'presentationMediaInlineImage1',
    position: 'inline',
    props: {
      caption: 'Dies ist ein Inline-Bild mit Bild-Unterschrift'
    }
  }, {
    type: 'presentationMediaImagesText2'
  }, {
    type: 'inlineVideoDrone',
    autoplay: true
  }, {
    type: 'presentationMediaImagesText3'
  }]
}, {
  transition: 'fadeBg',
  fullHeight: true,
  appearance: 'shadow',
  layout: "right",
  backdrop: {
    image: 'braunkohleBackground2'
  },
  foreground: [{
    type: 'presentationMediaImagesText4'
  }, {
    type: 'presentationMediaStickyImage1',
    position: 'sticky',
    props: {
      caption: 'Dies ist ein sticky image'
    }
  }, {
    type: 'presentationMediaImagesText5'
  }, {
    type: 'presentationMediaImagesText6'
  }, {
    type: 'presentationMediaImagesText7'
  }, {
    type: 'loremIpsum3',
    props: {
      dummy: true
    }
  }, {
    type: 'presentationMediaStickyImage2',
    position: 'sticky'
  }, {
    type: 'loremIpsum1',
    props: {
      dummy: true
    }
  }, {
    type: 'loremIpsum2',
    props: {
      dummy: true
    }
  }, {
    type: 'loremIpsum3',
    props: {
      dummy: true
    }
  }, {
    type: 'presentationMediaStickyImage3',
    position: 'sticky'
  }, {
    type: 'loremIpsum1',
    props: {
      dummy: true
    }
  }, {
    type: 'loremIpsum2',
    props: {
      dummy: true
    }
  }, {
    type: 'loremIpsum3',
    props: {
      dummy: true
    }
  }]
}, {
  transition: 'scroll',
  fullHeight: true,
  layout: "right",
  backdrop: {
    image: 'braunkohleBaggerSelfie'
  },
  foreground: [{
    type: 'presentationHeadSolutionHeading'
  }, {
    type: 'presentationHeadSolutionText'
  }]
}, {
  transition: 'beforeAfter',
  fullHeight: false,
  appearance: 'transparent',
  layout: "center",
  backdrop: {
    image: '#000'
  },
  foreground: [{
    type: 'presentationBeforeAfterHeading'
  }, {
    type: 'presentationBeforeAfterText'
  }]
}, {
  transition: 'scroll',
  fullHeight: false,
  appearance: 'transparent',
  layout: "center",
  backdrop: {
    image: '#000'
  },
  foreground: [{
    type: 'inlineBeforeAfter',
    position: 'full',
    leftImageLabel: 'Hier kann Text zum "Vorher"-Bild angegeben werden',
    rightImageLabel: 'Hier kann Text zum "Nachher"-Bild angegeben werden (#11)'
  }]
}, {
  transition: 'scroll',
  fullHeight: false,
  appearance: 'transparent',
  layout: "center",
  invert: true,
  backdrop: {
    image: '#fff'
  },
  foreground: [{
    type: 'presentationScrollmationHeading'
  }, {
    type: 'presentationScrollmationText1'
  }]
}, {
  transition: 'reveal',
  fullHeight: false,
  layout: "right",
  appearance: 'cards',
  backdrop: {
    image: 'presentationScrollmation1Desktop',
    imageMobile: 'presentationScrollmation1Mobile'
  },
  foreground: [{
    type: 'presentationScrollmationText2'
  }]
}, {
  transition: 'fadeBg',
  fullHeight: false,
  layout: "right",
  appearance: 'cards',
  backdrop: {
    image: 'presentationScrollmation2Desktop',
    imageMobile: 'presentationScrollmation2Mobile'
  },
  foreground: [{
    type: 'presentationScrollmationText3'
  }]
}, {
  transition: 'fadeBg',
  fullHeight: false,
  layout: "right",
  appearance: 'cards',
  backdrop: {
    image: 'presentationScrollmation3Desktop',
    imageMobile: 'presentationScrollmation3Mobile'
  },
  foreground: []
}, {
  transition: 'beforeAfter',
  fullHeight: true,
  appearance: 'shadow',
  layout: "left",
  backdrop: {
    image: 'presentationFeedbackBg'
  },
  foreground: [{
    type: 'presentationFeedbackHeading'
  }, {
    type: 'presentationFeedbackText'
  }]
}];

var css$F = "body {\n  margin: 0;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n";
styleInject(css$F);

var examples = {
  example: example
};
function Example() {
  return React.createElement(Entry, {
    examples: examples,
    defaultExample: "example"
  });
}
ReactDOM.render(React.createElement(Example, null), document.getElementById('root'));

export default Example;
