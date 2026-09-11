this.pageflow = this.pageflow || {};
this.pageflow.react = (function (React$1, Backbone, ReactDOM, pageflow$1) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;
  pageflow$1 = pageflow$1 && pageflow$1.hasOwnProperty('default') ? pageflow$1['default'] : pageflow$1;

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 1, {
      get: function () {
        return 7;
      }
    })[1] != 7;
  });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject(document$1) && isObject(document$1.createElement);
  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () {
        return 7;
      }
    }).a != 7;
  });

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    }
    return it;
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) {/* empty */}
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f
  };

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return RegExp(s, f);
  }
  var UNSUPPORTED_Y = fails(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });
  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  var regexpStickyHelpers = {
  	UNSUPPORTED_Y: UNSUPPORTED_Y,
  	BROKEN_CARET: BROKEN_CARET
  };

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;

  // `RegExp.prototype.flags` getter
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$1)) {
    objectDefineProperty.f(RegExp.prototype, 'flags', {
      configurable: true,
      get: regexpFlags
    });
  }

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
    1: 2
  }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$1
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;
  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings


  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) {/* empty */}
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$2
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    }
    return value;
  };

  var SHARED = '__core-js_shared__';
  var store = global_1[SHARED] || setGlobal(SHARED, {});
  var sharedStore = store;

  var functionToString = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }
  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;
  var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.5',
    mode:  'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var postfix = Math.random();
  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');
  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$2 = global_1.WeakMap;
  var set, get, has$1;
  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };
  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      }
      return state;
    };
  };
  if (nativeWeakMap) {
    var store$1 = new WeakMap$2();
    var wmget = store$1.get;
    var wmhas = store$1.has;
    var wmset = store$1.set;
    set = function (it, metadata) {
      wmset.call(store$1, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store$1, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store$1, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }
  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(String).split('String');
  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1) {
      if (simple) O[key] = value;else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value);
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
  });
  });

  var path = global_1;

  var aFunction = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };
  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      }
      return !IS_INCLUDES && -1;
    };
  };
  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$4
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;
  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
  };
  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };
  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';
  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  var aFunction$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    }
    return it;
  };

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function /* ...args */
    () {
      return fn.apply(that, arguments);
    };
  };

  var html = getBuiltIn('document', 'documentElement');

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var location = global_1.location;
  var set$1 = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process$1 = global_1.process;
  var MessageChannel = global_1.MessageChannel;
  var Dispatch = global_1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;
  var run = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var runner = function (id) {
    return function () {
      run(id);
    };
  };
  var listener = function (event) {
    run(event.data);
  };
  var post = function (id) {
    // old engines have not location.origin
    global_1.postMessage(id + '', location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1 || !clear) {
    set$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw(process$1) == 'process') {
      defer = function (id) {
        process$1.nextTick(runner(id));
      };
      // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
      // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext(port.postMessage, port, 1);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post) && location.protocol !== 'file:') {
      defer = post;
      global_1.addEventListener('message', listener, false);
      // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
      // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }
  var task = {
    set: set$1,
    clear: clear
  };

  var FORCED = !global_1.setImmediate || !global_1.clearImmediate;

  // http://w3c.github.io/setImmediate/
  _export({
    global: true,
    bind: true,
    enumerable: true,
    forced: FORCED
  }, {
    // `setImmediate` method
    // http://w3c.github.io/setImmediate/#si-setImmediate
    setImmediate: task.set,
    // `clearImmediate` method
    // http://w3c.github.io/setImmediate/#si-clearImmediate
    clearImmediate: task.clear
  });

  (function () {
    function buggy() {
      function detect() {
        var a = [0, 1];
        a.reverse();
        return a[0] === 0;
      }
      return detect() || detect();
    }
    if (!buggy()) return;
    Array.prototype._reverse = Array.prototype.reverse;
    Array.prototype.reverse = function reverse() {
      if (Array.isArray(this)) this.length = this.length;
      return Array.prototype._reverse.call(this);
    };
    var nonenum = {
      enumerable: false
    };
    Object.defineProperties(Array.prototype, {
      _reverse: nonenum,
      reverse: nonenum
    });
  })();

  const PAGE_DID_ACTIVATE = 'PAGE_DID_ACTIVATE';
  const PAGE_WILL_ACTIVATE = 'PAGE_WILL_ACTIVATE';
  const PAGE_DID_DEACTIVATE = 'PAGE_DID_DEACTIVATE';
  const PAGE_WILL_DEACTIVATE = 'PAGE_WILL_DEACTIVATE';
  const PAGE_DID_PRELOAD = 'PAGE_DID_PRELOAD';
  const PAGE_DID_PREPARE = 'PAGE_DID_PREPARE';
  const PAGE_SCHEDULE_UNPREPARE = 'PAGE_SCHEDULE_UNPREPARE';
  const PAGE_DID_UNPREPARE = 'PAGE_DID_UNPREPARE';
  const PAGE_DID_RESIZE = 'PAGE_DID_RESIZE';
  const ENHANCE = 'PAGE_ENHANCE';
  const CLEANUP = 'PAGE_CLEANUP';
  const UPDATE_PAGE_ATTRIBUTE = 'UPDATE_PAGE_ATTRIBUTE';
  const UPDATE_PAGE_LINK = 'UPDATE_PAGE_LINK';
  function pageWillActivate({
    id,
    position
  } = {}) {
    return pageAction(PAGE_WILL_ACTIVATE, id, {
      position
    });
  }
  function pageDidActivate({
    id
  } = {}) {
    return pageAction(PAGE_DID_ACTIVATE, id);
  }
  function pageWillDeactivate({
    id
  } = {}) {
    return pageAction(PAGE_WILL_DEACTIVATE, id);
  }
  function pageDidDeactivate({
    id
  } = {}) {
    return pageAction(PAGE_DID_DEACTIVATE, id);
  }
  function pageDidPreload({
    id
  } = {}) {
    return pageAction(PAGE_DID_PRELOAD, id);
  }
  function pageDidPrepare({
    id
  } = {}) {
    return pageAction(PAGE_DID_PREPARE, id);
  }
  function pageScheduleUnprepare({
    id
  } = {}) {
    return pageAction(PAGE_SCHEDULE_UNPREPARE, id);
  }
  function pageDidUnprepare({
    id
  } = {}) {
    return pageAction(PAGE_DID_UNPREPARE, id);
  }
  function pageDidResize({
    id
  } = {}) {
    return pageAction(PAGE_DID_RESIZE, id);
  }
  function enhance({
    id
  } = {}) {
    return pageAction(ENHANCE, id);
  }
  function cleanup({
    id
  } = {}) {
    return pageAction(CLEANUP, id);
  }
  function updatePageAttribute({
    id,
    name,
    value
  } = {}) {
    return pageAction(UPDATE_PAGE_ATTRIBUTE, id, {
      name,
      value
    });
  }
  function updatePageLink({
    pageId,
    linkId,
    name,
    value
  } = {}) {
    return pageAction(UPDATE_PAGE_LINK, pageId, {
      linkId,
      name,
      value
    });
  }
  function pageAction(type, pageId, payload = {}) {
    return {
      type,
      meta: {
        collectionName: 'pages',
        itemId: pageId
      },
      payload
    };
  }

  const LOAD = 'SETTINGS_LOAD';
  const UPDATE = 'SETTINGS_UPDATE';
  function load({
    settings
  }) {
    return {
      type: LOAD,
      payload: {
        settings
      }
    };
  }
  function update({
    property,
    value
  }) {
    return {
      type: UPDATE,
      payload: {
        property,
        value
      }
    };
  }



  var actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    updatePageAttribute: updatePageAttribute,
    updatePageLink: updatePageLink,
    updateSetting: update
  });

  var classnames = createCommonjsModule(function (module) {
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  /* global define */

  (function () {

    var hasOwn = {}.hasOwnProperty;
    function classNames() {
      var classes = '';
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
          classes = appendClass(classes, parseValue(arg));
        }
      }
      return classes;
    }
    function parseValue(arg) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        return arg;
      }
      if (typeof arg !== 'object') {
        return '';
      }
      if (Array.isArray(arg)) {
        return classNames.apply(null, arg);
      }
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        return arg.toString();
      }
      var classes = '';
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes = appendClass(classes, key);
        }
      }
      return classes;
    }
    function appendClass(value, newClass) {
      if (!newClass) {
        return value;
      }
      if (value) {
        return value + ' ' + newClass;
      }
      return value + newClass;
    }
    if ( module.exports) {
      classNames.default = classNames;
      module.exports = classNames;
    } else {
      window.classNames = classNames;
    }
  })();
  });

  /**
   * @desc Used to build the default page structure. Requires
   * {@link pageflow.react.components.PageBackground|PageBackground} and either
   * {@link pageflow.react.components.PageForeground|PageForeground} or
   * {@link pageflow.react.components.PageContent|PageContent} as children.
   *
   * @alias pageflow.react.components.PageWrapper
   * @class
   * @since 0.1
   *
   * @prop className
   *   Additional class names.
   *
   * @example
   *
   * <PageWrapper>
   *   <PageBackground>
   *      <PageBackgroundImage page={page} />
   *      <PageShadow page={page} />
   *   </PageBackground>
   *
   *    <PageForeground>
   *      <PageScroller>
   *        <PageHeader page={page} />
   *        <PageText page={page} />
   *      </PageScroller>
   *    </PageForeground>
   *  </PageWrapper>
   *
   * @example
   *
   * <PageWrapper>
   *   <PageBackground>
   *      <PageBackgroundImage page={page} />
   *      <PageShadow page={page} />
   *   </PageBackground>
   *
   *    <PageContent>
   *      <PageHeader page={page} />
   *      <PageText page={page} />
   *    </PageContent>
   *  </PageWrapper>
   */
  class PageWrapper extends React$1.Component {
    render() {
      return /*#__PURE__*/React.createElement("div", {
        className: classnames('content_and_background', this.props.className)
      }, this.props.children);
    }
  }

  /**
   * @desc Use inside {@link
   * pageflow.react.components.PageWrapper|PageWrapper} to build the
   * default page structure.
   *
   * @prop pageHasPlayerControls
   *   Set to true if player controls are present on the page. This can
   *   be used by themes to apply different styles to the background.
   *
   * @alias pageflow.react.components.PageBackground
   * @class
   * @since 0.1
   */
  function PageBackground(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: className(props)
    }, props.children);
  }
  function className({
    pageHasPlayerControls
  }) {
    return classnames('page_background', {
      'page_background-for_page_with_player_controls': pageHasPlayerControls
    });
  }

  var striptags = createCommonjsModule(function (module) {

  (function (global) {
    // minimal symbol polyfill for IE11 and others
    if (typeof Symbol !== 'function') {
      var Symbol = function (name) {
        return name;
      };
      Symbol.nonNative = true;
    }
    const STATE_PLAINTEXT = Symbol('plaintext');
    const STATE_HTML = Symbol('html');
    const STATE_COMMENT = Symbol('comment');
    const ALLOWED_TAGS_REGEX = /<(\w*)>/g;
    const NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;
    function striptags(html, allowable_tags, tag_replacement) {
      html = html || '';
      allowable_tags = allowable_tags || [];
      tag_replacement = tag_replacement || '';
      let context = init_context(allowable_tags, tag_replacement);
      return striptags_internal(html, context);
    }
    function init_striptags_stream(allowable_tags, tag_replacement) {
      allowable_tags = allowable_tags || [];
      tag_replacement = tag_replacement || '';
      let context = init_context(allowable_tags, tag_replacement);
      return function striptags_stream(html) {
        return striptags_internal(html || '', context);
      };
    }
    striptags.init_streaming_mode = init_striptags_stream;
    function init_context(allowable_tags, tag_replacement) {
      allowable_tags = parse_allowable_tags(allowable_tags);
      return {
        allowable_tags: allowable_tags,
        tag_replacement: tag_replacement,
        state: STATE_PLAINTEXT,
        tag_buffer: '',
        depth: 0,
        in_quote_char: ''
      };
    }
    function striptags_internal(html, context) {
      if (typeof html != "string") {
        throw new TypeError("'html' parameter must be a string");
      }
      let allowable_tags = context.allowable_tags;
      let tag_replacement = context.tag_replacement;
      let state = context.state;
      let tag_buffer = context.tag_buffer;
      let depth = context.depth;
      let in_quote_char = context.in_quote_char;
      let output = '';
      for (let idx = 0, length = html.length; idx < length; idx++) {
        let char = html[idx];
        if (state === STATE_PLAINTEXT) {
          switch (char) {
            case '<':
              state = STATE_HTML;
              tag_buffer += char;
              break;
            default:
              output += char;
              break;
          }
        } else if (state === STATE_HTML) {
          switch (char) {
            case '<':
              // ignore '<' if inside a quote
              if (in_quote_char) {
                break;
              }

              // we're seeing a nested '<'
              depth++;
              break;
            case '>':
              // ignore '>' if inside a quote
              if (in_quote_char) {
                break;
              }

              // something like this is happening: '<<>>'
              if (depth) {
                depth--;
                break;
              }

              // this is closing the tag in tag_buffer
              in_quote_char = '';
              state = STATE_PLAINTEXT;
              tag_buffer += '>';
              if (allowable_tags.has(normalize_tag(tag_buffer))) {
                output += tag_buffer;
              } else {
                output += tag_replacement;
              }
              tag_buffer = '';
              break;
            case '"':
            case '\'':
              // catch both single and double quotes

              if (char === in_quote_char) {
                in_quote_char = '';
              } else {
                in_quote_char = in_quote_char || char;
              }
              tag_buffer += char;
              break;
            case '-':
              if (tag_buffer === '<!-') {
                state = STATE_COMMENT;
              }
              tag_buffer += char;
              break;
            case ' ':
            case '\n':
              if (tag_buffer === '<') {
                state = STATE_PLAINTEXT;
                output += '< ';
                tag_buffer = '';
                break;
              }
              tag_buffer += char;
              break;
            default:
              tag_buffer += char;
              break;
          }
        } else if (state === STATE_COMMENT) {
          switch (char) {
            case '>':
              if (tag_buffer.slice(-2) == '--') {
                // close the comment
                state = STATE_PLAINTEXT;
              }
              tag_buffer = '';
              break;
            default:
              tag_buffer += char;
              break;
          }
        }
      }

      // save the context for future iterations
      context.state = state;
      context.tag_buffer = tag_buffer;
      context.depth = depth;
      context.in_quote_char = in_quote_char;
      return output;
    }
    function parse_allowable_tags(allowable_tags) {
      let tag_set = new Set();
      if (typeof allowable_tags === 'string') {
        let match;
        while (match = ALLOWED_TAGS_REGEX.exec(allowable_tags)) {
          tag_set.add(match[1]);
        }
      } else if (!Symbol.nonNative && typeof allowable_tags[Symbol.iterator] === 'function') {
        tag_set = new Set(allowable_tags);
      } else if (typeof allowable_tags.forEach === 'function') {
        // IE11 compatible
        allowable_tags.forEach(tag_set.add, tag_set);
      }
      return tag_set;
    }
    function normalize_tag(tag_buffer) {
      let match = NORMALIZE_TAG_REGEX.exec(tag_buffer);
      return match ? match[1].toLowerCase() : null;
    }
    if ( module.exports) {
      // Node
      module.exports = striptags;
    } else {
      // Browser
      global.striptags = striptags;
    }
  })(commonjsGlobal);
  });

  function isBlank(html) {
    return !!striptags(html).match(/^\s*$/);
  }

  function camelize(snakeCase) {
    return snakeCase.replace(/_[a-z]/g, function (match) {
      return match[1].toUpperCase();
    });
  }
  camelize.keys = function (object) {
    return Object.keys(object).reduce((result, key) => {
      result[camelize(key)] = object[key];
      return result;
    }, {});
  };
  camelize.deep = function (object) {
    if (Array.isArray(object)) {
      return object.map(camelize.deep);
    } else if (typeof object === 'object' && object) {
      return Object.keys(object).reduce((result, key) => {
        result[camelize(key)] = camelize.deep(object[key]);
        return result;
      }, {});
    } else {
      return object;
    }
  };
  camelize.concat = function (...args) {
    return args.filter(part => part).reduce((result, part) => result + part[0].toUpperCase() + part.slice(1));
  };

  function combine (selectors) {
    return function (...args) {
      return Object.keys(selectors).reduce((result, key) => {
        if (typeof selectors[key] == 'function') {
          result[key] = selectors[key](...args);
        } else {
          result[key] = selectors[key];
        }
        return result;
      }, {});
    };
  }

  var lib = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.defaultMemoize = defaultMemoize;
  exports.createSelectorCreator = createSelectorCreator;
  exports.createStructuredSelector = createStructuredSelector;
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  function defaultEqualityCheck(a, b) {
    return a === b;
  }
  function defaultMemoize(func) {
    var equalityCheck = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCheck : arguments[1];
    var lastArgs = null;
    var lastResult = null;
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (lastArgs === null || lastArgs.length !== args.length || !args.every(function (value, index) {
        return equalityCheck(value, lastArgs[index]);
      })) {
        lastResult = func.apply(undefined, args);
      }
      lastArgs = args;
      return lastResult;
    };
  }
  function getDependencies(funcs) {
    var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
    if (!dependencies.every(function (dep) {
      return typeof dep === 'function';
    })) {
      var dependencyTypes = dependencies.map(function (dep) {
        return typeof dep;
      }).join(', ');
      throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
    }
    return dependencies;
  }
  function createSelectorCreator(memoize) {
    for (var _len2 = arguments.length, memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      memoizeOptions[_key2 - 1] = arguments[_key2];
    }
    return function () {
      for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        funcs[_key3] = arguments[_key3];
      }
      var recomputations = 0;
      var resultFunc = funcs.pop();
      var dependencies = getDependencies(funcs);
      var memoizedResultFunc = memoize.apply(undefined, [function () {
        recomputations++;
        return resultFunc.apply(undefined, arguments);
      }].concat(memoizeOptions));
      var selector = function selector(state, props) {
        for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          args[_key4 - 2] = arguments[_key4];
        }
        var params = dependencies.map(function (dependency) {
          return dependency.apply(undefined, [state, props].concat(args));
        });
        return memoizedResultFunc.apply(undefined, _toConsumableArray(params));
      };
      selector.resultFunc = resultFunc;
      selector.recomputations = function () {
        return recomputations;
      };
      selector.resetRecomputations = function () {
        return recomputations = 0;
      };
      return selector;
    };
  }
  var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);
  function createStructuredSelector(selectors) {
    var selectorCreator = arguments.length <= 1 || arguments[1] === undefined ? createSelector : arguments[1];
    if (typeof selectors !== 'object') {
      throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
    }
    var objectKeys = Object.keys(selectors);
    return selectorCreator(objectKeys.map(function (key) {
      return selectors[key];
    }), function () {
      for (var _len5 = arguments.length, values = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        values[_key5] = arguments[_key5];
      }
      return values.reduce(function (composition, value, index) {
        composition[objectKeys[index]] = value;
        return composition;
      }, {});
    });
  }
  });

  unwrapExports(lib);
  var lib_1 = lib.defaultMemoize;
  var lib_2 = lib.createSelectorCreator;
  var lib_3 = lib.createStructuredSelector;
  var lib_4 = lib.createSelector;

  const SELECTOR_FACTORY = Symbol('selectorFactory');
  const CREATE_SELECTOR = Symbol('createSelector');
  function memoizedSelector(...args) {
    return mark(function selectorCreator(stateOrCreateSelectorSymbol, props) {
      const inputSelectors = args.slice(0, -1).map(unwrap);
      const transform = args.slice(-1)[0];
      const selector = lib_4(...inputSelectors, transform);
      if (stateOrCreateSelectorSymbol === CREATE_SELECTOR) {
        return selector;
      } else if (stateOrCreateSelectorSymbol) {
        return selector(stateOrCreateSelectorSymbol, props);
      } else {
        throw 'Missing state argument for selector.';
      }
    });
  }
  function combine$1(selectors, name) {
    return mark(function combinedSelectorCreator() {
      return lib_3(unwrapAll(replaceScalarsWithConstantFunctions(selectors)));
    });
  }
  function unwrapAll(selectors) {
    return Object.keys(selectors).reduce((result, key) => {
      result[key] = unwrap(selectors[key]);
      return result;
    }, {});
  }
  function replaceScalarsWithConstantFunctions(object) {
    return Object.keys(object).reduce((result, key) => {
      if (typeof object[key] == 'function') {
        result[key] = object[key];
      } else {
        result[key] = () => object[key];
      }
      return result;
    }, {});
  }
  function unwrap(selector) {
    if (typeof selector == 'function' && selector[SELECTOR_FACTORY]) {
      return selector(CREATE_SELECTOR);
    } else {
      return selector;
    }
  }
  function mark(selectorFactory) {
    selectorFactory[SELECTOR_FACTORY] = true;
    return selectorFactory;
  }

  function has$2(featureName, browser = pageflow.browser) {
    return browser && browser.has(featureName);
  }

  function preloadBackgroundImage(element) {
    const propertyValue = window.getComputedStyle(element).getPropertyValue('background-image');
    if (propertyValue.match(/^url/)) {
      const url = propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
      return preloadImage(url);
    }
  }
  function preloadImage(url) {
    return new Promise(resolve => {
      var image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = url;
    });
  }

  /**
   * Display an element with a background image referenced by
   * `ImageFile` id.
   *
   * @alias pageflow.react.components.BackgroundImage
   * @since 0.1
   *
   * @prop fileId
   *   The id of the image file to display.
   *
   * @prop position
   *   Two element array of percent values specifying background position.
   *
   * @prop className
   *   Additional CSS classes.
   *
   * @prop loaded
   *   Used to lazy load images.
   */
  class BackgroundImage extends React$1__default.Component {
    render() {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: this.cssClass(),
        style: this.style(),
        ref: element => this.element = element
      }, this.renderStructuredData());
    }
    componentDidUpdate(prevProps) {
      if (this.props.loaded && !prevProps.loaded) {
        preloadBackgroundImage(this.element);
      }
    }
    cssClass() {
      return classnames(this.props.className, this.props.loaded ? 'load_image' : null, this.imageCssClass());
    }
    imageCssClass() {
      return [this.props.fileCollection == 'imageFiles' ? 'image' : 'video_poster', this.props.fileId || 'none'].join('_');
    }
    style() {
      return {
        backgroundPosition: `${this.positionCoordinate(0)}% ${this.positionCoordinate(1)}%`
      };
    }
    positionCoordinate(index) {
      var coordinate = this.props.position[index];
      if (typeof coordinate === 'undefined') {
        return 50;
      }
      return coordinate;
    }
    renderStructuredData() {
      if (this.props.structuredDataComponent) {
        const StructuredDataComponent = this.props.structuredDataComponent;
        return /*#__PURE__*/React$1__default.createElement(StructuredDataComponent, {
          fileCollection: this.props.fileCollection,
          fileId: this.props.fileId
        });
      }
    }
  }
  BackgroundImage.defaultProps = {
    position: [50, 50],
    fileCollection: 'imageFiles'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol$1 = root.Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];
    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  function symbolObservablePonyfill(root) {
    var result;
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
      if (Symbol.observable) {
        result = Symbol.observable;
      } else {
        result = Symbol('observable');
        Symbol.observable = result;
      }
    } else {
      result = '@@observable';
    }
    return result;
  }

  /* global window */
  var root$1;
  if (typeof self !== 'undefined') {
    root$1 = self;
  } else if (typeof window !== 'undefined') {
    root$1 = window;
  } else if (typeof global !== 'undefined') {
    root$1 = global;
  } else if (typeof module !== 'undefined') {
    root$1 = module;
  } else {
    root$1 = Function('return this')();
  }
  var result = symbolObservablePonyfill(root$1);

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var ActionTypes = {
    INIT: '@@redux/INIT'

    /**
     * Creates a Redux store that holds the state tree.
     * The only way to change the data in the store is to call `dispatch()` on it.
     *
     * There should only be a single store in your app. To specify how different
     * parts of the state tree respond to actions, you may combine several reducers
     * into a single reducer function by using `combineReducers`.
     *
     * @param {Function} reducer A function that returns the next state tree, given
     * the current state tree and the action to handle.
     *
     * @param {any} [preloadedState] The initial state. You may optionally specify it
     * to hydrate the state from the server in universal apps, or to restore a
     * previously serialized user session.
     * If you use `combineReducers` to produce the root reducer function, this must be
     * an object with the same shape as `combineReducers` keys.
     *
     * @param {Function} [enhancer] The store enhancer. You may optionally specify it
     * to enhance the store with third-party capabilities such as middleware,
     * time travel, persistence, etc. The only store enhancer that ships with Redux
     * is `applyMiddleware()`.
     *
     * @returns {Store} A Redux store that lets you read the state, dispatch actions
     * and subscribe to changes.
     */
  };
  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }
    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }
      return enhancer(createStore)(reducer, preloadedState);
    }
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }
    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }

    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */
    function getState() {
      return currentState;
    }

    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */
    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }
      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }

    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }
      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }
      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }
      return action;
    }

    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }
      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.INIT
      });
    }

    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */
    function observable() {
      var _ref;
      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object') {
            throw new TypeError('Expected the observer to be an object.');
          }
          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }
          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[result] = function () {
        return this;
      }, _ref;
    }

    // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.
    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[result] = observable, _ref2;
  }

  function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
    return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
  }
  function assertReducerShape(reducers) {
    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key];
      var initialState = reducer(undefined, {
        type: ActionTypes.INIT
      });
      if (typeof initialState === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
      }
      var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
      if (typeof reducer(undefined, {
        type: type
      }) === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
      }
    });
  }

  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */
  function combineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    var finalReducers = {};
    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];
      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
      }
    }
    var finalReducerKeys = Object.keys(finalReducers);
    var shapeAssertionError = void 0;
    try {
      assertReducerShape(finalReducers);
    } catch (e) {
      shapeAssertionError = e;
    }
    return function combination() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments[1];
      if (shapeAssertionError) {
        throw shapeAssertionError;
      }
      var hasChanged = false;
      var nextState = {};
      for (var _i = 0; _i < finalReducerKeys.length; _i++) {
        var _key = finalReducerKeys[_i];
        var reducer = finalReducers[_key];
        var previousStateForKey = state[_key];
        var nextStateForKey = reducer(previousStateForKey, action);
        if (typeof nextStateForKey === 'undefined') {
          var errorMessage = getUndefinedStateErrorMessage(_key, action);
          throw new Error(errorMessage);
        }
        nextState[_key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }
      return hasChanged ? nextState : state;
    };
  }

  function bindActionCreator(actionCreator, dispatch) {
    return function () {
      return dispatch(actionCreator.apply(undefined, arguments));
    };
  }

  /**
   * Turns an object whose values are action creators, into an object with the
   * same keys, but with every function wrapped into a `dispatch` call so they
   * may be invoked directly. This is just a convenience method, as you can call
   * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
   *
   * For convenience, you can also pass a single function as the first argument,
   * and get a function in return.
   *
   * @param {Function|Object} actionCreators An object whose values are action
   * creator functions. One handy way to obtain it is to use ES6 `import * as`
   * syntax. You may also pass a single function.
   *
   * @param {Function} dispatch The `dispatch` function available on your Redux
   * store.
   *
   * @returns {Function|Object} The object mimicking the original object, but with
   * every action creator wrapped into the `dispatch` call. If you passed a
   * function as `actionCreators`, the return value will also be a single
   * function.
   */
  function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
      return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
      throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
    }
    var keys = Object.keys(actionCreators);
    var boundActionCreators = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var actionCreator = actionCreators[key];
      if (typeof actionCreator === 'function') {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return boundActionCreators;
  }

  /**
   * Composes single-argument functions from right to left. The rightmost
   * function can take multiple arguments as it provides the signature for
   * the resulting composite function.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing the argument functions
   * from right to left. For example, compose(f, g, h) is identical to doing
   * (...args) => f(g(h(...args))).
   */

  function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }
    if (funcs.length === 0) {
      return function (arg) {
        return arg;
      };
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce(function (a, b) {
      return function () {
        return a(b.apply(undefined, arguments));
      };
    });
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */
  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }
    return function (createStore) {
      return function (reducer, preloadedState, enhancer) {
        var store = createStore(reducer, preloadedState, enhancer);
        var _dispatch = store.dispatch;
        var chain = [];
        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch(action) {
            return _dispatch(action);
          }
        };
        chain = middlewares.map(function (middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = compose.apply(undefined, chain)(store.dispatch);
        return _extends({}, store, {
          dispatch: _dispatch
        });
      };
    };
  }

  var commonPageStateReducer = combineReducers({
    isPreloaded,
    isPrepared,
    isActive,
    isActivated,
    initialScrollerPosition
  });
  function isPreloaded(state = false, action) {
    switch (action.type) {
      case PAGE_DID_PRELOAD:
        return true;
      default:
        return state;
    }
  }
  function isPrepared(state = false, action) {
    switch (action.type) {
      case PAGE_DID_PREPARE:
      case PAGE_WILL_ACTIVATE:
        return true;
      case PAGE_DID_UNPREPARE:
        return false;
      default:
        return state;
    }
  }
  function isActive(state = false, action) {
    switch (action.type) {
      case PAGE_WILL_ACTIVATE:
        return true;
      case PAGE_WILL_DEACTIVATE:
        return false;
      default:
        return state;
    }
  }
  function isActivated(state = false, action) {
    switch (action.type) {
      case PAGE_DID_ACTIVATE:
        return true;
      case PAGE_WILL_DEACTIVATE:
        return false;
      default:
        return state;
    }
  }
  function initialScrollerPosition(state = null, action) {
    switch (action.type) {
      case PAGE_WILL_ACTIVATE:
        return action.payload.position || 'top';
      case PAGE_WILL_DEACTIVATE:
        return null;
      default:
        return state;
    }
  }

  const RESET = 'COLLECTION_RESET';
  const ADD = 'COLLECTION_ADD';
  const CHANGE = 'COLLECTION_CHANGE';
  const REMOVE = 'COLLECTION_REMOVE';
  const ORDER = 'COLLECTION_ORDER';
  function reset({
    collectionName,
    items
  }) {
    return {
      type: RESET,
      meta: {
        collectionName
      },
      payload: {
        collectionName,
        items
      }
    };
  }
  function add({
    collectionName,
    attributes,
    order
  }) {
    return {
      type: ADD,
      meta: {
        collectionName
      },
      payload: {
        attributes,
        order
      }
    };
  }
  function change({
    collectionName,
    attributes
  }) {
    return {
      type: CHANGE,
      meta: {
        collectionName
      },
      payload: {
        attributes
      }
    };
  }
  function remove({
    collectionName,
    attributes,
    order
  }) {
    return {
      type: REMOVE,
      meta: {
        collectionName
      },
      payload: {
        attributes,
        order
      }
    };
  }
  function order({
    collectionName,
    order
  }) {
    return {
      type: ORDER,
      meta: {
        collectionName
      },
      payload: {
        order
      }
    };
  }

  function attributesItemReducer(state = {}, action) {
    switch (action.type) {
      case ADD:
      case CHANGE:
        return action.payload.attributes;
      default:
        return state;
    }
  }

  function createPageStateReducer (pageStateReducers) {
    const pageReducers = {};
    function getPageReducer(type) {
      pageReducers[type] = pageReducers[type] || combineReducers({
        attributes: attributesItemReducer,
        state: combineReducers({
          custom: pageStateReducers[type] || ((item = {}) => item),
          common: commonPageStateReducer
        })
      });
      return pageReducers[type];
    }
    return function (page = {}, action) {
      const attributes = attributesItemReducer(page.attributes, action);
      return getPageReducer(attributes.type)(resetCustomPageStateOnTypeChange(page, page.attributes, attributes), action);
    };
    function resetCustomPageStateOnTypeChange(page, attributes, newAttributes) {
      if (attributes && attributes.type !== newAttributes.type) {
        return {
          ...page,
          state: {
            ...page.state,
            custom: undefined
          }
        };
      } else {
        return page;
      }
    }
  }

  function createCollectionItemsSelector (collectionName, {
    namespace
  } = {}) {
    return function itemsSelector(state) {
      if (namespace) {
        if (!state[namespace]) {
          throw new Error(`Cannot select from unknown namespace ${namespace}.`);
        }
        state = state[namespace];
      }
      return state[collectionName].items || {};
    };
  }

  function addItemScope(state, collectionName, itemId) {
    return {
      ...state,
      [getItemScopeProperty(collectionName)]: itemId
    };
  }
  function getItemScopeProperty(collectionName) {
    return `__${collectionName}_connectedId`;
  }

  function createItemSelector (collectionName, {
    namespace
  } = {}) {
    return function ({
      id
    } = {}) {
      return function (state, props) {
        let modelId = id;
        let namespacedState = state;
        if (namespace) {
          if (!state[namespace]) {
            throw new Error(`Cannot select from unknown namespace ${namespace}.`);
          }
          namespacedState = state[namespace];
        }
        if (!namespacedState[collectionName]) {
          throw new Error(`Cannot select from unknown collection ${collectionName}.`);
        }
        if (typeof id == 'function') {
          modelId = id(state, props);
        }
        modelId = modelId || state[getItemScopeProperty(collectionName)];
        if (!modelId) {
          return null;
        }
        return namespacedState[collectionName].items[modelId];
      };
    };
  }

  function createFirstItemSelector(collectionName, {
    namespace
  } = {}) {
    return function (state) {
      if (namespace) {
        if (!state[namespace]) {
          throw new Error(`Cannot select from unknown namespace ${namespace}.`);
        }
        state = state[namespace];
      }
      const collection = state[collectionName];
      return collection.items[collection.order[0]];
    };
  }

  function createCollectionReducer (collectionName, {
    idAttribute = 'id',
    itemReducer = attributesItemReducer
  } = {}) {
    const initialState = {
      order: [],
      items: {}
    };
    return function (state = initialState, action) {
      let clone, id;
      if (!action.meta || action.meta.collectionName != collectionName) {
        return state;
      }
      switch (action.type) {
        case RESET:
          return {
            order: action.payload.items.map(item => item[idAttribute]),
            items: action.payload.items.reduce((result, item) => {
              result[item[idAttribute]] = itemReducer(undefined, add({
                collectioName: action.payload.collectioName,
                attributes: item
              }));
              return result;
            }, {})
          };
        case ADD:
          return {
            order: action.payload.order,
            items: {
              ...state.items,
              [action.payload.attributes[idAttribute]]: itemReducer(undefined, action)
            }
          };
        case CHANGE:
          id = action.payload.attributes[idAttribute];
          return {
            order: state.order,
            items: {
              ...state.items,
              [id]: itemReducer(state.items[id], action)
            }
          };
        case REMOVE:
          id = action.payload.attributes[idAttribute];
          clone = {
            ...state.items
          };
          delete clone[id];
          return {
            order: action.payload.order,
            items: clone
          };
        case ORDER:
          return {
            items: state.items,
            order: action.payload.order
          };
        default:
          if (action.meta.itemId) {
            const item = state.items[action.meta.itemId];
            const reducedItem = itemReducer(item, action);
            if (reducedItem !== item) {
              return {
                order: state.order,
                items: {
                  ...state.items,
                  [action.meta.itemId]: reducedItem
                }
              };
            }
          }
          return state;
      }
    };
  }

  function ensureItemActionId(action, collectionName, itemId) {
    if (action.meta && action.meta.collectionName == collectionName && !action.meta.itemId) {
      action.meta = {
        ...action.meta,
        itemId
      };
    }
  }
  function isItemAction(action, collectionName) {
    return action.meta && action.meta.collectionName == collectionName;
  }
  function getItemIdFromItemAction(action) {
    return action.meta && action.meta.itemId;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var sym = function sym(id) {
    return '@@redux-saga/' + id;
  };
  var TASK = sym('TASK');
  var HELPER = sym('HELPER');
  var ident = function ident(v) {
    return v;
  };
  function check$1(value, predicate, error) {
    if (!predicate(value)) {
      log('error', 'uncaught at check', error);
      throw new Error(error);
    }
  }
  var is = {
    undef: function undef(v) {
      return v === null || v === undefined;
    },
    notUndef: function notUndef(v) {
      return v !== null && v !== undefined;
    },
    func: function func(f) {
      return typeof f === 'function';
    },
    number: function number(n) {
      return typeof n === 'number';
    },
    array: Array.isArray,
    promise: function promise(p) {
      return p && is.func(p.then);
    },
    iterator: function iterator(it) {
      return it && is.func(it.next) && is.func(it.throw);
    },
    task: function task(t) {
      return t && t[TASK];
    },
    observable: function observable(ob) {
      return ob && is.func(ob.subscribe);
    },
    buffer: function buffer(buf) {
      return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
    },
    pattern: function pattern(pat) {
      return pat && (typeof pat === 'string' || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
    },
    channel: function channel(ch) {
      return ch && is.func(ch.take) && is.func(ch.close);
    },
    helper: function helper(it) {
      return it && it[HELPER];
    }
  };

  /**
    Print error in a useful way whether in a browser environment
    (with expandable error stack traces), or in a node.js environment
    (text-only log output)
   **/
  function log(level, message, error) {
    /*eslint-disable no-console*/
    if (typeof window === 'undefined') {
      console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
    } else {
      console[level](message, error);
    }
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
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
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
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
  var IO = sym('IO');
  var TAKE = 'TAKE';
  var PUT = 'PUT';
  var RACE = 'RACE';
  var CALL = 'CALL';
  var CPS = 'CPS';
  var FORK = 'FORK';
  var CANCEL = 'CANCEL';
  var SELECT = 'SELECT';
  var effect = function effect(type, payload) {
    var _ref;
    return _ref = {}, _defineProperty(_ref, IO, true), _defineProperty(_ref, type, payload), _ref;
  };
  function take() {
    var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
    if (arguments.length) {
      check$1(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
    }
    if (is.pattern(patternOrChannel)) {
      return effect(TAKE, {
        pattern: patternOrChannel
      });
    }
    if (is.channel(patternOrChannel)) {
      return effect(TAKE, {
        channel: patternOrChannel
      });
    }
    throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
  }
  function put(channel, action) {
    if (arguments.length > 1) {
      check$1(channel, is.notUndef, 'put(channel, action): argument channel is undefined');
      check$1(channel, is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
      check$1(action, is.notUndef, 'put(channel, action): argument action is undefined');
    } else {
      check$1(channel, is.notUndef, 'put(action): argument action is undefined');
      action = channel;
      channel = null;
    }
    return effect(PUT, {
      channel: channel,
      action: action
    });
  }
  put.sync = function () {
    var eff = put.apply(undefined, arguments);
    eff[PUT].sync = true;
    return eff;
  };
  function race(effects) {
    return effect(RACE, effects);
  }
  function getFnCallDesc(meth, fn, args) {
    check$1(fn, is.notUndef, meth + ': argument fn is undefined');
    var context = null;
    if (is.array(fn)) {
      var _fn = fn;
      var _fn2 = _slicedToArray(_fn, 2);
      context = _fn2[0];
      fn = _fn2[1];
    } else if (fn.fn) {
      var _fn3 = fn;
      context = _fn3.context;
      fn = _fn3.fn;
    }
    check$1(fn, is.func, meth + ': argument ' + fn + ' is not a function');
    return {
      context: context,
      fn: fn,
      args: args
    };
  }
  function call(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return effect(CALL, getFnCallDesc('call', fn, args));
  }
  function cps(fn) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return effect(CPS, getFnCallDesc('cps', fn, args));
  }
  function fork(fn) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return effect(FORK, getFnCallDesc('fork', fn, args));
  }
  var isForkedTask = function isForkedTask(task) {
    return task[TASK];
  };
  function cancel(task) {
    check$1(task, is.notUndef, 'cancel(task): argument task is undefined');
    if (!isForkedTask(task)) {
      throw new Error('cancel(task): argument ' + task + ' is not a valid Task object \n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)');
    }
    return effect(CANCEL, task);
  }
  function select(selector) {
    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }
    if (arguments.length === 0) {
      selector = ident;
    } else {
      check$1(selector, is.notUndef, 'select(selector,[...]): argument selector is undefined');
      check$1(selector, is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
    }
    return effect(SELECT, {
      selector: selector,
      args: args
    });
  }

  var utils = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  exports.check = check;
  exports.remove = remove;
  exports.deferred = deferred;
  exports.arrayOfDeffered = arrayOfDeffered;
  exports.delay = delay;
  exports.createMockTask = createMockTask;
  exports.autoInc = autoInc;
  exports.makeIterator = makeIterator;
  exports.log = log;
  exports.wrapSagaDispatch = wrapSagaDispatch;
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
  var sym = exports.sym = function sym(id) {
    return '@@redux-saga/' + id;
  };
  var TASK = exports.TASK = sym('TASK');
  var HELPER = exports.HELPER = sym('HELPER');
  var MATCH = exports.MATCH = sym('MATCH');
  var CANCEL = exports.CANCEL = sym('cancelPromise');
  var SAGA_ACTION = exports.SAGA_ACTION = sym('SAGA_ACTION');
  var konst = exports.konst = function konst(v) {
    return function () {
      return v;
    };
  };
  var kTrue = exports.kTrue = konst(true);
  var kFalse = exports.kFalse = konst(false);
  var noop = exports.noop = function noop() {};
  var ident = exports.ident = function ident(v) {
    return v;
  };
  function check(value, predicate, error) {
    if (!predicate(value)) {
      log('error', 'uncaught at check', error);
      throw new Error(error);
    }
  }
  var is = exports.is = {
    undef: function undef(v) {
      return v === null || v === undefined;
    },
    notUndef: function notUndef(v) {
      return v !== null && v !== undefined;
    },
    func: function func(f) {
      return typeof f === 'function';
    },
    number: function number(n) {
      return typeof n === 'number';
    },
    array: Array.isArray,
    promise: function promise(p) {
      return p && is.func(p.then);
    },
    iterator: function iterator(it) {
      return it && is.func(it.next) && is.func(it.throw);
    },
    task: function task(t) {
      return t && t[TASK];
    },
    observable: function observable(ob) {
      return ob && is.func(ob.subscribe);
    },
    buffer: function buffer(buf) {
      return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
    },
    pattern: function pattern(pat) {
      return pat && (typeof pat === 'string' || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
    },
    channel: function channel(ch) {
      return ch && is.func(ch.take) && is.func(ch.close);
    },
    helper: function helper(it) {
      return it && it[HELPER];
    }
  };
  function remove(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }
  function deferred() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var def = _extends({}, props);
    var promise = new Promise(function (resolve, reject) {
      def.resolve = resolve;
      def.reject = reject;
    });
    def.promise = promise;
    return def;
  }
  function arrayOfDeffered(length) {
    var arr = [];
    for (var i = 0; i < length; i++) {
      arr.push(deferred());
    }
    return arr;
  }
  function delay(ms) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var timeoutId = void 0;
    var promise = new Promise(function (resolve) {
      timeoutId = setTimeout(function () {
        return resolve(val);
      }, ms);
    });
    promise[CANCEL] = function () {
      return clearTimeout(timeoutId);
    };
    return promise;
  }
  function createMockTask() {
    var _ref;
    var running = true;
    var _result = void 0,
      _error = void 0;
    return _ref = {}, _defineProperty(_ref, TASK, true), _defineProperty(_ref, 'isRunning', function isRunning() {
      return running;
    }), _defineProperty(_ref, 'result', function result() {
      return _result;
    }), _defineProperty(_ref, 'error', function error() {
      return _error;
    }), _defineProperty(_ref, 'setRunning', function setRunning(b) {
      return running = b;
    }), _defineProperty(_ref, 'setResult', function setResult(r) {
      return _result = r;
    }), _defineProperty(_ref, 'setError', function setError(e) {
      return _error = e;
    }), _ref;
  }
  function autoInc() {
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return function () {
      return ++seed;
    };
  }
  var uid = exports.uid = autoInc();
  var kThrow = function kThrow(err) {
    throw err;
  };
  var kReturn = function kReturn(value) {
    return {
      value: value,
      done: true
    };
  };
  function makeIterator(next) {
    var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var isHelper = arguments[3];
    var iterator = {
      name: name,
      next: next,
      throw: thro,
      return: kReturn
    };
    if (isHelper) {
      iterator[HELPER] = true;
    }
    if (typeof Symbol !== 'undefined') {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }
    return iterator;
  }

  /**
    Print error in a useful way whether in a browser environment
    (with expandable error stack traces), or in a node.js environment
    (text-only log output)
   **/
  function log(level, message, error) {
    /*eslint-disable no-console*/
    if (typeof window === 'undefined') {
      console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
    } else {
      console[level](message, error);
    }
  }
  var internalErr = exports.internalErr = function internalErr(err) {
    return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
  };
  function wrapSagaDispatch(dispatch) {
    return function sagaDispatch(action) {
      var wrappedAction = Object.defineProperty(action, SAGA_ACTION, {
        value: true
      });
      return dispatch(wrappedAction);
    };
  }
  });

  unwrapExports(utils);
  var utils_1 = utils.check;
  var utils_2 = utils.remove;
  var utils_3 = utils.deferred;
  var utils_4 = utils.arrayOfDeffered;
  var utils_5 = utils.delay;
  var utils_6 = utils.createMockTask;
  var utils_7 = utils.autoInc;
  var utils_8 = utils.makeIterator;
  var utils_9 = utils.log;
  var utils_10 = utils.wrapSagaDispatch;
  var utils_11 = utils.sym;
  var utils_12 = utils.TASK;
  var utils_13 = utils.HELPER;
  var utils_14 = utils.MATCH;
  var utils_15 = utils.CANCEL;
  var utils_16 = utils.SAGA_ACTION;
  var utils_17 = utils.konst;
  var utils_18 = utils.kTrue;
  var utils_19 = utils.kFalse;
  var utils_20 = utils.noop;
  var utils_21 = utils.ident;
  var utils_22 = utils.is;
  var utils_23 = utils.uid;
  var utils_24 = utils.internalErr;

  var scheduler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.asap = asap;
  exports.suspend = suspend;
  exports.flush = flush;
  var queue = [];
  /**
    Variable to hold a counting semaphore
    - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
      already suspended)
    - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
      triggers flushing the queued tasks.
  **/
  var semaphore = 0;

  /**
    Executes a task 'atomically'. Tasks scheduled during this execution will be queued
    and flushed after this task has finished (assuming the scheduler endup in a released
    state).
  **/
  function exec(task) {
    try {
      suspend();
      task();
    } finally {
      flush();
    }
  }

  /**
    Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
  **/
  function asap(task) {
    if (!semaphore) {
      exec(task);
    } else {
      queue.push(task);
    }
  }

  /**
    Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
    scheduler is released.
  **/
  function suspend() {
    semaphore++;
  }

  /**
    Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
  **/
  function flush() {
    semaphore--;
    if (!semaphore && queue.length) {
      exec(queue.shift());
    }
  }
  });

  unwrapExports(scheduler);
  var scheduler_1 = scheduler.asap;
  var scheduler_2 = scheduler.suspend;
  var scheduler_3 = scheduler.flush;

  var io = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.asEffect = undefined;
  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
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
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  exports.take = take;
  exports.takem = takem;
  exports.put = put;
  exports.race = race;
  exports.call = call;
  exports.apply = apply;
  exports.cps = cps;
  exports.fork = fork;
  exports.spawn = spawn;
  exports.join = join;
  exports.cancel = cancel;
  exports.select = select;
  exports.actionChannel = actionChannel;
  exports.cancelled = cancelled;
  exports.flush = flush;

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
  var IO = (0, utils.sym)('IO');
  var TAKE = 'TAKE';
  var PUT = 'PUT';
  var RACE = 'RACE';
  var CALL = 'CALL';
  var CPS = 'CPS';
  var FORK = 'FORK';
  var JOIN = 'JOIN';
  var CANCEL = 'CANCEL';
  var SELECT = 'SELECT';
  var ACTION_CHANNEL = 'ACTION_CHANNEL';
  var CANCELLED = 'CANCELLED';
  var FLUSH = 'FLUSH';
  var effect = function effect(type, payload) {
    var _ref;
    return _ref = {}, _defineProperty(_ref, IO, true), _defineProperty(_ref, type, payload), _ref;
  };
  function take() {
    var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
    if (arguments.length) {
      (0, utils.check)(arguments[0], utils.is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
    }
    if (utils.is.pattern(patternOrChannel)) {
      return effect(TAKE, {
        pattern: patternOrChannel
      });
    }
    if (utils.is.channel(patternOrChannel)) {
      return effect(TAKE, {
        channel: patternOrChannel
      });
    }
    throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
  }
  function takem() {
    var eff = take.apply(undefined, arguments);
    eff[TAKE].maybe = true;
    return eff;
  }
  function put(channel, action) {
    if (arguments.length > 1) {
      (0, utils.check)(channel, utils.is.notUndef, 'put(channel, action): argument channel is undefined');
      (0, utils.check)(channel, utils.is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
      (0, utils.check)(action, utils.is.notUndef, 'put(channel, action): argument action is undefined');
    } else {
      (0, utils.check)(channel, utils.is.notUndef, 'put(action): argument action is undefined');
      action = channel;
      channel = null;
    }
    return effect(PUT, {
      channel: channel,
      action: action
    });
  }
  put.sync = function () {
    var eff = put.apply(undefined, arguments);
    eff[PUT].sync = true;
    return eff;
  };
  function race(effects) {
    return effect(RACE, effects);
  }
  function getFnCallDesc(meth, fn, args) {
    (0, utils.check)(fn, utils.is.notUndef, meth + ': argument fn is undefined');
    var context = null;
    if (utils.is.array(fn)) {
      var _fn = fn;
      var _fn2 = _slicedToArray(_fn, 2);
      context = _fn2[0];
      fn = _fn2[1];
    } else if (fn.fn) {
      var _fn3 = fn;
      context = _fn3.context;
      fn = _fn3.fn;
    }
    (0, utils.check)(fn, utils.is.func, meth + ': argument ' + fn + ' is not a function');
    return {
      context: context,
      fn: fn,
      args: args
    };
  }
  function call(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return effect(CALL, getFnCallDesc('call', fn, args));
  }
  function apply(context, fn) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return effect(CALL, getFnCallDesc('apply', {
      context: context,
      fn: fn
    }, args));
  }
  function cps(fn) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return effect(CPS, getFnCallDesc('cps', fn, args));
  }
  function fork(fn) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return effect(FORK, getFnCallDesc('fork', fn, args));
  }
  function spawn(fn) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    var eff = fork.apply(undefined, [fn].concat(args));
    eff[FORK].detached = true;
    return eff;
  }
  var isForkedTask = function isForkedTask(task) {
    return task[utils.TASK];
  };
  function join(task) {
    (0, utils.check)(task, utils.is.notUndef, 'join(task): argument task is undefined');
    if (!isForkedTask(task)) {
      throw new Error('join(task): argument ' + task + ' is not a valid Task object \n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)');
    }
    return effect(JOIN, task);
  }
  function cancel(task) {
    (0, utils.check)(task, utils.is.notUndef, 'cancel(task): argument task is undefined');
    if (!isForkedTask(task)) {
      throw new Error('cancel(task): argument ' + task + ' is not a valid Task object \n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)');
    }
    return effect(CANCEL, task);
  }
  function select(selector) {
    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }
    if (arguments.length === 0) {
      selector = utils.ident;
    } else {
      (0, utils.check)(selector, utils.is.notUndef, 'select(selector,[...]): argument selector is undefined');
      (0, utils.check)(selector, utils.is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
    }
    return effect(SELECT, {
      selector: selector,
      args: args
    });
  }

  /**
    channel(pattern, [buffer])    => creates an event channel for store actions
  **/
  function actionChannel(pattern, buffer) {
    (0, utils.check)(pattern, utils.is.notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
    if (arguments.length > 1) {
      (0, utils.check)(buffer, utils.is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
      (0, utils.check)(buffer, utils.is.notUndef, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
    }
    return effect(ACTION_CHANNEL, {
      pattern: pattern,
      buffer: buffer
    });
  }
  function cancelled() {
    return effect(CANCELLED, {});
  }
  function flush(channel) {
    (0, utils.check)(channel, utils.is.channel, 'flush(channel): argument ' + channel + ' is not valid channel');
    return effect(FLUSH, channel);
  }
  var asEffect = exports.asEffect = {
    take: function take(effect) {
      return effect && effect[IO] && effect[TAKE];
    },
    put: function put(effect) {
      return effect && effect[IO] && effect[PUT];
    },
    race: function race(effect) {
      return effect && effect[IO] && effect[RACE];
    },
    call: function call(effect) {
      return effect && effect[IO] && effect[CALL];
    },
    cps: function cps(effect) {
      return effect && effect[IO] && effect[CPS];
    },
    fork: function fork(effect) {
      return effect && effect[IO] && effect[FORK];
    },
    join: function join(effect) {
      return effect && effect[IO] && effect[JOIN];
    },
    cancel: function cancel(effect) {
      return effect && effect[IO] && effect[CANCEL];
    },
    select: function select(effect) {
      return effect && effect[IO] && effect[SELECT];
    },
    actionChannel: function actionChannel(effect) {
      return effect && effect[IO] && effect[ACTION_CHANNEL];
    },
    cancelled: function cancelled(effect) {
      return effect && effect[IO] && effect[CANCELLED];
    },
    flush: function flush(effect) {
      return effect && effect[IO] && effect[FLUSH];
    }
  };
  });

  unwrapExports(io);
  var io_1 = io.asEffect;
  var io_2 = io.take;
  var io_3 = io.takem;
  var io_4 = io.put;
  var io_5 = io.race;
  var io_6 = io.call;
  var io_7 = io.apply;
  var io_8 = io.cps;
  var io_9 = io.fork;
  var io_10 = io.spawn;
  var io_11 = io.join;
  var io_12 = io.cancel;
  var io_13 = io.select;
  var io_14 = io.actionChannel;
  var io_15 = io.cancelled;
  var io_16 = io.flush;

  var buffers_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.buffers = exports.BUFFER_OVERFLOW = undefined;

  var BUFFER_OVERFLOW = exports.BUFFER_OVERFLOW = 'Channel\'s Buffer overflow!';
  var ON_OVERFLOW_THROW = 1;
  var ON_OVERFLOW_DROP = 2;
  var ON_OVERFLOW_SLIDE = 3;
  var ON_OVERFLOW_EXPAND = 4;
  var zeroBuffer = {
    isEmpty: utils.kTrue,
    put: utils.noop,
    take: utils.noop
  };
  function ringBuffer() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var overflowAction = arguments[1];
    var arr = new Array(limit);
    var length = 0;
    var pushIndex = 0;
    var popIndex = 0;
    var push = function push(it) {
      arr[pushIndex] = it;
      pushIndex = (pushIndex + 1) % limit;
      length++;
    };
    var take = function take() {
      if (length != 0) {
        var it = arr[popIndex];
        arr[popIndex] = null;
        length--;
        popIndex = (popIndex + 1) % limit;
        return it;
      }
    };
    var flush = function flush() {
      var items = [];
      while (length) {
        items.push(take());
      }
      return items;
    };
    return {
      isEmpty: function isEmpty() {
        return length == 0;
      },
      put: function put(it) {
        if (length < limit) {
          push(it);
        } else {
          var doubledLimit = void 0;
          switch (overflowAction) {
            case ON_OVERFLOW_THROW:
              throw new Error(BUFFER_OVERFLOW);
            case ON_OVERFLOW_SLIDE:
              arr[pushIndex] = it;
              pushIndex = (pushIndex + 1) % limit;
              popIndex = pushIndex;
              break;
            case ON_OVERFLOW_EXPAND:
              doubledLimit = 2 * limit;
              arr = flush();
              length = arr.length;
              pushIndex = arr.length;
              popIndex = 0;
              arr.length = doubledLimit;
              limit = doubledLimit;
              push(it);
              break;
            // DROP
          }
        }
      },
      take: take,
      flush: flush
    };
  }
  var buffers = exports.buffers = {
    none: function none() {
      return zeroBuffer;
    },
    fixed: function fixed(limit) {
      return ringBuffer(limit, ON_OVERFLOW_THROW);
    },
    dropping: function dropping(limit) {
      return ringBuffer(limit, ON_OVERFLOW_DROP);
    },
    sliding: function sliding(limit) {
      return ringBuffer(limit, ON_OVERFLOW_SLIDE);
    },
    expanding: function expanding(initialSize) {
      return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
    }
  };
  });

  unwrapExports(buffers_1);
  var buffers_2 = buffers_1.buffers;
  var buffers_3 = buffers_1.BUFFER_OVERFLOW;

  var channel_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UNDEFINED_INPUT_ERROR = exports.INVALID_BUFFER = exports.isEnd = exports.END = undefined;
  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  exports.emitter = emitter;
  exports.channel = channel;
  exports.eventChannel = eventChannel;
  exports.stdChannel = stdChannel;


  var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
  var END = exports.END = {
    type: CHANNEL_END_TYPE
  };
  var isEnd = exports.isEnd = function isEnd(a) {
    return a && a.type === CHANNEL_END_TYPE;
  };
  function emitter() {
    var subscribers = [];
    function subscribe(sub) {
      subscribers.push(sub);
      return function () {
        return (0, utils.remove)(subscribers, sub);
      };
    }
    function emit(item) {
      var arr = subscribers.slice();
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i](item);
      }
    }
    return {
      subscribe: subscribe,
      emit: emit
    };
  }
  var INVALID_BUFFER = exports.INVALID_BUFFER = 'invalid buffer passed to channel factory function';
  var UNDEFINED_INPUT_ERROR = exports.UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';
  function channel() {
    var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : buffers_1.buffers.fixed();
    var closed = false;
    var takers = [];
    (0, utils.check)(buffer, utils.is.buffer, INVALID_BUFFER);
    function checkForbiddenStates() {
      if (closed && takers.length) {
        throw (0, utils.internalErr)('Cannot have a closed channel with pending takers');
      }
      if (takers.length && !buffer.isEmpty()) {
        throw (0, utils.internalErr)('Cannot have pending takers with non empty buffer');
      }
    }
    function put(input) {
      checkForbiddenStates();
      (0, utils.check)(input, utils.is.notUndef, UNDEFINED_INPUT_ERROR);
      if (closed) {
        return;
      }
      if (!takers.length) {
        return buffer.put(input);
      }
      for (var i = 0; i < takers.length; i++) {
        var cb = takers[i];
        if (!cb[utils.MATCH] || cb[utils.MATCH](input)) {
          takers.splice(i, 1);
          return cb(input);
        }
      }
    }
    function take(cb) {
      checkForbiddenStates();
      (0, utils.check)(cb, utils.is.func, 'channel.take\'s callback must be a function');
      if (closed && buffer.isEmpty()) {
        cb(END);
      } else if (!buffer.isEmpty()) {
        cb(buffer.take());
      } else {
        takers.push(cb);
        cb.cancel = function () {
          return (0, utils.remove)(takers, cb);
        };
      }
    }
    function flush(cb) {
      checkForbiddenStates(); // TODO: check if some new state should be forbidden now
      (0, utils.check)(cb, utils.is.func, 'channel.flush\' callback must be a function');
      if (closed && buffer.isEmpty()) {
        cb(END);
        return;
      }
      cb(buffer.flush());
    }
    function close() {
      checkForbiddenStates();
      if (!closed) {
        closed = true;
        if (takers.length) {
          var arr = takers;
          takers = [];
          for (var i = 0, len = arr.length; i < len; i++) {
            arr[i](END);
          }
        }
      }
    }
    return {
      take: take,
      put: put,
      flush: flush,
      close: close,
      get __takers__() {
        return takers;
      },
      get __closed__() {
        return closed;
      }
    };
  }
  function eventChannel(subscribe) {
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : buffers_1.buffers.none();
    var matcher = arguments[2];

    /**
      should be if(typeof matcher !== undefined) instead?
      see PR #273 for a background discussion
    **/
    if (arguments.length > 2) {
      (0, utils.check)(matcher, utils.is.func, 'Invalid match function passed to eventChannel');
    }
    var chan = channel(buffer);
    var unsubscribe = subscribe(function (input) {
      if (isEnd(input)) {
        chan.close();
      } else if (!matcher || matcher(input)) {
        chan.put(input);
      }
    });
    if (!utils.is.func(unsubscribe)) {
      throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
    }
    return {
      take: chan.take,
      flush: chan.flush,
      close: function close() {
        if (!chan.__closed__) {
          chan.close();
          unsubscribe();
        }
      }
    };
  }
  function stdChannel(subscribe) {
    var chan = eventChannel(subscribe);
    return _extends({}, chan, {
      take: function take(cb, matcher) {
        if (arguments.length > 1) {
          (0, utils.check)(matcher, utils.is.func, 'channel.take\'s matcher argument must be a function');
          cb[utils.MATCH] = matcher;
        }
        chan.take(cb);
      }
    });
  }
  });

  unwrapExports(channel_1);
  var channel_2 = channel_1.UNDEFINED_INPUT_ERROR;
  var channel_3 = channel_1.INVALID_BUFFER;
  var channel_4 = channel_1.isEnd;
  var channel_5 = channel_1.END;
  var channel_6 = channel_1.emitter;
  var channel_7 = channel_1.channel;
  var channel_8 = channel_1.eventChannel;
  var channel_9 = channel_1.stdChannel;

  var proc_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TASK_CANCEL = exports.CHANNEL_END = exports.NOT_ITERATOR_ERROR = undefined;
  exports.default = proc;





  function _defineEnumerableProperties(obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }
    return obj;
  }
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
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
  var isDev = "production" === 'development';
  var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';
  var CHANNEL_END = exports.CHANNEL_END = {
    toString: function toString() {
      return '@@redux-saga/CHANNEL_END';
    }
  };
  var TASK_CANCEL = exports.TASK_CANCEL = {
    toString: function toString() {
      return '@@redux-saga/TASK_CANCEL';
    }
  };
  var matchers = {
    wildcard: function wildcard() {
      return utils.kTrue;
    },
    default: function _default(pattern) {
      return function (input) {
        return input.type === pattern;
      };
    },
    array: function array(patterns) {
      return function (input) {
        return patterns.some(function (p) {
          return p === input.type;
        });
      };
    },
    predicate: function predicate(_predicate) {
      return function (input) {
        return _predicate(input);
      };
    }
  };
  function matcher(pattern) {
    return (pattern === '*' ? matchers.wildcard : utils.is.array(pattern) ? matchers.array : utils.is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
  }

  /**
    Used to track a parent task and its forks
    In the new fork model, forked tasks are attached by default to their parent
    We model this using the concept of Parent task && main Task
    main task is the main flow of the current Generator, the parent tasks is the
    aggregation of the main tasks + all its forked tasks.
    Thus the whole model represents an execution tree with multiple branches (vs the
    linear execution tree in sequential (non parallel) programming)

    A parent tasks has the following semantics
    - It completes iff all its forks either complete or all cancelled
    - If it's cancelled, all forks are cancelled as well
    - It aborts if any uncaught error bubbles up from forks
    - If it completes, the return value is the one returned by the main task
  **/
  function forkQueue(name, mainTask, cb) {
    var tasks = [],
      result = void 0,
      completed = false;
    addTask(mainTask);
    function abort(err) {
      cancelAll();
      cb(err, true);
    }
    function addTask(task) {
      tasks.push(task);
      task.cont = function (res, isErr) {
        if (completed) {
          return;
        }
        (0, utils.remove)(tasks, task);
        task.cont = utils.noop;
        if (isErr) {
          abort(res);
        } else {
          if (task === mainTask) {
            result = res;
          }
          if (!tasks.length) {
            completed = true;
            cb(result);
          }
        }
      };
      // task.cont.cancel = task.cancel
    }
    function cancelAll() {
      if (completed) {
        return;
      }
      completed = true;
      tasks.forEach(function (t) {
        t.cont = utils.noop;
        t.cancel();
      });
      tasks = [];
    }
    return {
      addTask: addTask,
      cancelAll: cancelAll,
      abort: abort,
      getTasks: function getTasks() {
        return tasks;
      },
      taskNames: function taskNames() {
        return tasks.map(function (t) {
          return t.name;
        });
      }
    };
  }
  function createTaskIterator(_ref) {
    var context = _ref.context,
      fn = _ref.fn,
      args = _ref.args;
    if (utils.is.iterator(fn)) {
      return fn;
    }

    // catch synchronous failures; see #152 and #441
    var result = void 0,
      error = void 0;
    try {
      result = fn.apply(context, args);
    } catch (err) {
      error = err;
    }

    // i.e. a generator function returns an iterator
    if (utils.is.iterator(result)) {
      return result;
    }

    // do not bubble up synchronous failures for detached forks
    // instead create a failed task. See #152 and #441
    return error ? (0, utils.makeIterator)(function () {
      throw error;
    }) : (0, utils.makeIterator)(function () {
      var pc = void 0;
      var eff = {
        done: false,
        value: result
      };
      var ret = function ret(value) {
        return {
          done: true,
          value: value
        };
      };
      return function (arg) {
        if (!pc) {
          pc = true;
          return eff;
        } else {
          return ret(arg);
        }
      };
    }());
  }
  function wrapHelper(helper) {
    return {
      fn: helper
    };
  }
  function proc(iterator) {
    var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return utils.noop;
    };
    var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utils.noop;
    var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : utils.noop;
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var parentEffectId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var name = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'anonymous';
    var cont = arguments[7];
    (0, utils.check)(iterator, utils.is.iterator, NOT_ITERATOR_ERROR);
    var sagaMonitor = options.sagaMonitor,
      logger = options.logger,
      onError = options.onError;
    var log = logger || utils.log;
    var stdChannel = (0, channel_1.stdChannel)(subscribe);
    /**
      Tracks the current effect cancellation
      Each time the generator progresses. calling runEffect will set a new value
      on it. It allows propagating cancellation to child effects
    **/
    next.cancel = utils.noop;

    /**
      Creates a new task descriptor for this generator, We'll also create a main task
      to track the main flow (besides other forked tasks)
    **/
    var task = newTask(parentEffectId, name, iterator, cont);
    var mainTask = {
      name: name,
      cancel: cancelMain,
      isRunning: true
    };
    var taskQueue = forkQueue(name, mainTask, end);

    /**
      cancellation of the main task. We'll simply resume the Generator with a Cancel
    **/
    function cancelMain() {
      if (mainTask.isRunning && !mainTask.isCancelled) {
        mainTask.isCancelled = true;
        next(TASK_CANCEL);
      }
    }

    /**
      This may be called by a parent generator to trigger/propagate cancellation
      cancel all pending tasks (including the main task), then end the current task.
        Cancellation propagates down to the whole execution tree holded by this Parent task
      It's also propagated to all joiners of this task and their execution tree/joiners
        Cancellation is noop for terminated/Cancelled tasks tasks
    **/
    function cancel() {
      /**
        We need to check both Running and Cancelled status
        Tasks can be Cancelled but still Running
      **/
      if (iterator._isRunning && !iterator._isCancelled) {
        iterator._isCancelled = true;
        taskQueue.cancelAll();
        /**
          Ending with a Never result will propagate the Cancellation to all joiners
        **/
        end(TASK_CANCEL);
      }
    }
    /**
      attaches cancellation logic to this task's continuation
      this will permit cancellation to propagate down the call chain
    **/
    cont && (cont.cancel = cancel);

    // tracks the running status
    iterator._isRunning = true;

    // kicks up the generator
    next();

    // then return the task descriptor to the caller
    return task;

    /**
      This is the generator driver
      It's a recursive async/continuation function which calls itself
      until the generator terminates or throws
    **/
    function next(arg, isErr) {
      // Preventive measure. If we end up here, then there is really something wrong
      if (!mainTask.isRunning) {
        throw new Error('Trying to resume an already finished generator');
      }
      try {
        var result = void 0;
        if (isErr) {
          result = iterator.throw(arg);
        } else if (arg === TASK_CANCEL) {
          /**
            getting TASK_CANCEL autoamtically cancels the main task
            We can get this value here
              - By cancelling the parent task manually
            - By joining a Cancelled task
          **/
          mainTask.isCancelled = true;
          /**
            Cancels the current effect; this will propagate the cancellation down to any called tasks
          **/
          next.cancel();
          /**
            If this Generator has a `return` method then invokes it
            Thill will jump to the finally block
          **/
          result = utils.is.func(iterator.return) ? iterator.return(TASK_CANCEL) : {
            done: true,
            value: TASK_CANCEL
          };
        } else if (arg === CHANNEL_END) {
          // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
          result = utils.is.func(iterator.return) ? iterator.return() : {
            done: true
          };
        } else {
          result = iterator.next(arg);
        }
        if (!result.done) {
          runEffect(result.value, parentEffectId, '', next);
        } else {
          /**
            This Generator has ended, terminate the main task and notify the fork queue
          **/
          mainTask.isMainRunning = false;
          mainTask.cont && mainTask.cont(result.value);
        }
      } catch (error) {
        if (mainTask.isCancelled) {
          log('error', 'uncaught at ' + name, error.message);
        }
        mainTask.isMainRunning = false;
        mainTask.cont(error, true);
      }
    }
    function end(result, isErr) {
      iterator._isRunning = false;
      stdChannel.close();
      if (!isErr) {
        if (result === TASK_CANCEL && isDev) {
          log('info', name + ' has been cancelled', '');
        }
        iterator._result = result;
        iterator._deferredEnd && iterator._deferredEnd.resolve(result);
      } else {
        if (result instanceof Error) {
          result.sagaStack = 'at ' + name + ' \n ' + (result.sagaStack || result.stack);
        }
        if (!task.cont) {
          log('error', 'uncaught', result.sagaStack || result.stack);
          if (result instanceof Error && onError) {
            onError(result);
          }
        }
        iterator._error = result;
        iterator._isAborted = true;
        iterator._deferredEnd && iterator._deferredEnd.reject(result);
      }
      task.cont && task.cont(result, isErr);
      task.joiners.forEach(function (j) {
        return j.cb(result, isErr);
      });
      task.joiners = null;
    }
    function runEffect(effect, parentEffectId) {
      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var cb = arguments[3];
      var effectId = (0, utils.uid)();
      sagaMonitor && sagaMonitor.effectTriggered({
        effectId: effectId,
        parentEffectId: parentEffectId,
        label: label,
        effect: effect
      });

      /**
        completion callback and cancel callback are mutually exclusive
        We can't cancel an already completed effect
        And We can't complete an already cancelled effectId
      **/
      var effectSettled = void 0;

      // Completion callback passed to the appropriate effect runner
      function currCb(res, isErr) {
        if (effectSettled) {
          return;
        }
        effectSettled = true;
        cb.cancel = utils.noop; // defensive measure
        if (sagaMonitor) {
          isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
        }
        cb(res, isErr);
      }
      // tracks down the current cancel
      currCb.cancel = utils.noop;

      // setup cancellation logic on the parent cb
      cb.cancel = function () {
        // prevents cancelling an already completed effect
        if (effectSettled) {
          return;
        }
        effectSettled = true;
        /**
          propagates cancel downward
          catch uncaught cancellations errors; since we can no longer call the completion
          callback, log errors raised during cancellations into the console
        **/
        try {
          currCb.cancel();
        } catch (err) {
          log('error', 'uncaught at ' + name, err.message);
        }
        currCb.cancel = utils.noop; // defensive measure

        sagaMonitor && sagaMonitor.effectCancelled(effectId);
      };

      /**
        each effect runner must attach its own logic of cancellation to the provided callback
        it allows this generator to propagate cancellation downward.
          ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
        And the setup must occur before calling the callback
          This is a sort of inversion of control: called async functions are responsible
        of completing the flow by calling the provided continuation; while caller functions
        are responsible for aborting the current flow by calling the attached cancel function
          Library users can attach their own cancellation logic to promises by defining a
        promise[CANCEL] method in their returned promises
        ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
      **/
      var data = void 0;
      return (
        // Non declarative effect
        utils.is.promise(effect) ? resolvePromise(effect, currCb) : utils.is.helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : utils.is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb)

        // declarative effects
        : utils.is.array(effect) ? runParallelEffect(effect, effectId, currCb) : utils.is.notUndef(data = io.asEffect.take(effect)) ? runTakeEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.put(effect)) ? runPutEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : utils.is.notUndef(data = io.asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : utils.is.notUndef(data = io.asEffect.cps(effect)) ? runCPSEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : utils.is.notUndef(data = io.asEffect.join(effect)) ? runJoinEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.select(effect)) ? runSelectEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.flush(effect)) ? runFlushEffect(data, currCb) : utils.is.notUndef(data = io.asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : /* anything else returned as is        */currCb(effect)
      );
    }
    function resolvePromise(promise, cb) {
      var cancelPromise = promise[utils.CANCEL];
      if (typeof cancelPromise === 'function') {
        cb.cancel = cancelPromise;
      }
      promise.then(cb, function (error) {
        return cb(error, true);
      });
    }
    function resolveIterator(iterator, effectId, name, cb) {
      proc(iterator, subscribe, dispatch, getState, options, effectId, name, cb);
    }
    function runTakeEffect(_ref2, cb) {
      var channel = _ref2.channel,
        pattern = _ref2.pattern,
        maybe = _ref2.maybe;
      channel = channel || stdChannel;
      var takeCb = function takeCb(inp) {
        return inp instanceof Error ? cb(inp, true) : (0, channel_1.isEnd)(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
      };
      try {
        channel.take(takeCb, matcher(pattern));
      } catch (err) {
        return cb(err, true);
      }
      cb.cancel = takeCb.cancel;
    }
    function runPutEffect(_ref3, cb) {
      var channel = _ref3.channel,
        action = _ref3.action,
        sync = _ref3.sync;

      /**
        Schedule the put in case another saga is holding a lock.
        The put will be executed atomically. ie nested puts will execute after
        this put has terminated.
      **/
      (0, scheduler.asap)(function () {
        var result = void 0;
        try {
          result = (channel ? channel.put : dispatch)(action);
        } catch (error) {
          // If we have a channel or `put.sync` was used then bubble up the error.
          if (channel || sync) return cb(error, true);
          log('error', 'uncaught at ' + name, error.stack || error.message || error);
        }
        if (sync && utils.is.promise(result)) {
          resolvePromise(result, cb);
        } else {
          return cb(result);
        }
      });
      // Put effects are non cancellables
    }
    function runCallEffect(_ref4, effectId, cb) {
      var context = _ref4.context,
        fn = _ref4.fn,
        args = _ref4.args;
      var result = void 0;
      // catch synchronous failures; see #152
      try {
        result = fn.apply(context, args);
      } catch (error) {
        return cb(error, true);
      }
      return utils.is.promise(result) ? resolvePromise(result, cb) : utils.is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
    }
    function runCPSEffect(_ref5, cb) {
      var context = _ref5.context,
        fn = _ref5.fn,
        args = _ref5.args;

      // CPS (ie node style functions) can define their own cancellation logic
      // by setting cancel field on the cb

      // catch synchronous failures; see #152
      try {
        (function () {
          var cpsCb = function cpsCb(err, res) {
            return utils.is.undef(err) ? cb(res) : cb(err, true);
          };
          fn.apply(context, args.concat(cpsCb));
          if (cpsCb.cancel) {
            cb.cancel = function () {
              return cpsCb.cancel();
            };
          }
        })();
      } catch (error) {
        return cb(error, true);
      }
    }
    function runForkEffect(_ref6, effectId, cb) {
      var context = _ref6.context,
        fn = _ref6.fn,
        args = _ref6.args,
        detached = _ref6.detached;
      var taskIterator = createTaskIterator({
        context: context,
        fn: fn,
        args: args
      });
      try {
        (0, scheduler.suspend)();
        var _task = proc(taskIterator, subscribe, dispatch, getState, options, effectId, fn.name, detached ? null : utils.noop);
        if (detached) {
          cb(_task);
        } else {
          if (taskIterator._isRunning) {
            taskQueue.addTask(_task);
            cb(_task);
          } else if (taskIterator._error) {
            taskQueue.abort(taskIterator._error);
          } else {
            cb(_task);
          }
        }
      } finally {
        (0, scheduler.flush)();
      }
      // Fork effects are non cancellables
    }
    function runJoinEffect(t, cb) {
      if (t.isRunning()) {
        (function () {
          var joiner = {
            task: task,
            cb: cb
          };
          cb.cancel = function () {
            return (0, utils.remove)(t.joiners, joiner);
          };
          t.joiners.push(joiner);
        })();
      } else {
        t.isAborted() ? cb(t.error(), true) : cb(t.result());
      }
    }
    function runCancelEffect(task, cb) {
      if (task.isRunning()) {
        task.cancel();
      }
      cb();
      // cancel effects are non cancellables
    }
    function runParallelEffect(effects, effectId, cb) {
      if (!effects.length) {
        return cb([]);
      }
      var completedCount = 0;
      var completed = void 0;
      var results = Array(effects.length);
      function checkEffectEnd() {
        if (completedCount === results.length) {
          completed = true;
          cb(results);
        }
      }
      var childCbs = effects.map(function (eff, idx) {
        var chCbAtIdx = function chCbAtIdx(res, isErr) {
          if (completed) {
            return;
          }
          if (isErr || (0, channel_1.isEnd)(res) || res === CHANNEL_END || res === TASK_CANCEL) {
            cb.cancel();
            cb(res, isErr);
          } else {
            results[idx] = res;
            completedCount++;
            checkEffectEnd();
          }
        };
        chCbAtIdx.cancel = utils.noop;
        return chCbAtIdx;
      });
      cb.cancel = function () {
        if (!completed) {
          completed = true;
          childCbs.forEach(function (chCb) {
            return chCb.cancel();
          });
        }
      };
      effects.forEach(function (eff, idx) {
        return runEffect(eff, effectId, idx, childCbs[idx]);
      });
    }
    function runRaceEffect(effects, effectId, cb) {
      var completed = void 0;
      var keys = Object.keys(effects);
      var childCbs = {};
      keys.forEach(function (key) {
        var chCbAtKey = function chCbAtKey(res, isErr) {
          if (completed) {
            return;
          }
          if (isErr) {
            // Race Auto cancellation
            cb.cancel();
            cb(res, true);
          } else if (!(0, channel_1.isEnd)(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
            cb.cancel();
            completed = true;
            cb(_defineProperty({}, key, res));
          }
        };
        chCbAtKey.cancel = utils.noop;
        childCbs[key] = chCbAtKey;
      });
      cb.cancel = function () {
        // prevents unnecessary cancellation
        if (!completed) {
          completed = true;
          keys.forEach(function (key) {
            return childCbs[key].cancel();
          });
        }
      };
      keys.forEach(function (key) {
        if (completed) {
          return;
        }
        runEffect(effects[key], effectId, key, childCbs[key]);
      });
    }
    function runSelectEffect(_ref7, cb) {
      var selector = _ref7.selector,
        args = _ref7.args;
      try {
        var state = selector.apply(undefined, [getState()].concat(_toConsumableArray(args)));
        cb(state);
      } catch (error) {
        cb(error, true);
      }
    }
    function runChannelEffect(_ref8, cb) {
      var pattern = _ref8.pattern,
        buffer = _ref8.buffer;
      var match = matcher(pattern);
      match.pattern = pattern;
      cb((0, channel_1.eventChannel)(subscribe, buffer || buffers_1.buffers.fixed(), match));
    }
    function runCancelledEffect(data, cb) {
      cb(!!mainTask.isCancelled);
    }
    function runFlushEffect(channel, cb) {
      channel.flush(cb);
    }
    function newTask(id, name, iterator, cont) {
      var _done, _ref9, _mutatorMap;
      iterator._deferredEnd = null;
      return _ref9 = {}, _defineProperty(_ref9, utils.TASK, true), _defineProperty(_ref9, 'id', id), _defineProperty(_ref9, 'name', name), _done = 'done', _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, _mutatorMap[_done].get = function () {
        if (iterator._deferredEnd) {
          return iterator._deferredEnd.promise;
        } else {
          var def = (0, utils.deferred)();
          iterator._deferredEnd = def;
          if (!iterator._isRunning) {
            iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
          }
          return def.promise;
        }
      }, _defineProperty(_ref9, 'cont', cont), _defineProperty(_ref9, 'joiners', []), _defineProperty(_ref9, 'cancel', cancel), _defineProperty(_ref9, 'isRunning', function isRunning() {
        return iterator._isRunning;
      }), _defineProperty(_ref9, 'isCancelled', function isCancelled() {
        return iterator._isCancelled;
      }), _defineProperty(_ref9, 'isAborted', function isAborted() {
        return iterator._isAborted;
      }), _defineProperty(_ref9, 'result', function result() {
        return iterator._result;
      }), _defineProperty(_ref9, 'error', function error() {
        return iterator._error;
      }), _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
    }
  }
  });

  unwrapExports(proc_1);
  var proc_2 = proc_1.TASK_CANCEL;
  var proc_3 = proc_1.CHANNEL_END;
  var proc_4 = proc_1.NOT_ITERATOR_ERROR;

  var runSaga_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.runSaga = runSaga;


  var _proc2 = _interopRequireDefault(proc_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  function runSaga(iterator, _ref) {
    var subscribe = _ref.subscribe,
      dispatch = _ref.dispatch,
      getState = _ref.getState,
      sagaMonitor = _ref.sagaMonitor,
      logger = _ref.logger;
    (0, utils.check)(iterator, utils.is.iterator, "runSaga must be called on an iterator");
    var effectId = (0, utils.uid)();
    if (sagaMonitor) {
      dispatch = (0, utils.wrapSagaDispatch)(dispatch);
      sagaMonitor.effectTriggered({
        effectId: effectId,
        root: true,
        parentEffectId: 0,
        effect: {
          root: true,
          saga: iterator,
          args: []
        }
      });
    }
    var task = (0, _proc2.default)(iterator, subscribe, dispatch, getState, {
      sagaMonitor: sagaMonitor,
      logger: logger
    }, effectId, iterator.name);
    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task);
    }
    return task;
  }
  });

  unwrapExports(runSaga_1);
  var runSaga_2 = runSaga_1.runSaga;

  var sagaHelpers = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
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
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  exports.takeEvery = takeEvery;
  exports.takeLatest = takeLatest;
  exports.throttle = throttle;




  var done = {
    done: true,
    value: undefined
  };
  var qEnd = {};
  function fsmIterator(fsm, q0) {
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';
    var updateState = void 0,
      qNext = q0;
    function next(arg, error) {
      if (qNext === qEnd) {
        return done;
      }
      if (error) {
        qNext = qEnd;
        throw error;
      } else {
        updateState && updateState(arg);
        var _fsm$qNext = fsm[qNext](),
          _fsm$qNext2 = _slicedToArray(_fsm$qNext, 3),
          q = _fsm$qNext2[0],
          output = _fsm$qNext2[1],
          _updateState = _fsm$qNext2[2];
        qNext = q;
        updateState = _updateState;
        return qNext === qEnd ? done : output;
      }
    }
    return (0, utils.makeIterator)(next, function (error) {
      return next(null, error);
    }, name, true);
  }
  function safeName(pattern) {
    if (Array.isArray(pattern)) {
      return String(pattern.map(function (entry) {
        return String(entry);
      }));
    } else {
      return String(pattern);
    }
  }
  function takeEvery(pattern, worker) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var yTake = {
      done: false,
      value: (0, io.take)(pattern)
    };
    var yFork = function yFork(ac) {
      return {
        done: false,
        value: io.fork.apply(undefined, [worker].concat(args, [ac]))
      };
    };
    var action = void 0,
      setAction = function setAction(ac) {
        return action = ac;
      };
    return fsmIterator({
      q1: function q1() {
        return ['q2', yTake, setAction];
      },
      q2: function q2() {
        return action === channel_1.END ? [qEnd] : ['q1', yFork(action)];
      }
    }, 'q1', 'takeEvery(' + safeName(pattern) + ', ' + worker.name + ')');
  }
  function takeLatest(pattern, worker) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }
    var yTake = {
      done: false,
      value: (0, io.take)(pattern)
    };
    var yFork = function yFork(ac) {
      return {
        done: false,
        value: io.fork.apply(undefined, [worker].concat(args, [ac]))
      };
    };
    var yCancel = function yCancel(task) {
      return {
        done: false,
        value: (0, io.cancel)(task)
      };
    };
    var task = void 0,
      action = void 0;
    var setTask = function setTask(t) {
      return task = t;
    };
    var setAction = function setAction(ac) {
      return action = ac;
    };
    return fsmIterator({
      q1: function q1() {
        return ['q2', yTake, setAction];
      },
      q2: function q2() {
        return action === channel_1.END ? [qEnd] : task ? ['q3', yCancel(task)] : ['q1', yFork(action), setTask];
      },
      q3: function q3() {
        return ['q1', yFork(action), setTask];
      }
    }, 'q1', 'takeLatest(' + safeName(pattern) + ', ' + worker.name + ')');
  }
  function throttle(delayLength, pattern, worker) {
    for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }
    var action = void 0,
      channel = void 0;
    var yActionChannel = {
      done: false,
      value: (0, io.actionChannel)(pattern, buffers_1.buffers.sliding(1))
    };
    var yTake = function yTake() {
      return {
        done: false,
        value: (0, io.take)(channel, pattern)
      };
    };
    var yFork = function yFork(ac) {
      return {
        done: false,
        value: io.fork.apply(undefined, [worker].concat(args, [ac]))
      };
    };
    var yDelay = {
      done: false,
      value: (0, io.call)(utils.delay, delayLength)
    };
    var setAction = function setAction(ac) {
      return action = ac;
    };
    var setChannel = function setChannel(ch) {
      return channel = ch;
    };
    return fsmIterator({
      q1: function q1() {
        return ['q2', yActionChannel, setChannel];
      },
      q2: function q2() {
        return ['q3', yTake(), setAction];
      },
      q3: function q3() {
        return action === channel_1.END ? [qEnd] : ['q4', yFork(action)];
      },
      q4: function q4() {
        return ['q2', yDelay];
      }
    }, 'q1', 'throttle(' + safeName(pattern) + ', ' + worker.name + ')');
  }
  });

  unwrapExports(sagaHelpers);
  var sagaHelpers_1 = sagaHelpers.takeEvery;
  var sagaHelpers_2 = sagaHelpers.takeLatest;
  var sagaHelpers_3 = sagaHelpers.throttle;

  var middleware = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sagaMiddlewareFactory;


  var _proc2 = _interopRequireDefault(proc_1);


  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  function sagaMiddlewareFactory() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var runSagaDynamically = void 0;
    var sagaMonitor = options.sagaMonitor;
    if (utils.is.func(options)) {
      {
        throw new Error('Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead');
      }
    }
    if (options.logger && !utils.is.func(options.logger)) {
      throw new Error('`options.logger` passed to the Saga middleware is not a function!');
    }
    if (options.onerror && !utils.is.func(options.onerror)) {
      throw new Error('`options.onerror` passed to the Saga middleware is not a function!');
    }
    function sagaMiddleware(_ref) {
      var getState = _ref.getState,
        dispatch = _ref.dispatch;
      runSagaDynamically = runSaga;
      var sagaEmitter = (0, channel_1.emitter)();
      var sagaDispatch = (0, utils.wrapSagaDispatch)(dispatch);
      function runSaga(saga, args, sagaId) {
        return (0, _proc2.default)(saga.apply(undefined, _toConsumableArray(args)), sagaEmitter.subscribe, sagaDispatch, getState, options, sagaId, saga.name);
      }
      return function (next) {
        return function (action) {
          if (sagaMonitor) {
            sagaMonitor.actionDispatched(action);
          }
          var result = next(action); // hit reducers
          if (action[utils.SAGA_ACTION]) {
            // Saga actions are already scheduled with asap in proc/runPutEffect
            sagaEmitter.emit(action);
          } else {
            (0, scheduler.asap)(function () {
              return sagaEmitter.emit(action);
            });
          }
          return result;
        };
      };
    }
    sagaMiddleware.run = function (saga) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      (0, utils.check)(runSagaDynamically, utils.is.notUndef, 'Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
      (0, utils.check)(saga, utils.is.func, 'sagaMiddleware.run(saga, ...args): saga argument must be a Generator function!');
      var effectId = (0, utils.uid)();
      if (sagaMonitor) {
        sagaMonitor.effectTriggered({
          effectId: effectId,
          root: true,
          parentEffectId: 0,
          effect: {
            root: true,
            saga: saga,
            args: args
          }
        });
      }
      var task = runSagaDynamically(saga, args, effectId);
      if (sagaMonitor) {
        sagaMonitor.effectResolved(effectId, task);
      }
      return task;
    };
    return sagaMiddleware;
  }
  });

  unwrapExports(middleware);

  var effects = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return io.take;
    }
  });
  Object.defineProperty(exports, 'takem', {
    enumerable: true,
    get: function get() {
      return io.takem;
    }
  });
  Object.defineProperty(exports, 'put', {
    enumerable: true,
    get: function get() {
      return io.put;
    }
  });
  Object.defineProperty(exports, 'race', {
    enumerable: true,
    get: function get() {
      return io.race;
    }
  });
  Object.defineProperty(exports, 'call', {
    enumerable: true,
    get: function get() {
      return io.call;
    }
  });
  Object.defineProperty(exports, 'apply', {
    enumerable: true,
    get: function get() {
      return io.apply;
    }
  });
  Object.defineProperty(exports, 'cps', {
    enumerable: true,
    get: function get() {
      return io.cps;
    }
  });
  Object.defineProperty(exports, 'fork', {
    enumerable: true,
    get: function get() {
      return io.fork;
    }
  });
  Object.defineProperty(exports, 'spawn', {
    enumerable: true,
    get: function get() {
      return io.spawn;
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return io.join;
    }
  });
  Object.defineProperty(exports, 'cancel', {
    enumerable: true,
    get: function get() {
      return io.cancel;
    }
  });
  Object.defineProperty(exports, 'select', {
    enumerable: true,
    get: function get() {
      return io.select;
    }
  });
  Object.defineProperty(exports, 'actionChannel', {
    enumerable: true,
    get: function get() {
      return io.actionChannel;
    }
  });
  Object.defineProperty(exports, 'cancelled', {
    enumerable: true,
    get: function get() {
      return io.cancelled;
    }
  });
  Object.defineProperty(exports, 'flush', {
    enumerable: true,
    get: function get() {
      return io.flush;
    }
  });
  });

  unwrapExports(effects);

  var utils$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  Object.defineProperty(exports, 'TASK', {
    enumerable: true,
    get: function get() {
      return utils.TASK;
    }
  });
  Object.defineProperty(exports, 'SAGA_ACTION', {
    enumerable: true,
    get: function get() {
      return utils.SAGA_ACTION;
    }
  });
  Object.defineProperty(exports, 'noop', {
    enumerable: true,
    get: function get() {
      return utils.noop;
    }
  });
  Object.defineProperty(exports, 'is', {
    enumerable: true,
    get: function get() {
      return utils.is;
    }
  });
  Object.defineProperty(exports, 'deferred', {
    enumerable: true,
    get: function get() {
      return utils.deferred;
    }
  });
  Object.defineProperty(exports, 'arrayOfDeffered', {
    enumerable: true,
    get: function get() {
      return utils.arrayOfDeffered;
    }
  });
  Object.defineProperty(exports, 'createMockTask', {
    enumerable: true,
    get: function get() {
      return utils.createMockTask;
    }
  });

  Object.defineProperty(exports, 'CHANNEL_END', {
    enumerable: true,
    get: function get() {
      return io.CHANNEL_END;
    }
  });
  Object.defineProperty(exports, 'asEffect', {
    enumerable: true,
    get: function get() {
      return io.asEffect;
    }
  });
  });

  unwrapExports(utils$1);

  var lib$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.utils = exports.effects = exports.CANCEL = exports.delay = exports.throttle = exports.takeLatest = exports.takeEvery = exports.buffers = exports.channel = exports.eventChannel = exports.END = exports.runSaga = undefined;

  Object.defineProperty(exports, 'runSaga', {
    enumerable: true,
    get: function get() {
      return runSaga_1.runSaga;
    }
  });

  Object.defineProperty(exports, 'END', {
    enumerable: true,
    get: function get() {
      return channel_1.END;
    }
  });
  Object.defineProperty(exports, 'eventChannel', {
    enumerable: true,
    get: function get() {
      return channel_1.eventChannel;
    }
  });
  Object.defineProperty(exports, 'channel', {
    enumerable: true,
    get: function get() {
      return channel_1.channel;
    }
  });

  Object.defineProperty(exports, 'buffers', {
    enumerable: true,
    get: function get() {
      return buffers_1.buffers;
    }
  });

  Object.defineProperty(exports, 'takeEvery', {
    enumerable: true,
    get: function get() {
      return sagaHelpers.takeEvery;
    }
  });
  Object.defineProperty(exports, 'takeLatest', {
    enumerable: true,
    get: function get() {
      return sagaHelpers.takeLatest;
    }
  });
  Object.defineProperty(exports, 'throttle', {
    enumerable: true,
    get: function get() {
      return sagaHelpers.throttle;
    }
  });

  Object.defineProperty(exports, 'delay', {
    enumerable: true,
    get: function get() {
      return utils.delay;
    }
  });
  Object.defineProperty(exports, 'CANCEL', {
    enumerable: true,
    get: function get() {
      return utils.CANCEL;
    }
  });

  var _middleware2 = _interopRequireDefault(middleware);

  var effects$1 = _interopRequireWildcard(effects);

  var utils$2 = _interopRequireWildcard(utils$1);
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  exports.default = _middleware2.default;
  exports.effects = effects$1;
  exports.utils = utils$2;
  });

  var createSagaMiddleware = unwrapExports(lib$1);
  var lib_1$1 = lib$1.utils;
  var lib_2$1 = lib$1.effects;
  var lib_3$1 = lib$1.CANCEL;
  var lib_4$1 = lib$1.delay;
  var lib_5 = lib$1.throttle;
  var lib_6 = lib$1.takeLatest;
  var lib_7 = lib$1.takeEvery;
  var lib_8 = lib$1.buffers;
  var lib_9 = lib$1.channel;
  var lib_10 = lib$1.eventChannel;
  var lib_11 = lib$1.END;
  var lib_12 = lib$1.runSaga;

  function createCollectionSaga (collectionName, {
    itemSaga,
    middleware
  }) {
    const itemsSelector = createCollectionItemsSelector(collectionName);
    return saga;
    function* saga() {
      const runningItemSagas = {};
      yield lib_7([RESET, ADD, REMOVE], syncItemSagas, runningItemSagas);
    }
    function* syncItemSagas(runningItemSagas) {
      const items = yield select(itemsSelector);
      yield* cancelStaleItemSagas(items, runningItemSagas);
      yield* forkNewItemSagas(items, runningItemSagas);
    }
    function* cancelStaleItemSagas(items, runningItemSagas) {
      yield Object.keys(runningItemSagas).map(runningItemId => {
        if (!(runningItemId in items)) {
          return cancel(runningItemSagas[runningItemId]);
        }
      });
    }
    function* forkNewItemSagas(items, runningItemSagas) {
      const tasks = yield Object.keys(items).map(itemId => {
        if (!runningItemSagas[itemId]) {
          return fork(runItemSaga, parseInt(itemId, 10));
        }
      });
      Object.keys(items).forEach((key, index) => {
        if (!runningItemSagas[key]) {
          runningItemSagas[key] = tasks[index];
        }
      });
    }
    function* runItemSaga(itemId) {
      const task = lib_12(itemSaga(), {
        subscribe(callback) {
          return middleware.subscribe(action => {
            if (!isItemAction(action, collectionName) || getItemIdFromItemAction(action) == itemId) {
              callback(action);
            }
          });
        },
        dispatch(action) {
          ensureItemActionId(action, collectionName, itemId);
          middleware.dispatch(action);
        },
        getState() {
          return addItemScope(middleware.getState(), collectionName, itemId);
        }
      });
      try {
        yield call(() => task.done);
      } finally {
        task.cancel();
      }
    }
  }
  function createMiddleware() {
    return function middleware({
      getState,
      dispatch
    }) {
      const sagaEmitter = emitter();
      middleware.getState = getState;
      middleware.dispatch = dispatch;
      middleware.subscribe = sagaEmitter.subscribe;
      return next => action => {
        const result = next(action);
        sagaEmitter.emit(action);
        return result;
      };
    };
  }
  function emitter() {
    const subscribers = [];
    function subscribe(sub) {
      subscribers.push(sub);
      return () => remove$1(subscribers, sub);
    }
    function emit(item) {
      const arr = subscribers.slice();
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i](item);
      }
    }
    return {
      subscribe,
      emit
    };
  }
  function remove$1(array, item) {
    const index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f$5 = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u = a.$$typeof;
      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f$5:
            case p:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case t:
                case r:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case d:
          return u;
      }
    }
  }
  function A(a) {
    return z(a) === m;
  }
  var AsyncMode = l;
  var ConcurrentMode = m;
  var ContextConsumer = k;
  var ContextProvider = h;
  var Element$1 = c;
  var ForwardRef = n;
  var Fragment = e;
  var Lazy = t;
  var Memo = r;
  var Portal = d;
  var Profiler = g;
  var StrictMode = f$5;
  var Suspense = p;
  var isAsyncMode = function (a) {
    return A(a) || z(a) === l;
  };
  var isConcurrentMode = A;
  var isContextConsumer = function (a) {
    return z(a) === k;
  };
  var isContextProvider = function (a) {
    return z(a) === h;
  };
  var isElement = function (a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };
  var isForwardRef = function (a) {
    return z(a) === n;
  };
  var isFragment = function (a) {
    return z(a) === e;
  };
  var isLazy = function (a) {
    return z(a) === t;
  };
  var isMemo = function (a) {
    return z(a) === r;
  };
  var isPortal = function (a) {
    return z(a) === d;
  };
  var isProfiler = function (a) {
    return z(a) === g;
  };
  var isStrictMode = function (a) {
    return z(a) === f$5;
  };
  var isSuspense = function (a) {
    return z(a) === p;
  };
  var isValidElementType = function (a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f$5 || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
  };
  var typeOf = z;

  var reactIs_production_min = {
  	AsyncMode: AsyncMode,
  	ConcurrentMode: ConcurrentMode,
  	ContextConsumer: ContextConsumer,
  	ContextProvider: ContextProvider,
  	Element: Element$1,
  	ForwardRef: ForwardRef,
  	Fragment: Fragment,
  	Lazy: Lazy,
  	Memo: Memo,
  	Portal: Portal,
  	Profiler: Profiler,
  	StrictMode: StrictMode,
  	Suspense: Suspense,
  	isAsyncMode: isAsyncMode,
  	isConcurrentMode: isConcurrentMode,
  	isContextConsumer: isContextConsumer,
  	isContextProvider: isContextProvider,
  	isElement: isElement,
  	isForwardRef: isForwardRef,
  	isFragment: isFragment,
  	isLazy: isLazy,
  	isMemo: isMemo,
  	isPortal: isPortal,
  	isProfiler: isProfiler,
  	isStrictMode: isStrictMode,
  	isSuspense: isSuspense,
  	isValidElementType: isValidElementType,
  	typeOf: typeOf
  };

  var reactIs_development = createCommonjsModule(function (module, exports) {
  });
  var reactIs_development_1 = reactIs_development.AsyncMode;
  var reactIs_development_2 = reactIs_development.ConcurrentMode;
  var reactIs_development_3 = reactIs_development.ContextConsumer;
  var reactIs_development_4 = reactIs_development.ContextProvider;
  var reactIs_development_5 = reactIs_development.Element;
  var reactIs_development_6 = reactIs_development.ForwardRef;
  var reactIs_development_7 = reactIs_development.Fragment;
  var reactIs_development_8 = reactIs_development.Lazy;
  var reactIs_development_9 = reactIs_development.Memo;
  var reactIs_development_10 = reactIs_development.Portal;
  var reactIs_development_11 = reactIs_development.Profiler;
  var reactIs_development_12 = reactIs_development.StrictMode;
  var reactIs_development_13 = reactIs_development.Suspense;
  var reactIs_development_14 = reactIs_development.isAsyncMode;
  var reactIs_development_15 = reactIs_development.isConcurrentMode;
  var reactIs_development_16 = reactIs_development.isContextConsumer;
  var reactIs_development_17 = reactIs_development.isContextProvider;
  var reactIs_development_18 = reactIs_development.isElement;
  var reactIs_development_19 = reactIs_development.isForwardRef;
  var reactIs_development_20 = reactIs_development.isFragment;
  var reactIs_development_21 = reactIs_development.isLazy;
  var reactIs_development_22 = reactIs_development.isMemo;
  var reactIs_development_23 = reactIs_development.isPortal;
  var reactIs_development_24 = reactIs_development.isProfiler;
  var reactIs_development_25 = reactIs_development.isStrictMode;
  var reactIs_development_26 = reactIs_development.isSuspense;
  var reactIs_development_27 = reactIs_development.isValidElementType;
  var reactIs_development_28 = reactIs_development.typeOf;

  var reactIs = createCommonjsModule(function (module) {

  {
    module.exports = reactIs_production_min;
  }
  });
  var reactIs_1 = reactIs.isValidElementType;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  function emptyFunction() {}
  function emptyFunctionWithReset() {}
  emptyFunctionWithReset.resetWarningCache = emptyFunction;
  var factoryWithThrowingShims = function () {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret_1) {
        // It is still safe when called from React.
        return;
      }
      var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
      err.name = 'Invariant Violation';
      throw err;
    }
    shim.isRequired = shim;
    function getShim() {
      return shim;
    }
    // Important!
    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
    var ReactPropTypes = {
      array: shim,
      bigint: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,
      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,
      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };
    ReactPropTypes.PropTypes = ReactPropTypes;
    return ReactPropTypes;
  };

  var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
  });

  var subscriptionShape = propTypes.shape({
    trySubscribe: propTypes.func.isRequired,
    tryUnsubscribe: propTypes.func.isRequired,
    notifyNestedSubs: propTypes.func.isRequired,
    isSubscribed: propTypes.func.isRequired
  });
  var storeShape = propTypes.shape({
    subscribe: propTypes.func.isRequired,
    dispatch: propTypes.func.isRequired,
    getState: propTypes.func.isRequired
  });

  var prefixUnsafeLifecycleMethods = typeof React$1__default.forwardRef !== "undefined";
  function createProvider(storeKey) {
    var _Provider$childContex;
    if (storeKey === void 0) {
      storeKey = 'store';
    }
    var subscriptionKey = storeKey + "Subscription";
    var Provider = /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(Provider, _Component);
      var _proto = Provider.prototype;
      _proto.getChildContext = function getChildContext() {
        var _ref;
        return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
      };
      function Provider(props, context) {
        var _this;
        _this = _Component.call(this, props, context) || this;
        _this[storeKey] = props.store;
        return _this;
      }
      _proto.render = function render() {
        return React$1.Children.only(this.props.children);
      };
      return Provider;
    }(React$1.Component);
    Provider.propTypes = {
      store: storeShape.isRequired,
      children: propTypes.element.isRequired
    };
    Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = storeShape.isRequired, _Provider$childContex[subscriptionKey] = subscriptionShape, _Provider$childContex);
    return Provider;
  }
  var Provider = createProvider();

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  function _extends$1() {
    _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends$1.apply(this, arguments);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */
  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };
  var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    '$$typeof': true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
  function getStatics(component) {
    // React v16.11 and below
    if (reactIs.isMemo(component)) {
      return MEMO_STATICS;
    } // React v16.12 and above

    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
  }
  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;
  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);
        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }
      var keys = getOwnPropertyNames(sourceComponent);
      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }
      var targetStatics = getStatics(targetComponent);
      var sourceStatics = getStatics(sourceComponent);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
          var descriptor = getOwnPropertyDescriptor$2(sourceComponent, key);
          try {
            // Avoid failures from read-only properties
            defineProperty(targetComponent, key, descriptor);
          } catch (e) {}
        }
      }
    }
    return targetComponent;
  }
  var hoistNonReactStatics_cjs = hoistNonReactStatics;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var invariant = function (condition, format, a, b, c, d, e, f) {
    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
  var invariant_1 = invariant;

  // encapsulates the subscription logic for connecting a component to the redux store, as
  // well as nesting subscriptions of descendant components, so that we can ensure the
  // ancestor components re-render before descendants
  var CLEARED = null;
  var nullListeners = {
    notify: function notify() {}
  };
  function createListenerCollection() {
    // the current/next pattern is copied from redux's createStore code.
    // TODO: refactor+expose that code to be reusable here?
    var current = [];
    var next = [];
    return {
      clear: function clear() {
        next = CLEARED;
        current = CLEARED;
      },
      notify: function notify() {
        var listeners = current = next;
        for (var i = 0; i < listeners.length; i++) {
          listeners[i]();
        }
      },
      get: function get() {
        return next;
      },
      subscribe: function subscribe(listener) {
        var isSubscribed = true;
        if (next === current) next = current.slice();
        next.push(listener);
        return function unsubscribe() {
          if (!isSubscribed || current === CLEARED) return;
          isSubscribed = false;
          if (next === current) next = current.slice();
          next.splice(next.indexOf(listener), 1);
        };
      }
    };
  }
  var Subscription = /*#__PURE__*/
  function () {
    function Subscription(store, parentSub, onStateChange) {
      this.store = store;
      this.parentSub = parentSub;
      this.onStateChange = onStateChange;
      this.unsubscribe = null;
      this.listeners = nullListeners;
    }
    var _proto = Subscription.prototype;
    _proto.addNestedSub = function addNestedSub(listener) {
      this.trySubscribe();
      return this.listeners.subscribe(listener);
    };
    _proto.notifyNestedSubs = function notifyNestedSubs() {
      this.listeners.notify();
    };
    _proto.isSubscribed = function isSubscribed() {
      return Boolean(this.unsubscribe);
    };
    _proto.trySubscribe = function trySubscribe() {
      if (!this.unsubscribe) {
        this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);
        this.listeners = createListenerCollection();
      }
    };
    _proto.tryUnsubscribe = function tryUnsubscribe() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
        this.listeners.clear();
        this.listeners = nullListeners;
      }
    };
    return Subscription;
  }();

  var prefixUnsafeLifecycleMethods$1 = typeof React$1__default.forwardRef !== "undefined";
  var hotReloadingVersion = 0;
  var dummyState = {};
  function noop() {}
  function makeSelectorStateful(sourceSelector, store) {
    // wrap the selector in an object that tracks its results between runs.
    var selector = {
      run: function runComponentSelector(props) {
        try {
          var nextProps = sourceSelector(store.getState(), props);
          if (nextProps !== selector.props || selector.error) {
            selector.shouldComponentUpdate = true;
            selector.props = nextProps;
            selector.error = null;
          }
        } catch (error) {
          selector.shouldComponentUpdate = true;
          selector.error = error;
        }
      }
    };
    return selector;
  }
  function connectAdvanced(
  /*
    selectorFactory is a func that is responsible for returning the selector function used to
    compute new props from state, props, and dispatch. For example:
       export default connectAdvanced((dispatch, options) => (state, props) => ({
        thing: state.things[props.thingId],
        saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
      }))(YourComponent)
     Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
    outside of their selector as an optimization. Options passed to connectAdvanced are passed to
    the selectorFactory, along with displayName and WrappedComponent, as the second argument.
     Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
    props. Do not use connectAdvanced directly without memoizing results between calls to your
    selector, otherwise the Connect component will re-render on every state or props change.
  */
  selectorFactory,
  // options object:
  _ref) {
    var _contextTypes, _childContextTypes;
    if (_ref === void 0) {
      _ref = {};
    }
    var _ref2 = _ref,
      _ref2$getDisplayName = _ref2.getDisplayName,
      getDisplayName = _ref2$getDisplayName === void 0 ? function (name) {
        return "ConnectAdvanced(" + name + ")";
      } : _ref2$getDisplayName,
      _ref2$methodName = _ref2.methodName,
      methodName = _ref2$methodName === void 0 ? 'connectAdvanced' : _ref2$methodName,
      _ref2$renderCountProp = _ref2.renderCountProp,
      renderCountProp = _ref2$renderCountProp === void 0 ? undefined : _ref2$renderCountProp,
      _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta,
      _ref2$storeKey = _ref2.storeKey,
      storeKey = _ref2$storeKey === void 0 ? 'store' : _ref2$storeKey,
      _ref2$withRef = _ref2.withRef,
      withRef = _ref2$withRef === void 0 ? false : _ref2$withRef,
      connectOptions = _objectWithoutPropertiesLoose(_ref2, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef"]);
    var subscriptionKey = storeKey + 'Subscription';
    var version = hotReloadingVersion++;
    var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = storeShape, _contextTypes[subscriptionKey] = subscriptionShape, _contextTypes);
    var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = subscriptionShape, _childContextTypes);
    return function wrapWithConnect(WrappedComponent) {
      invariant_1(reactIs_1(WrappedComponent), "You must pass a component to the function returned by " + (methodName + ". Instead received " + JSON.stringify(WrappedComponent)));
      var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
      var displayName = getDisplayName(wrappedComponentName);
      var selectorFactoryOptions = _extends$1({}, connectOptions, {
        getDisplayName: getDisplayName,
        methodName: methodName,
        renderCountProp: renderCountProp,
        shouldHandleStateChanges: shouldHandleStateChanges,
        storeKey: storeKey,
        withRef: withRef,
        displayName: displayName,
        wrappedComponentName: wrappedComponentName,
        WrappedComponent: WrappedComponent // TODO Actually fix our use of componentWillReceiveProps

        /* eslint-disable react/no-deprecated */
      });
      var Connect = /*#__PURE__*/
      function (_Component) {
        _inheritsLoose(Connect, _Component);
        function Connect(props, context) {
          var _this;
          _this = _Component.call(this, props, context) || this;
          _this.version = version;
          _this.state = {};
          _this.renderCount = 0;
          _this.store = props[storeKey] || context[storeKey];
          _this.propsMode = Boolean(props[storeKey]);
          _this.setWrappedInstance = _this.setWrappedInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
          invariant_1(_this.store, "Could not find \"" + storeKey + "\" in either the context or props of " + ("\"" + displayName + "\". Either wrap the root component in a <Provider>, ") + ("or explicitly pass \"" + storeKey + "\" as a prop to \"" + displayName + "\"."));
          _this.initSelector();
          _this.initSubscription();
          return _this;
        }
        var _proto = Connect.prototype;
        _proto.getChildContext = function getChildContext() {
          var _ref3;

          // If this component received store from props, its subscription should be transparent
          // to any descendants receiving store+subscription from context; it passes along
          // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
          // Connect to control ordering of notifications to flow top-down.
          var subscription = this.propsMode ? null : this.subscription;
          return _ref3 = {}, _ref3[subscriptionKey] = subscription || this.context[subscriptionKey], _ref3;
        };
        _proto.componentDidMount = function componentDidMount() {
          if (!shouldHandleStateChanges) return; // componentWillMount fires during server side rendering, but componentDidMount and
          // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
          // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
          // To handle the case where a child component may have triggered a state change by
          // dispatching an action in its componentWillMount, we have to re-run the select and maybe
          // re-render.

          this.subscription.trySubscribe();
          this.selector.run(this.props);
          if (this.selector.shouldComponentUpdate) this.forceUpdate();
        }; // Note: this is renamed below to the UNSAFE_ version in React >=16.3.0

        _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          this.selector.run(nextProps);
        };
        _proto.shouldComponentUpdate = function shouldComponentUpdate() {
          return this.selector.shouldComponentUpdate;
        };
        _proto.componentWillUnmount = function componentWillUnmount() {
          if (this.subscription) this.subscription.tryUnsubscribe();
          this.subscription = null;
          this.notifyNestedSubs = noop;
          this.store = null;
          this.selector.run = noop;
          this.selector.shouldComponentUpdate = false;
        };
        _proto.getWrappedInstance = function getWrappedInstance() {
          invariant_1(withRef, "To access the wrapped instance, you need to specify " + ("{ withRef: true } in the options argument of the " + methodName + "() call."));
          return this.wrappedInstance;
        };
        _proto.setWrappedInstance = function setWrappedInstance(ref) {
          this.wrappedInstance = ref;
        };
        _proto.initSelector = function initSelector() {
          var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
          this.selector = makeSelectorStateful(sourceSelector, this.store);
          this.selector.run(this.props);
        };
        _proto.initSubscription = function initSubscription() {
          if (!shouldHandleStateChanges) return; // parentSub's source should match where store came from: props vs. context. A component
          // connected to the store via props shouldn't use subscription from context, or vice versa.

          var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
          this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this)); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
          // the middle of the notification loop, where `this.subscription` will then be null. An
          // extra null check every change can be avoided by copying the method onto `this` and then
          // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
          // listeners logic is changed to not call listeners that have been unsubscribed in the
          // middle of the notification loop.

          this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
        };
        _proto.onStateChange = function onStateChange() {
          this.selector.run(this.props);
          if (!this.selector.shouldComponentUpdate) {
            this.notifyNestedSubs();
          } else {
            this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
            this.setState(dummyState);
          }
        };
        _proto.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
          // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
          // needs to notify nested subs. Once called, it unimplements itself until further state
          // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
          // a boolean check every time avoids an extra method call most of the time, resulting
          // in some perf boost.
          this.componentDidUpdate = undefined;
          this.notifyNestedSubs();
        };
        _proto.isSubscribed = function isSubscribed() {
          return Boolean(this.subscription) && this.subscription.isSubscribed();
        };
        _proto.addExtraProps = function addExtraProps(props) {
          if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props; // make a shallow copy so that fields added don't leak to the original selector.
          // this is especially important for 'ref' since that's a reference back to the component
          // instance. a singleton memoized selector would then be holding a reference to the
          // instance, preventing the instance from being garbage collected, and that would be bad

          var withExtras = _extends$1({}, props);
          if (withRef) withExtras.ref = this.setWrappedInstance;
          if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
          if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
          return withExtras;
        };
        _proto.render = function render() {
          var selector = this.selector;
          selector.shouldComponentUpdate = false;
          if (selector.error) {
            throw selector.error;
          } else {
            return React$1.createElement(WrappedComponent, this.addExtraProps(selector.props));
          }
        };
        return Connect;
      }(React$1.Component);
      if (prefixUnsafeLifecycleMethods$1) {
        // Use UNSAFE_ event name where supported
        Connect.prototype.UNSAFE_componentWillReceiveProps = Connect.prototype.componentWillReceiveProps;
        delete Connect.prototype.componentWillReceiveProps;
      }
      /* eslint-enable react/no-deprecated */

      Connect.WrappedComponent = WrappedComponent;
      Connect.displayName = displayName;
      Connect.childContextTypes = childContextTypes;
      Connect.contextTypes = contextTypes;
      Connect.propTypes = contextTypes;
      return hoistNonReactStatics_cjs(Connect, WrappedComponent);
    };
  }

  var hasOwn = Object.prototype.hasOwnProperty;
  function is$1(x, y) {
    if (x === y) {
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function shallowEqual(objA, objB) {
    if (is$1(objA, objB)) return true;
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
      return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwn.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
    return true;
  }

  function wrapMapToPropsConstant(getConstant) {
    return function initConstantSelector(dispatch, options) {
      var constant = getConstant(dispatch, options);
      function constantSelector() {
        return constant;
      }
      constantSelector.dependsOnOwnProps = false;
      return constantSelector;
    };
  } // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
  // to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
  // whether mapToProps needs to be invoked when props have changed.
  // 
  // A length of one signals that mapToProps does not depend on props from the parent component.
  // A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
  // therefore not reporting its length accurately..

  function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
  } // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
  // this function wraps mapToProps in a proxy function which does several things:
  // 
  //  * Detects whether the mapToProps function being called depends on props, which
  //    is used by selectorFactory to decide if it should reinvoke on props changes.
  //    
  //  * On first call, handles mapToProps if returns another function, and treats that
  //    new function as the true mapToProps for subsequent calls.
  //    
  //  * On first call, verifies the first result is a plain object, in order to warn
  //    the developer that their mapToProps function is not returning a valid result.
  //    

  function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, _ref) {
      var displayName = _ref.displayName;
      var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
        return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
      }; // allow detectFactoryAndVerify to get ownProps

      proxy.dependsOnOwnProps = true;
      proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
        proxy.mapToProps = mapToProps;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
        var props = proxy(stateOrDispatch, ownProps);
        if (typeof props === 'function') {
          proxy.mapToProps = props;
          proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
          props = proxy(stateOrDispatch, ownProps);
        }
        return props;
      };
      return proxy;
    };
  }

  function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
    return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps) : undefined;
  }
  function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
    return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
      return {
        dispatch: dispatch
      };
    }) : undefined;
  }
  function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
    return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
      return bindActionCreators(mapDispatchToProps, dispatch);
    }) : undefined;
  }
  var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

  function whenMapStateToPropsIsFunction(mapStateToProps) {
    return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps) : undefined;
  }
  function whenMapStateToPropsIsMissing(mapStateToProps) {
    return !mapStateToProps ? wrapMapToPropsConstant(function () {
      return {};
    }) : undefined;
  }
  var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

  function defaultMergeProps(stateProps, dispatchProps, ownProps) {
    return _extends$1({}, ownProps, stateProps, dispatchProps);
  }
  function wrapMergePropsFunc(mergeProps) {
    return function initMergePropsProxy(dispatch, _ref) {
      var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;
      var hasRunOnce = false;
      var mergedProps;
      return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
        var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        if (hasRunOnce) {
          if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
        } else {
          hasRunOnce = true;
          mergedProps = nextMergedProps;
        }
        return mergedProps;
      };
    };
  }
  function whenMergePropsIsFunction(mergeProps) {
    return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
  }
  function whenMergePropsIsOmitted(mergeProps) {
    return !mergeProps ? function () {
      return defaultMergeProps;
    } : undefined;
  }
  var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

  function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
    return function impureFinalPropsSelector(state, ownProps) {
      return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
    };
  }
  function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
    var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;
    var hasRunAtLeastOnce = false;
    var state;
    var ownProps;
    var stateProps;
    var dispatchProps;
    var mergedProps;
    function handleFirstCall(firstState, firstOwnProps) {
      state = firstState;
      ownProps = firstOwnProps;
      stateProps = mapStateToProps(state, ownProps);
      dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      hasRunAtLeastOnce = true;
      return mergedProps;
    }
    function handleNewPropsAndNewState() {
      stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleNewProps() {
      if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleNewState() {
      var nextStateProps = mapStateToProps(state, ownProps);
      var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
      stateProps = nextStateProps;
      if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleSubsequentCalls(nextState, nextOwnProps) {
      var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
      var stateChanged = !areStatesEqual(nextState, state);
      state = nextState;
      ownProps = nextOwnProps;
      if (propsChanged && stateChanged) return handleNewPropsAndNewState();
      if (propsChanged) return handleNewProps();
      if (stateChanged) return handleNewState();
      return mergedProps;
    }
    return function pureFinalPropsSelector(nextState, nextOwnProps) {
      return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    };
  } // TODO: Add more comments
  // If pure is true, the selector returned by selectorFactory will memoize its results,
  // allowing connectAdvanced's shouldComponentUpdate to return false if final
  // props have not changed. If false, the selector will always return a new
  // object and shouldComponentUpdate will always return true.

  function finalPropsSelectorFactory(dispatch, _ref2) {
    var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutPropertiesLoose(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);
    var mapStateToProps = initMapStateToProps(dispatch, options);
    var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
    var mergeProps = initMergeProps(dispatch, options);
    var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
    return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
  }

  /*
    connect is a facade over connectAdvanced. It turns its args into a compatible
    selectorFactory, which has the signature:

      (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
    
    connect passes its args to connectAdvanced as options, which will in turn pass them to
    selectorFactory each time a Connect component instance is instantiated or hot reloaded.

    selectorFactory returns a final props selector from its mapStateToProps,
    mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
    mergePropsFactories, and pure args.

    The resulting final props selector is called by the Connect component instance whenever
    it receives new props or store state.
   */

  function match(arg, factories, name) {
    for (var i = factories.length - 1; i >= 0; i--) {
      var result = factories[i](arg);
      if (result) return result;
    }
    return function (dispatch, options) {
      throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
    };
  }
  function strictEqual(a, b) {
    return a === b;
  } // createConnect with default args builds the 'official' connect behavior. Calling it with
  // different options opens up some testing and extensibility scenarios

  function createConnect(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === void 0 ? defaultMergePropsFactories : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;
    return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
      if (_ref2 === void 0) {
        _ref2 = {};
      }
      var _ref3 = _ref2,
        _ref3$pure = _ref3.pure,
        pure = _ref3$pure === void 0 ? true : _ref3$pure,
        _ref3$areStatesEqual = _ref3.areStatesEqual,
        areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
        _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
        areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua,
        _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
        areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq,
        _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
        areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE,
        extraOptions = _objectWithoutPropertiesLoose(_ref3, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);
      var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
      var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
      var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
      return connectHOC(selectorFactory, _extends$1({
        // used in error messages
        methodName: 'connect',
        // used to compute Connect's displayName from the wrapped component's displayName.
        getDisplayName: function getDisplayName(name) {
          return "Connect(" + name + ")";
        },
        // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
        shouldHandleStateChanges: Boolean(mapStateToProps),
        // passed through to selectorFactory
        initMapStateToProps: initMapStateToProps,
        initMapDispatchToProps: initMapDispatchToProps,
        initMergeProps: initMergeProps,
        pure: pure,
        areStatesEqual: areStatesEqual,
        areOwnPropsEqual: areOwnPropsEqual,
        areStatePropsEqual: areStatePropsEqual,
        areMergedPropsEqual: areMergedPropsEqual
      }, extraOptions));
    };
  }
  var connect = createConnect();

  function createCollectionItemScopeConnector (collectionName) {
    const itemScopeProperty = getItemScopeProperty(collectionName);
    return function connectInItemScope(mapStateToProps, mapDispatchToProps, mergeProps) {
      const connecter = connect(mapStateToProps ? (state, props) => {
        const result = mapStateToProps(addItemScope(state, collectionName, props[itemScopeProperty]), props);
        if (typeof result == 'function') {
          return function (state, props) {
            return result(addItemScope(state, collectionName, props[itemScopeProperty]), props);
          };
        }
        return result;
      } : null, mapDispatchToProps ? (dispatch, props) => {
        const wrappedDispatch = function (action) {
          ensureItemActionId(action, collectionName, props[itemScopeProperty]);
          return dispatch(action);
        };
        if (typeof mapDispatchToProps == 'function') {
          return mapDispatchToProps(wrappedDispatch, props);
        } else {
          return bindActionCreators(mapDispatchToProps, wrappedDispatch);
        }
      } : null, mergeProps);
      return function (Component) {
        const Connected = connecter(Component);
        class ConnectedInItemScope extends React$1__default.Component {
          render() {
            const props = {
              ...this.props,
              [itemScopeProperty]: this.context[itemScopeProperty]
            };
            return /*#__PURE__*/React$1__default.createElement(Connected, props);
          }
        }
        ConnectedInItemScope.contextTypes = {
          [itemScopeProperty]: React$1__default.PropTypes.number
        };
        return ConnectedInItemScope;
      };
    };
  }

  function createItemScopeProvider (collectionName) {
    class ItemScopeProvider extends React$1__default.Component {
      getChildContext() {
        return {
          [getItemScopeProperty(collectionName)]: this.props.itemId
        };
      }
      render() {
        return this.props.children;
      }
    }
    ItemScopeProvider.childContextTypes = {
      [getItemScopeProperty(collectionName)]: React$1__default.PropTypes.number
    };
    return ItemScopeProvider;
  }

  function pickAttributes (attributeNames, record, additionalAttributes) {
    const result = camelize.deep(attributeNames.reduce((result, attributeName) => {
      if (typeof attributeName == 'object') {
        const key = Object.keys(attributeName)[0];
        const value = attributeName[key];
        result[key] = record[value];
      } else {
        result[attributeName] = record[attributeName];
      }
      return result;
    }, {}));
    if (additionalAttributes) {
      return {
        ...result,
        ...camelize.deep(additionalAttributes)
      };
    }
    return result;
  }

  function watchBackboneCollection ({
    collection,
    dispatch,
    collectionName,
    idAttribute = 'id',
    attributes = ['id'],
    includeConfiguration = false
  }) {
    dispatch(reset({
      collectionName,
      items: collection.map(modelToAttributes)
    }));
    collection.on('add', model => {
      if (!model.isNew()) {
        dispatch(add({
          collectionName,
          attributes: modelToAttributes(model)
        }));
      }
    });
    collection.on('change:id', model => {
      dispatch(add({
        collectionName,
        attributes: modelToAttributes(model),
        order: collection.pluck(idAttribute)
      }));
    });
    collection.on('change', model => {
      if (watchedAttributeHasChanged(model)) {
        dispatch(change({
          collectionName,
          attributes: modelToAttributes(model)
        }));
      }
    });
    if (includeConfiguration) {
      collection.on('change:configuration', model => {
        dispatch(change({
          collectionName,
          attributes: modelToAttributes(model)
        }));
      });
    }
    collection.on('remove', model => {
      setTimeout(() => {
        dispatch(remove({
          collectionName,
          attributes: modelToAttributes(model),
          order: collection.pluck(idAttribute)
        }));
      }, 0);
    });
    collection.on('sort', () => {
      dispatch(order({
        collectionName,
        order: collection.pluck(idAttribute)
      }));
    });
    const watchedAttributes = attributes.map(attribute => typeof attribute == 'object' ? mappedAttributeSource(attribute) : attribute);
    function watchedAttributeHasChanged(model) {
      return watchedAttributes.some(attribute => model.hasChanged(attribute));
    }
    function modelToAttributes(model) {
      return pickAttributes(attributes, model.attributes, includeConfiguration && model.configuration.attributes);
    }
    function mappedAttributeSource(attribute) {
      return attribute[Object.keys(attribute)[0]];
    }
  }

  function loadFromSeed ({
    collection,
    collectionName,
    dispatch,
    attributes = ['id'],
    includeConfiguration = false
  }) {
    dispatch(reset({
      collectionName,
      items: collection.map(record => pickAttributes(attributes, record, includeConfiguration && record.configuration))
    }));
  }

  function watch ({
    collection,
    collectionName,
    dispatch,
    idAttribute,
    attributes,
    includeConfiguration
  }) {
    const delegate = Backbone.Collection && collection instanceof Backbone.Collection ? watchBackboneCollection : loadFromSeed;
    delegate({
      collection,
      collectionName,
      dispatch,
      idAttribute,
      attributes,
      includeConfiguration
    });
  }

  function findThumbnailCandidate({
    candidates,
    page,
    fileExists
  }) {
    return candidates.find(candidate => {
      if (candidate.condition && !conditionMet(candidate.condition, page)) {
        return false;
      }
      var id = thumbnailCandidateId(page, candidate);
      return fileExists(camelize(candidate.collectionName), id);
    });
  }
  function conditionMet(condition, page) {
    const value = page[camelize(condition.attribute)];
    if (condition.negated) {
      return value != condition.value;
    } else {
      return value == condition.value;
    }
  }
  function thumbnailCandidateId(page, candidate) {
    return 'id' in candidate ? candidate.id : page[camelize(candidate.attribute)];
  }

  function expandUrls (collectionName, file, urlTemplates) {
    if (!file) {
      return null;
    }
    if (!urlTemplates[collectionName]) {
      throw new Error(`No file url templates found for ${collectionName}`);
    }
    const variants = file.variants || Object.keys(urlTemplates[collectionName]);
    const urls = variants.reduce((result, variant) => {
      const url = getFileUrl(collectionName, file, variant, urlTemplates);
      if (url) {
        result[variant] = url;
      }
      return result;
    }, {});
    return {
      urls,
      ...file
    };
  }
  function getFileUrl(collectionName, file, quality, urlTemplates) {
    const templates = urlTemplates[collectionName];
    const template = templates[quality];
    if (template) {
      return template.replace(':id_partition', idPartition(file.id)).replace(':basename', file.basename).replace(':processed_extension', file.processedExtension).replace(':pageflow_hls_qualities', () => hlsQualities(file));
    }
  }
  function idPartition(id) {
    return partition(pad(id, 9));
  }
  function partition(string, separator) {
    return string.replace(/./g, function (c, i, a) {
      return i && (a.length - i) % 3 === 0 ? '/' + c : c;
    });
  }
  function pad(string, size) {
    return (Array(size).fill(0).join('') + string).slice(-size);
  }
  function hlsQualities(file) {
    return ['low', 'medium', 'high', 'fullhd', '4k'].filter(quality => file.variants.includes(quality)).join(',');
  }

  function addTypeInfo (collectionName, file, modelTypes) {
    if (!file) {
      return null;
    }
    if (!modelTypes[collectionName]) {
      throw new Error(`Could not find model type for collection name ${collectionName}`);
    }
    return {
      ...file,
      collectionName,
      modelType: modelTypes[collectionName]
    };
  }

  function file(collectionName, options) {
    return memoizedSelector(createItemSelector(collectionName, {
      namespace: 'files'
    })(options), state => state.fileUrlTemplates, state => state.modelTypes, function (file, fileUrlTemplates, modelTypes) {
      return extendFile(collectionName, file, fileUrlTemplates, modelTypes);
    });
  }
  function nestedFiles(collectionName, {
    parent
  }) {
    return memoizedSelector(createCollectionItemsSelector(collectionName, {
      namespace: 'files'
    }), parent, state => state.fileUrlTemplates, state => state.modelTypes, (files, parentFile, fileUrlTemplates, modelTypes) => {
      if (!parentFile) {
        return [];
      }
      return Object.keys(files).reduce((result, fileId) => {
        const file = files[fileId];
        if (file.id && file.parentFileId == parentFile.id && file.parentFileModelType == parentFile.modelType) {
          result.push(extendFile(collectionName, file, fileUrlTemplates, modelTypes));
        }
        return result;
      }, []);
    });
  }
  function fileExists() {
    return memoizedSelector(state => state.files, files => function (collectionName, id) {
      return id && !!createItemSelector(collectionName)({
        id
      })(files);
    });
  }
  function extendFile(collectionName, file, fileUrlTemplates, modelTypes) {
    return addTypeInfo(collectionName, expandUrls(collectionName, file, fileUrlTemplates), modelTypes);
  }

  function pageType({
    page
  }) {
    return function (state, props) {
      const _page = typeof page == 'function' ? page(props) : page;
      return _page ? state.pageTypes[camelize(_page.type)] : null;
    };
  }

  function pageBackgroundImageUrl({
    page: pageSelector,
    variant = 'medium'
  }) {
    return memoizedSelector(pageSelector, fileExists(), state => state, (page, fileExists, state) => {
      if (!page) {
        return undefined;
      }
      const pageType$1 = pageType({
        page
      })(state);
      const candidate = findThumbnailCandidate({
        candidates: pageType$1.thumbnailCandidates,
        page,
        fileExists
      });
      if (!candidate) {
        return undefined;
      }
      var fileSelector = file(camelize(candidate.collectionName), {
        id: thumbnailCandidateId(page, candidate)
      });
      if (candidate.collectionName == 'image_files') {
        return fileSelector(state).urls[variant];
      } else if (candidate.collectionName == 'video_files') {
        return fileSelector(state).urls[`poster_${variant}`];
      }
    });
  }

  const selector = createItemSelector('pages');
  const firstPage = createFirstItemSelector('pages');
  function firstPageAttribures() {
    return memoizedSelector(firstPage, page => page && page.attributes);
  }
  function firstPageAttribute(property) {
    return memoizedSelector(firstPage, page => page && page.attributes[property]);
  }
  function pageAttribute(property, options) {
    return memoizedSelector(selector(options), page => page && page.attributes[property]);
  }
  function pageAttributes(options) {
    return memoizedSelector(selector(options), page => page && page.attributes);
  }
  function pageState(property, options) {
    return memoizedSelector(selector(options), page => page && page.state.custom[property]);
  }
  function pageIsActive(options) {
    return commonPageState('isActive', options);
  }
  function pageIsActivated(options) {
    return commonPageState('isActivated', options);
  }
  function pageIsPreloaded(options) {
    return commonPageState('isPreloaded', options);
  }
  function pageIsPrepared(options) {
    return commonPageState('isPrepared', options);
  }
  function initialScrollerPosition$1(options) {
    return commonPageState('initialScrollerPosition', options);
  }
  function commonPageState(property, options) {
    return memoizedSelector(selector(options), page => page && page.state.common[property]);
  }

  function* scheduleUnprepare () {
    yield lib_6([PAGE_SCHEDULE_UNPREPARE, PAGE_DID_PREPARE, PAGE_WILL_ACTIVATE], scheduleUnprepare$1);
  }
  function* scheduleUnprepare$1(action) {
    if (action.type == PAGE_SCHEDULE_UNPREPARE) {
      yield call(lib_4$1, 5000);
      yield put(pageDidUnprepare());
    }
  }

  function* updating (pagesCollection) {
    if (!(pagesCollection instanceof Backbone.Collection)) {
      return;
    }
    yield lib_7(UPDATE_PAGE_ATTRIBUTE, function* (action) {
      yield call(updatePageAttribute$1, {
        pagesCollection,
        id: getItemIdFromItemAction(action),
        name: action.payload.name,
        value: action.payload.value
      });
    });
    yield lib_7(UPDATE_PAGE_LINK, function* (action) {
      yield call(updatePageLink$1, {
        pagesCollection,
        pageId: getItemIdFromItemAction(action),
        linkId: action.payload.linkId,
        name: action.payload.name,
        value: action.payload.value
      });
    });
  }
  function updatePageLink$1({
    pagesCollection,
    pageId,
    linkId,
    name,
    value
  }) {
    const pageLink = getPage(pagesCollection, pageId).pageLinks().get(linkId);
    if (!pageLink) {
      throw new Error(`Could not find page link with id ${linkId} in page with perma id ${pageId}.`);
    }
    pageLink.set(name, value);
  }
  function updatePageAttribute$1({
    pagesCollection,
    id,
    name,
    value
  }) {
    getPage(pagesCollection, id).configuration.set(name, value);
  }
  function getPage(collection, id) {
    const page = collection.where({
      'perma_id': id
    })[0];
    if (!page) {
      throw new Error(`Could not find page with perma id ${id}.`);
    }
    return page;
  }

  function createPageSaga ({
    pages,
    pageTypeSagas
  }) {
    return function* () {
      yield* scheduleUnprepare();
      yield* updating(pages);
      let task;
      yield lib_7(ENHANCE, function* () {
        const thisPageType = yield select(pageAttribute('type'));
        const pageTypeSaga = pageTypeSagas[thisPageType];
        if (pageTypeSaga) {
          task = yield fork(pageTypeSaga);
        }
      });
      yield lib_7(CLEANUP, function* () {
        if (task) {
          yield cancel(task);
        }
      });
    };
  }

  class MediaContextProvider extends React$1__default.Component {
    getChildContext() {
      return {
        mediaContext: this.props.mediaContext
      };
    }
    render() {
      return this.props.children;
    }
  }
  MediaContextProvider.childContextTypes = {
    mediaContext: React$1__default.PropTypes.object
  };

  const PageProvider = createItemScopeProvider('pages');
  function createReactPageType ({
    Component,
    store,
    selectTargetElement = pageElement => pageElement[0]
  }) {
    return {
      scroller: false,
      enhance(pageElement, configuration) {
        ReactDOM.render( /*#__PURE__*/React$1__default.createElement(Provider, {
          store: store
        }, /*#__PURE__*/React$1__default.createElement(PageProvider, {
          itemId: pageId(pageElement)
        }, /*#__PURE__*/React$1__default.createElement(MediaContextProvider, {
          mediaContext: {
            page: pageElement.page('instance')
          }
        }, /*#__PURE__*/React$1__default.createElement(Component, null)))), selectTargetElement(pageElement));
        store.dispatch(enhance({
          id: pageId(pageElement)
        }));
      },
      preload(pageElement) {
        store.dispatch(pageDidPreload({
          id: pageId(pageElement)
        }));
      },
      prepare(pageElement) {
        store.dispatch(pageDidPrepare({
          id: pageId(pageElement)
        }));
      },
      unprepare(pageElement) {
        store.dispatch(pageScheduleUnprepare({
          id: pageId(pageElement)
        }));
      },
      activating(pageElement, configuration, options) {
        store.dispatch(pageWillActivate({
          id: pageId(pageElement),
          position: options.position
        }));
      },
      activated(pageElement) {
        store.dispatch(pageDidActivate({
          id: pageId(pageElement)
        }));
      },
      deactivating(pageElement) {
        store.dispatch(pageWillDeactivate({
          id: pageId(pageElement)
        }));
      },
      deactivated(pageElement) {
        store.dispatch(pageDidDeactivate({
          id: pageId(pageElement)
        }));
      },
      resize(pageElement) {
        store.dispatch(pageDidResize({
          id: pageId(pageElement)
        }));
      },
      update(pageElement, configuration) {
        pageflow.commonPageCssClasses.updateCommonPageCssClasses(pageElement, configuration);
      },
      cleanup(pageElement) {
        store.dispatch(cleanup({
          id: pageId(pageElement)
        }));
        ReactDOM.unmountComponentAtNode(pageElement[0]);
      }
    };
  }
  function pageId(pageElement) {
    return parseInt(pageElement.attr('id'), 10);
  }

  function mergePageTypes(base, mixin) {
    return Object.keys(mixin).reduce((result, memberName) => {
      if (typeof base[memberName] == 'function') {
        result[memberName] = function (...args) {
          base[memberName].apply(this, args);
          return mixin[memberName].apply(this, args);
        };
      } else {
        result[memberName] = mixin[memberName];
      }
      return result;
    }, {
      ...base
    });
  }

  var pagesModule = {
    init({
      pages,
      dispatch
    }) {
      watch({
        collection: pages,
        collectionName: 'pages',
        dispatch,
        idAttribute: 'perma_id',
        attributes: ['perma_id', {
          type: 'template'
        }, 'chapter_id'],
        includeConfiguration: true
      });
    },
    createReducers({
      pageTypes = []
    }) {
      const pageStateReducers = pageTypes.reduce((result, {
        name,
        reducer
      }) => {
        result[name] = reducer;
        return result;
      }, {});
      return {
        pages: createCollectionReducer('pages', {
          idAttribute: 'permaId',
          itemReducer: createPageStateReducer(pageStateReducers)
        })
      };
    },
    createMiddleware,
    createSaga({
      pages,
      pageTypes = [],
      middleware
    }) {
      const pageTypeSagas = pageTypes.reduce((result, {
        name,
        saga
      }) => {
        result[name] = saga;
        return result;
      }, {});
      return createCollectionSaga('pages', {
        itemSaga: createPageSaga({
          pages,
          pageTypeSagas
        }),
        middleware
      });
    }
  };
  const connectInPage = createCollectionItemScopeConnector('pages');
  function createPageType(options) {
    return mergePageTypes(createReactPageType(options), options.mixin || {});
  }

  var LazyBackgroundImage = connectInPage(combine$1({
    loaded: pageIsPreloaded()
  }))(BackgroundImage);

  /**
   * @desc Can be used inside {@link
   * pageflow.react.components.PageBackground|PageBackground} to display
   * the background image specified in the page configuration.
   *
   * @alias pageflow.react.components.PageBackgroundImage
   * @class
   * @since 0.1
   *
   * @prop page
   *   Required. The page object to read configuration properties from.
   *
   * @prop propertyBaseName
   *   By default the configuration property `backgroundImage` is
   *   used. Use this prop to specify a different property name.
   *
   * @prop fileCollection
   *   Set to `"videoFiles"` if the `propertyBaseName` refers to a video
   *   you want to display the poster of.
   */
  class PageBackgroundImage extends React$1__default.Component {
    render() {
      const page = this.props.page;
      const property = camelize.concat(this.props.propertyNamePrefix, this.props.propertyBaseName);
      return /*#__PURE__*/React$1__default.createElement(LazyBackgroundImage, {
        fileId: page[`${property}Id`],
        fileCollection: this.props.fileCollection,
        position: [page[`${property}X`], page[`${property}Y`]],
        className: "background background_image",
        structuredDataComponent: this.props.structuredDataComponent
      });
    }
  }
  PageBackgroundImage.defaultProps = {
    propertyBaseName: 'backgroundImage'
  };

  /**
   * @desc Can be used inside
   * {@link pageflow.react.components.PageBackground|PageBackground} to
   * display a gradient which improves the contrast of text displayed
   * inside the {@link
   * pageflow.react.components.PageForeground|PageForeground}
   *
   * @alias pageflow.react.components.PageShadow
   * @class
   * @since 0.1
   *
   * @prop page
   *   Required. The page object to read configuration properties from.
   */
  class PageShadow extends React$1__default.Component {
    render() {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "shadow_wrapper"
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: classnames('shadow', this.props.className),
        style: this.style()
      }));
    }
    style() {
      if ('gradientOpacity' in this.props.page) {
        return {
          opacity: this.props.page.gradientOpacity / 100
        };
      }
    }
  }

  /**
   * Use inside {@link
   * pageflow.react.components.PageWrapper|PageWrapper}  to build the
   * default page structure.
   *
   * @alias pageflow.react.components.PageForeground
   * @class
   * @since 12.1
   */
  function PageForeground (props) {
    return /*#__PURE__*/React$1__default.createElement("div", {
      className: "content",
      onTouchStart: props.onInteraction,
      onMouseMove: props.onInteraction
    }, props.children);
  }

  class Scroller extends React$1.Component {
    render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "scroller-wrapper",
        ref: element => this.wrapperElement = element
      }, /*#__PURE__*/React.createElement("div", {
        ref: element => this.scrollerElement = element,
        className: classnames('scroller', this.props.className),
        style: this.props.style
      }, /*#__PURE__*/React.createElement("div", null, this.props.children)));
    }
    componentDidMount() {
      if (typeof jQuery !== 'undefined') {
        var element = jQuery(this.scrollerElement);
        element.scroller({
          eventListenerTarget: this.wrapperElement
        });
        this.scroller = element.scroller('instance');
      }
    }
    componentDidUpdate() {
      this.scroller.refresh();
    }
    enable() {
      this.scroller.enable();
      this.scroller.afterAnimationHook();
    }
    disable() {
      this.scroller.disable();
    }
    resetPosition(options) {
      this.scroller.resetPosition(options);
    }
  }

  /**
   * @desc Can be used inside
   * {@link pageflow.react.components.PageForeground|PageForeground} to
   * build the default page structure.
   *
   * @alias pageflow.react.components.PageScroller
   * @since 12.1
   */
  class PageScroller extends React$1__default.Component {
    componentWillReceiveProps(nextProps) {
      if (!this.props.enabled && nextProps.enabled) {
        this.refs.scroller.enable();
      } else if (this.props.enabled && !nextProps.enabled) {
        this.refs.scroller.disable();
      }
      if (this.props.initialScrollerPosition !== nextProps.initialScrollerPosition && nextProps.initialScrollerPosition) {
        this.refs.scroller.resetPosition({
          position: nextProps.initialScrollerPosition
        });
      }
    }
    getChildContext() {
      this._pageScroller = this._pageScroller || {
        disable: () => {
          this.refs.scroller.disable();
        },
        enable: () => {
          this.refs.scroller.enable();
        }
      };
      return {
        pageScroller: this._pageScroller
      };
    }
    render() {
      return /*#__PURE__*/React$1__default.createElement(Scroller, {
        ref: "scroller",
        className: className$1(this.props),
        style: style(this.props)
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "content_wrapper"
      }, this.props.children));
    }
  }
  function className$1(props) {
    return classnames(props.className, {
      'scroller-clipped_bottom': !!props.marginBottom
    });
  }
  function style(props) {
    if (props.marginBottom) {
      return {
        bottom: props.marginBottom
      };
    }
  }
  PageScroller.childContextTypes = {
    pageScroller: React$1__default.PropTypes.object
  };
  var PageScroller$1 = connectInPage(combine$1({
    enabled: pageIsActivated(),
    initialScrollerPosition: initialScrollerPosition$1()
  }))(PageScroller);

  /**
   * Can be used inside
   * {@link pageflow.react.components.PageWrapper|PageWrapper} to build the
   * default page structure.
   *
   * @alias pageflow.react.components.PageContent
   * @class
   * @since 0.1
   */
  function PageContent (props) {
    return /*#__PURE__*/React.createElement(PageForeground, null, /*#__PURE__*/React.createElement(PageScroller$1, null, props.children));
  }

  /**
   * @desc Place inside
   * {@link pageflow.react.components.PageScroller|PageScroller} to
   * display the page's headings.
   *
   * @alias pageflow.react.components.PageHeader
   * @class
   * @since 0.1
   *
   * @prop page
   *   Required. The page object to read configuration properties from.
   */
  class PageHeader extends React$1__default.Component {
    render() {
      return /*#__PURE__*/React$1__default.createElement("h3", {
        className: "page_header"
      }, /*#__PURE__*/React$1__default.createElement("span", {
        className: "page_header-tagline"
      }, this.props.page.tagline), /*#__PURE__*/React$1__default.createElement("span", {
        className: "page_header-title"
      }, this.props.page.title), /*#__PURE__*/React$1__default.createElement("span", {
        className: "page_header-subtitle"
      }, this.props.page.subtitle));
    }
  }

  /**
   * @desc Place inside
   * {@link pageflow.react.components.PageScroller|PageScroller} to
   * display the page's content text.
   *
   * @alias pageflow.react.components.PageText
   * @class
   * @since 0.1
   *
   * @prop page
   *   Required. The page object to read configuration properties from.
   */
  function PageText(props) {
    return /*#__PURE__*/React$1__default.createElement("div", {
      className: className$2(props)
    }, /*#__PURE__*/React$1__default.createElement("div", {
      className: "paragraph",
      dangerouslySetInnerHTML: text(props)
    }), props.children);
  }
  PageText.defaultProps = {
    marginBottom: 'for_scroll_indicator_on_phone'
  };
  function className$2(props) {
    return classnames('page_text', {
      [`page_text-margin_${props.marginBottom}`]: props.marginBottom != PageText.defaultProps.marginBottom
    });
  }
  function text(props) {
    return {
      __html: props.page.text
    };
  }

  function prop(path) {
    return function (state, props) {
      const names = path.split('.');
      if (!(names[0] in props)) {
        throw new Error(`Missing required prop ${names[0]}.`);
      }
      return names.reduce((p, name) => p && p[name], props);
    };
  }
  function has$3(featureName) {
    return function (_props, _state, browser) {
      return has$2(featureName, browser);
    };
  }

  class PageLink extends React$1__default.Component {
    render() {
      return /*#__PURE__*/React$1__default.createElement("a", {
        href: this._href(),
        className: this.props.className,
        onClick: this._handleClick.bind(this)
      }, this.props.children);
    }
    _href() {
      if (this._targetPage()) {
        return '#' + this._targetPage().permaId;
      } else {
        return '#missing';
      }
    }
    _handleClick(event) {
      if (this._targetPage()) {
        pageflow.slides.goToByPermaId(this._targetPage().permaId, {
          transition: this.props.pageLink.pageTransition
        });
      }
      event.preventDefault();
    }
    _targetPage() {
      return this.props.targetPage;
    }
  }
  var PageLink$1 = connect(combine$1({
    targetPage: pageAttributes({
      id: prop('pageLink.targetPageId')
    })
  }))(PageLink);

  function PageThumbnail(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: className$3(props)
    });
  }
  PageThumbnail.defaultProps = {
    imageStyle: 'navigation_thumbnail_large'
  };
  function className$3(props) {
    return classnames({
      load_image: props.lazy && props.loaded
    }, props.className, typeClassName(props.pageType), thumbnailClassName(props));
  }
  function typeClassName(pageType) {
    return pageType ? `is_${pageType.name}` : 'is_dangling';
  }
  function thumbnailClassName(props) {
    var candidate = findThumbnailCandidate({
      candidates: thumbnailCandidates(props),
      page: props.page,
      fileExists: props.fileExists
    });
    if (candidate) {
      return thumbnailCandidateClassName(props, candidate);
    }
  }
  function thumbnailCandidates(props) {
    return [customThumbnailCandidate(props), ...pageTypeCandidates(props.pageType)];
  }
  function customThumbnailCandidate(props) {
    return {
      id: props.customThumbnailId,
      cssClassPrefix: 'pageflow_image_file',
      collectionName: 'image_files'
    };
  }
  function pageTypeCandidates(pageType) {
    return pageType ? pageType.thumbnailCandidates : [];
  }
  function thumbnailCandidateClassName(props, candidate) {
    return [props.lazy ? 'lazy' : null, candidate.cssClassPrefix, props.imageStyle, thumbnailCandidateId(props.page, candidate)].filter(Boolean).join('_');
  }
  var PageThumbnail$1 = connectInPage(combine$1({
    pageType: pageType({
      page: props => props.page
    }),
    fileExists: fileExists()
  }))(PageThumbnail);

  var LazyLoadedPageThumbnail = connectInPage(combine$1({
    loaded: pageIsPreloaded(),
    lazy: true
  }))(PageThumbnail$1);

  function InfoBox(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: wrapperClassNames(props)
    }, header(props), description(props));
  }
  function wrapperClassNames(props) {
    return classnames('add_info_box', {
      'empty': isEmpty(props),
      'title_empty': isBlank(props.title),
      'description_empty': isBlank(props.description),
      'add_info_box-hidden_during_playback': props.hiddenDuringPlayback
    });
  }
  function header(props) {
    if (!isBlank(props.title)) {
      return /*#__PURE__*/React.createElement("h3", null, props.title);
    }
  }
  function description(props) {
    if (!isBlank(props.description)) {
      return /*#__PURE__*/React.createElement("p", {
        dangerouslySetInnerHTML: {
          __html: props.description
        }
      });
    }
  }
  function isEmpty(props) {
    return isBlank(props.title) && isBlank(props.description);
  }

  function Container(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: classnames('controls', props.className),
      "data-role": "player_controls",
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      onFocus: props.onFocus,
      onBlur: props.onBlur
    }, props.children);
  }

  /**
   * Helper create components that render SVG icons.
   *
   * See {@link pageflow.react.iconMapping} for usage examples.
   *
   * @alias pageflow.react.components.SvgIcon
   * @class
   *
   * @prop viewBoxWidth
   *   Required. Width of view box used to interpret coordinates of child elements.
   *
   * @prop viewBoxHeight
   *   Required. Height of view box used to interpret coordinates of child elements.
   *
   * @prop viewBoxLeft
   *   Defaults to 0.
   *
   * @prop viewBoxTop
   *   Defaults to 0.
   *
   * @prop className
   *   CSS class name
   *
   * @prop width
   *   Width attribute for the `svg` element.
   *
   * @prop height
   *   Height attribute for the `svg` element.
   */
  function Container$1(props) {
    return /*#__PURE__*/React$1__default.createElement("svg", {
      className: props.className,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      width: props.width,
      height: props.height,
      viewBox: `${props.viewBoxLeft} ${props.viewBoxTop} ${props.viewBoxWidth} ${props.viewBoxHeight}`
    }, props.children);
  }
  Container$1.defaultProps = {
    width: 20,
    height: 20,
    viewBoxLeft: 0,
    viewBoxTop: 0
  };

  function Checkmark (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 512,
      viewBoxHeight: 512
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "434.442,58.997 195.559,297.881 77.554,179.88 0,257.438 195.559,453.003 512,136.551 "
    }));
  }

  function CircleWithNotch (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 1000,
      viewBoxHeight: 1000
    }), /*#__PURE__*/React.createElement("path", {
      d: "M990,497.6c0,66.4-13,129.8-38.8,190.3c-25.9,60.5-60.7,112.7-104.4,156.4C803,888,750.9,922.8,690.3,948.7c-60.5,25.9-124,38.8-190.3,38.8s-129.8-12.9-190.3-38.8S197,888,153.3,844.3c-43.7-43.7-78.5-95.9-104.4-156.4C22.9,627.4,10,563.9,10,497.6c0-80.9,18.4-156.5,55.2-226.7c36.8-70.2,87.2-128,151.2-173.4s135.2-73.8,213.6-85v142.2c-80.6,16.4-147.4,56.7-200.4,120.9c-53,64.2-79.5,138.2-79.6,222c0,47.4,9.3,92.7,27.9,135.9c18.6,43.2,43.4,80.4,74.6,111.6c31.2,31.2,68.4,56.1,111.6,74.6c43.2,18.5,88.5,27.8,135.9,27.9c47.4,0,92.7-9.2,135.9-27.9C679,801,716.2,776.1,747.4,745c31.2-31.1,56-68.3,74.6-111.6c18.6-43.3,27.9-88.6,27.9-135.9c0-83.9-26.5-157.9-79.6-222C717.2,211.3,650.4,171,569.9,154.6V12.5c78.4,11.3,149.6,39.6,213.6,85c64,45.4,114.4,103.2,151.2,173.4c36.8,70.2,55.2,145.7,55.2,226.7H990z"
    }));
  }

  function Disk (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 24,
      viewBoxHeight: 24
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "12"
    }));
  }

  function GearIcon (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 24,
      viewBoxHeight: 24
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21.312,14.056l-1.691-0.98c0,0-0.472-0.216-0.446-1.073c0,0-0.128-0.961,0.478-1.293l1.661-1.014 c0,0,0.546-0.245,0.313-0.818l-0.707-1.598c0,0-0.229-0.625-0.902-0.423l-1.93,0.615c0,0-0.666-0.009-1.078-0.458 c0,0-0.687-0.662-0.476-1.229l0.445-1.924c0,0,0.114-0.563-0.312-0.768l-1.995-0.757c0,0-0.43-0.026-0.562,0.305l-1.122,2.006 c0,0-0.524,0.437-1.248,0.292c0,0-0.752-0.072-0.928-0.253c0,0-1.135-1.916-1.19-2.015c0,0-0.21-0.437-0.65-0.262L7.144,3.176 c0,0-0.367,0.229-0.275,0.559l0.649,2.441c0,0-0.139,0.597-0.561,0.924c0,0-0.745,0.55-1.104,0.483L3.858,7.1 c0,0-0.578-0.207-0.805,0.294L2.306,9.232c0,0-0.143,0.38,0.251,0.616l1.96,1.123c0,0,0.624,0.286,0.441,1.38 c0,0,0.037,0.804-0.756,1.24c-0.793,0.437-1.476,0.875-1.476,0.875s-0.437,0.21-0.249,0.681c0.189,0.471,0.895,1.811,0.895,1.811 s0.131,0.336,0.762,0.091l1.723-0.466c0,0,0.5-0.151,1.031,0.319c0,0,0.741,0.504,0.687,0.919l-0.48,2.433 c0,0-0.157,0.411,0.312,0.676l1.929,0.733c0,0,0.538,0.052,0.68-0.389l0.84-1.532c0,0,0.278-0.669,1.177-0.625 c0,0,0.909-0.081,1.227,0.407l1.101,1.833c0,0,0.199,0.466,0.791,0.188l1.709-0.728c0,0,0.479-0.315,0.333-0.743l-0.533-1.853 c0,0-0.238-0.5,0.259-1.055c0,0,0.533-0.876,1.27-0.701l2.043,0.487c0,0,0.424,0.187,0.793-0.413l0.659-1.639 C21.685,14.901,21.886,14.313,21.312,14.056z M8.542,13.474c-0.824-1.931,0.073-4.166,2.004-4.989 c1.931-0.826,4.165,0.073,4.988,2.004c0.825,1.931-0.073,4.164-2.005,4.989C11.599,16.303,9.365,15.404,8.542,13.474z"
    }))
    /*
        <path d="M20,14.5v-2.9l-1.8-0.3c-0.1-0.4-0.3-0.8-0.6-1.4l1.1-1.5l-2.1-2.1l-1.5,1.1c-0.5-0.3-1-0.5-1.4-0.6L13.5,5h-2.9l-0.3,1.8
                 C9.8,6.9,9.4,7.1,8.9,7.4L7.4,6.3L5.3,8.4l1,1.5c-0.3,0.5-0.4,0.9-0.6,1.4L4,11.5v2.9l1.8,0.3c0.1,0.5,0.3,0.9,0.6,1.4l-1,1.5
                 l2.1,2.1l1.5-1c0.4,0.2,0.9,0.4,1.4,0.6l0.3,1.8h3l0.3-1.8c0.5-0.1,0.9-0.3,1.4-0.6l1.5,1.1l2.1-2.1l-1.1-1.5c0.3-0.5,0.5-1,0.6-1.4
                 L20,14.5z M12,16c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,16,12,16z" />*/;
  }

  function InfoIcon (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxLeft: 5,
      viewBoxTop: 5,
      viewBoxWidth: 145,
      viewBoxHeight: 145
    }), /*#__PURE__*/React.createElement("path", {
      d: "m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z",
      transform: "matrix(1.1989 0 0 1.2342 21.214 28.75)"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105"
    }));
  }

  function Pause (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 512,
      viewBoxHeight: 512
    }), /*#__PURE__*/React.createElement("path", {
      d: "M162.642 148.337h86.034v215.317h-86.034v-215.316z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M293.356 148.337h86.002v215.317h-86.002v-215.316z"
    }));
  }

  function Play (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 512,
      viewBoxHeight: 512
    }), /*#__PURE__*/React.createElement("path", {
      d: "M152.443 136.417l207.114 119.573-207.114 119.593z"
    }));
  }

  function Subtitles (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxWidth: 1200,
      viewBoxHeight: 1200
    }), /*#__PURE__*/React.createElement("path", {
      transform: "translate(100,100)",
      d: "M893.4,599V500H401.1V599H893.4z M893.4,794.5v-98.9H695.5v98.9H893.4z M598.9,794.5v-98.9H106.6v98.9H598.9z M106.6,500V599h197.8V500H106.6z M893.4,106.7c26.1,0,48.7,10,67.9,29.9s28.8,42.9,28.8,69v588.9c0,26.1-9.6,49.1-28.8,69c-19.2,19.9-41.8,29.9-67.9,29.9H106.6c-26.1,0-48.7-10-67.9-29.9c-19.2-19.9-28.8-42.9-28.8-69V205.5c0-26.1,9.6-49.1,28.8-69s41.8-29.9,67.9-29.9H893.4z"
    }));
  }

  var icons = {
    Checkmark,
    CircleWithNotch,
    Disk,
    Gear: GearIcon,
    Info: InfoIcon,
    Pause,
    Play,
    Subtitles
  };

  /**
   * Register {@link pageflow.react.components.SvgIcon} components to be used by other
   * components.
   *
   * @example
   *
   * const {SvgIcon} = pageflow.react;
   *
   * pageflow.react.iconMapping['pageflow-rainbow.checkmark'] = function(props) {
   *   return (
   *     <SvgIcon {...props} viewBoxWidth={512} viewBoxHeight={512}>
   *       <polygon points="434.442,58.997 195.559,297.881 77.554,179.88 0,257.438 195.559,453.003 512,136.551 " />
   *     </SvgIcon>
   *   );
   * };
   *
   * @alias pageflow.react.iconMapping
   */
  var iconMapping = {
    toggleInfoBox: icons.Info,
    mediaQuality: icons.Gear,
    textTracks: icons.Subtitles,
    activeMenuItem: icons.Checkmark,
    loadingSpinner: icons.CircleWithNotch,
    play: icons.Play,
    pause: icons.Pause
  };

  /**
   * Render an SVG icon from {@link pageflow.react.iconMapping}.
   *
   * @alias pageflow.react.components.Icon
   * @class
   * @since 12.1
   *
   * @prop name
   *   Required. The key to look up in the mapping.
   */
  function Icon(props) {
    const SvgIcon = iconMapping[props.name];
    if (!SvgIcon) {
      throw new Error(`No icon registered for "${props.name}".`);
    }
    return /*#__PURE__*/React$1__default.createElement(SvgIcon, props);
  }

  function LoadingSpinner (props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "vjs-loading-spinner"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "loadingSpinner"
    }));
  }

  function pageSkipLinkTarget (Component) {
    return connectInPage(combine$1({
      id: memoizedSelector(pageIsActive(), isActive => isActive ? 'firstContent' : undefined)
    }))(Component);
  }

  function PlayButton(props) {
    return /*#__PURE__*/React.createElement("a", {
      className: className$4(props),
      href: "#",
      tabIndex: "4",
      id: props.id,
      title: props.title,
      onClick: clickHandler(props)
    }, icon(props));
  }
  var PlayButton$1 = pageSkipLinkTarget(PlayButton);
  function className$4(props) {
    return classnames('vjs-play-control', {
      'vjs-playing': props.isPlaying
    }, {
      'player_controls-play_button-custom_icon': !!props.iconName
    });
  }
  function clickHandler(props) {
    return event => {
      if (props.onClick) {
        props.onClick(event);
      }
      event.preventDefault();
    };
  }
  function icon(props) {
    if (props.iconName) {
      return /*#__PURE__*/React.createElement(Icon, {
        name: props.iconName
      });
    } else {
      return /*#__PURE__*/React.createElement("span", null);
    }
  }

  function TimeDisplay(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: classnames(props.className)
    }, format(props.value));
  }
  const unknownTimePlaceholder = '-:--';
  TimeDisplay.defaultProps = {
    value: 0
  };
  function format(value) {
    if (isNaN(value)) {
      return unknownTimePlaceholder;
    }
    const seconds = Math.floor(value) % 60;
    const minutes = Math.floor(value / 60) % 60;
    const hours = Math.floor(value / 60 / 60);
    if (hours > 0) {
      return `${hours}:${pad$1(minutes)}:${pad$1(seconds)}`;
    } else {
      return `${minutes}:${pad$1(seconds)}`;
    }
  }
  function pad$1(value) {
    return value < 10 ? '0' + value : value;
  }

  function CurrentTime (props) {
    return /*#__PURE__*/React.createElement(TimeDisplay, {
      className: "vjs-current-time",
      value: props.currentTime
    });
  }

  function TimeDivider (props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "vjs-time-divider"
    }, "/");
  }

  function Duration (props) {
    return /*#__PURE__*/React.createElement(TimeDisplay, {
      className: "vjs-duration",
      value: props.duration
    });
  }

  var reactDraggable = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory(React$1__default, ReactDOM);
  })(commonjsGlobal, function (__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_11__) {
    return /******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/
      var installedModules = {};
      /******/
      /******/ // The require function
      /******/
      function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) /******/return installedModules[moduleId].exports;
        /******/
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
          /******/exports: {},
          /******/id: moduleId,
          /******/loaded: false
          /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/
        module.loaded = true;
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/
      __webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/
      __webpack_require__.c = installedModules;
      /******/
      /******/ // __webpack_public_path__
      /******/
      __webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/
      return __webpack_require__(0);
      /******/
    }
    /************************************************************************/
    /******/([/* 0 */
    /***/function (module, exports, __webpack_require__) {

      module.exports = __webpack_require__(1).default;
      module.exports.DraggableCore = __webpack_require__(17).default;

      /***/
    }, /* 1 */
    /***/function (module, exports, __webpack_require__) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      var _slicedToArray = function () {
        function sliceIterator(arr, i) {
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
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }
        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      var _react = __webpack_require__(2);
      var _react2 = _interopRequireDefault(_react);
      var _propTypes = __webpack_require__(3);
      var _propTypes2 = _interopRequireDefault(_propTypes);
      var _reactDom = __webpack_require__(11);
      var _reactDom2 = _interopRequireDefault(_reactDom);
      var _classnames = __webpack_require__(12);
      var _classnames2 = _interopRequireDefault(_classnames);
      var _domFns = __webpack_require__(13);
      var _positionFns = __webpack_require__(16);
      var _shims = __webpack_require__(14);
      var _DraggableCore = __webpack_require__(17);
      var _DraggableCore2 = _interopRequireDefault(_DraggableCore);
      var _log = __webpack_require__(19);
      var _log2 = _interopRequireDefault(_log);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
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
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return call && (typeof call === "object" || typeof call === "function") ? call : self;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }
      // $FlowIgnore

      /*:: import type {DraggableEventHandler} from './utils/types';*/
      /*:: type DraggableState = {
        dragging: boolean,
        dragged: boolean,
        x: number, y: number,
        slackX: number, slackY: number,
        isElementSVG: boolean
      };*/

      //
      // Define <Draggable>
      //

      /*:: type ConstructorProps = {
        position: { x: number, y: number },
        defaultPosition: { x: number, y: number }
      };*/

      var Draggable = function (_React$Component) {
        _inherits(Draggable, _React$Component);
        function Draggable(props /*: ConstructorProps*/) {
          _classCallCheck(this, Draggable);
          var _this = _possibleConstructorReturn(this, (Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call(this, props));
          _this.onDragStart = function (e, coreData) {
            (0, _log2.default)('Draggable: onDragStart: %j', coreData);

            // Short-circuit if user's callback killed it.
            var shouldStart = _this.props.onStart(e, (0, _positionFns.createDraggableData)(_this, coreData));
            // Kills start event on core as well, so move handlers are never bound.
            if (shouldStart === false) return false;
            _this.setState({
              dragging: true,
              dragged: true
            });
          };
          _this.onDrag = function (e, coreData) {
            if (!_this.state.dragging) return false;
            (0, _log2.default)('Draggable: onDrag: %j', coreData);
            var uiData = (0, _positionFns.createDraggableData)(_this, coreData);
            var newState /*: $Shape<DraggableState>*/ = {
              x: uiData.x,
              y: uiData.y
            };

            // Keep within bounds.
            if (_this.props.bounds) {
              // Save original x and y.
              var _x = newState.x,
                _y = newState.y;

              // Add slack to the values used to calculate bound position. This will ensure that if
              // we start removing slack, the element won't react to it right away until it's been
              // completely removed.

              newState.x += _this.state.slackX;
              newState.y += _this.state.slackY;

              // Get bound position. This will ceil/floor the x and y within the boundaries.
              // $FlowBug

              // Recalculate slack by noting how much was shaved by the boundPosition handler.
              var _getBoundPosition = (0, _positionFns.getBoundPosition)(_this, newState.x, newState.y);
              var _getBoundPosition2 = _slicedToArray(_getBoundPosition, 2);
              newState.x = _getBoundPosition2[0];
              newState.y = _getBoundPosition2[1];
              newState.slackX = _this.state.slackX + (_x - newState.x);
              newState.slackY = _this.state.slackY + (_y - newState.y);

              // Update the event we fire to reflect what really happened after bounds took effect.
              uiData.x = _x;
              uiData.y = _y;
              uiData.deltaX = newState.x - _this.state.x;
              uiData.deltaY = newState.y - _this.state.y;
            }

            // Short-circuit if user's callback killed it.
            var shouldUpdate = _this.props.onDrag(e, uiData);
            if (shouldUpdate === false) return false;
            _this.setState(newState);
          };
          _this.onDragStop = function (e, coreData) {
            if (!_this.state.dragging) return false;

            // Short-circuit if user's callback killed it.
            var shouldStop = _this.props.onStop(e, (0, _positionFns.createDraggableData)(_this, coreData));
            if (shouldStop === false) return false;
            (0, _log2.default)('Draggable: onDragStop: %j', coreData);
            var newState /*: $Shape<DraggableState>*/ = {
              dragging: false,
              slackX: 0,
              slackY: 0
            };

            // If this is a controlled component, the result of this operation will be to
            // revert back to the old position. We expect a handler on `onDragStop`, at the least.
            var controlled = Boolean(_this.props.position);
            if (controlled) {
              var _this$props$position = _this.props.position,
                _x2 = _this$props$position.x,
                _y2 = _this$props$position.y;
              newState.x = _x2;
              newState.y = _y2;
            }
            _this.setState(newState);
          };
          _this.state = {
            // Whether or not we are currently dragging.
            dragging: false,
            // Whether or not we have been dragged before.
            dragged: false,
            // Current transform x and y.
            x: props.position ? props.position.x : props.defaultPosition.x,
            y: props.position ? props.position.y : props.defaultPosition.y,
            // Used for compensating for out-of-bounds drags
            slackX: 0,
            slackY: 0,
            // Can only determine if SVG after mounting
            isElementSVG: false
          };
          return _this;
        }
        _createClass(Draggable, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            if (this.props.position && !(this.props.onDrag || this.props.onStop)) {
              // eslint-disable-next-line
              console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
            }
          }
        }, {
          key: 'componentDidMount',
          value: function componentDidMount() {
            // Check to see if the element passed is an instanceof SVGElement
            if (typeof SVGElement !== 'undefined' && _reactDom2.default.findDOMNode(this) instanceof SVGElement) {
              this.setState({
                isElementSVG: true
              });
            }
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps /*: Object*/) {
            // Set x/y if position has changed
            if (nextProps.position && (!this.props.position || nextProps.position.x !== this.props.position.x || nextProps.position.y !== this.props.position.y)) {
              this.setState({
                x: nextProps.position.x,
                y: nextProps.position.y
              });
            }
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.setState({
              dragging: false
            }); // prevents invariant if unmounted while dragging
          }
        }, {
          key: 'render',
          value: function render() /*: React.Element<any>*/{
            var _classNames;
            var style = {},
              svgTransform = null;

            // If this is controlled, we don't want to move it - unless it's dragging.
            var controlled = Boolean(this.props.position);
            var draggable = !controlled || this.state.dragging;
            var position = this.props.position || this.props.defaultPosition;
            var transformOpts = {
              // Set left if horizontal drag is enabled
              x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : position.x,
              // Set top if vertical drag is enabled
              y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : position.y
            };

            // If this element was SVG, we use the `transform` attribute.
            if (this.state.isElementSVG) {
              svgTransform = (0, _domFns.createSVGTransform)(transformOpts);
            } else {
              // Add a CSS transform to move the element around. This allows us to move the element around
              // without worrying about whether or not it is relatively or absolutely positioned.
              // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
              // has a clean slate.
              style = (0, _domFns.createCSSTransform)(transformOpts);
            }
            var _props = this.props,
              defaultClassName = _props.defaultClassName,
              defaultClassNameDragging = _props.defaultClassNameDragging,
              defaultClassNameDragged = _props.defaultClassNameDragged;

            // Mark with class while dragging

            var className = (0, _classnames2.default)(this.props.children.props.className || '', defaultClassName, (_classNames = {}, _defineProperty(_classNames, defaultClassNameDragging, this.state.dragging), _defineProperty(_classNames, defaultClassNameDragged, this.state.dragged), _classNames));

            // Reuse the child provided
            // This makes it flexible to use whatever element is wanted (div, ul, etc)
            return _react2.default.createElement(_DraggableCore2.default, _extends({}, this.props, {
              onStart: this.onDragStart,
              onDrag: this.onDrag,
              onStop: this.onDragStop
            }), _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
              className: className,
              style: _extends({}, this.props.children.props.style, style),
              transform: svgTransform
            }));
          }
        }]);
        return Draggable;
      }(_react2.default.Component);
      Draggable.displayName = 'Draggable';
      Draggable.propTypes = _extends({}, _DraggableCore2.default.propTypes, {
        /**
         * `axis` determines which axis the draggable can move.
         *
         *  Note that all callbacks will still return data as normal. This only
         *  controls flushing to the DOM.
         *
         * 'both' allows movement horizontally and vertically.
         * 'x' limits movement to horizontal axis.
         * 'y' limits movement to vertical axis.
         * 'none' limits all movement.
         *
         * Defaults to 'both'.
         */
        axis: _propTypes2.default.oneOf(['both', 'x', 'y', 'none']),
        /**
         * `bounds` determines the range of movement available to the element.
         * Available values are:
         *
         * 'parent' restricts movement within the Draggable's parent node.
         *
         * Alternatively, pass an object with the following properties, all of which are optional:
         *
         * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
         *
         * All values are in px.
         *
         * Example:
         *
         * ```jsx
         *   let App = React.createClass({
         *       render: function () {
         *         return (
         *            <Draggable bounds={{right: 300, bottom: 300}}>
         *              <div>Content</div>
         *           </Draggable>
         *         );
         *       }
         *   });
         * ```
         */
        bounds: _propTypes2.default.oneOfType([_propTypes2.default.shape({
          left: _propTypes2.default.number,
          right: _propTypes2.default.number,
          top: _propTypes2.default.number,
          bottom: _propTypes2.default.number
        }), _propTypes2.default.string, _propTypes2.default.oneOf([false])]),
        defaultClassName: _propTypes2.default.string,
        defaultClassNameDragging: _propTypes2.default.string,
        defaultClassNameDragged: _propTypes2.default.string,
        /**
         * `defaultPosition` specifies the x and y that the dragged item should start at
         *
         * Example:
         *
         * ```jsx
         *      let App = React.createClass({
         *          render: function () {
         *              return (
         *                  <Draggable defaultPosition={{x: 25, y: 25}}>
         *                      <div>I start with transformX: 25px and transformY: 25px;</div>
         *                  </Draggable>
         *              );
         *          }
         *      });
         * ```
         */
        defaultPosition: _propTypes2.default.shape({
          x: _propTypes2.default.number,
          y: _propTypes2.default.number
        }),
        /**
         * `position`, if present, defines the current position of the element.
         *
         *  This is similar to how form elements in React work - if no `position` is supplied, the component
         *  is uncontrolled.
         *
         * Example:
         *
         * ```jsx
         *      let App = React.createClass({
         *          render: function () {
         *              return (
         *                  <Draggable position={{x: 25, y: 25}}>
         *                      <div>I start with transformX: 25px and transformY: 25px;</div>
         *                  </Draggable>
         *              );
         *          }
         *      });
         * ```
         */
        position: _propTypes2.default.shape({
          x: _propTypes2.default.number,
          y: _propTypes2.default.number
        }),
        /**
         * These properties should be defined on the child, not here.
         */
        className: _shims.dontSetMe,
        style: _shims.dontSetMe,
        transform: _shims.dontSetMe
      });
      Draggable.defaultProps = _extends({}, _DraggableCore2.default.defaultProps, {
        axis: 'both',
        bounds: false,
        defaultClassName: 'react-draggable',
        defaultClassNameDragging: 'react-draggable-dragging',
        defaultClassNameDragged: 'react-draggable-dragged',
        defaultPosition: {
          x: 0,
          y: 0
        },
        position: null
      });
      exports.default = Draggable;

      /***/
    }, /* 2 */
    /***/function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

      /***/
    }, /* 3 */
    /***/function (module, exports, __webpack_require__) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      {
        var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;
        var isValidElement = function (object) {
          return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        };

        // By explicitly using `prop-types` you are opting into new development behavior.
        // http://fb.me/prop-types-in-prod
        var throwOnDirectAccess = true;
        module.exports = __webpack_require__(4)(isValidElement, throwOnDirectAccess);
      }

      /***/
    }, /* 4 */
    /***/function (module, exports, __webpack_require__) {

      var emptyFunction = __webpack_require__(5);
      var invariant = __webpack_require__(6);
      var warning = __webpack_require__(7);
      var ReactPropTypesSecret = __webpack_require__(8);
      var checkPropTypes = __webpack_require__(9);
      module.exports = function (isValidElement, throwOnDirectAccess) {
        /* global Symbol */
        var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

        /**
         * Returns the iterator method function contained on the iterable object.
         *
         * Be sure to invoke the function with the iterable as context:
         *
         *     var iteratorFn = getIteratorFn(myIterable);
         *     if (iteratorFn) {
         *       var iterator = iteratorFn.call(myIterable);
         *       ...
         *     }
         *
         * @param {?object} maybeIterable
         * @return {?function}
         */
        function getIteratorFn(maybeIterable) {
          var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
          if (typeof iteratorFn === 'function') {
            return iteratorFn;
          }
        }

        /**
         * Collection of methods that allow declaration and validation of props that are
         * supplied to React components. Example usage:
         *
         *   var Props = require('ReactPropTypes');
         *   var MyArticle = React.createClass({
         *     propTypes: {
         *       // An optional string prop named "description".
         *       description: Props.string,
         *
         *       // A required enum prop named "category".
         *       category: Props.oneOf(['News','Photos']).isRequired,
         *
         *       // A prop named "dialog" that requires an instance of Dialog.
         *       dialog: Props.instanceOf(Dialog).isRequired
         *     },
         *     render: function() { ... }
         *   });
         *
         * A more formal specification of how these methods are used:
         *
         *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
         *   decl := ReactPropTypes.{type}(.isRequired)?
         *
         * Each and every declaration produces a function with the same signature. This
         * allows the creation of custom validation functions. For example:
         *
         *  var MyLink = React.createClass({
         *    propTypes: {
         *      // An optional string or URI prop named "href".
         *      href: function(props, propName, componentName) {
         *        var propValue = props[propName];
         *        if (propValue != null && typeof propValue !== 'string' &&
         *            !(propValue instanceof URI)) {
         *          return new Error(
         *            'Expected a string or an URI for ' + propName + ' in ' +
         *            componentName
         *          );
         *        }
         *      }
         *    },
         *    render: function() {...}
         *  });
         *
         * @internal
         */

        var ANONYMOUS = '<<anonymous>>';

        // Important!
        // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
        var ReactPropTypes = {
          array: createPrimitiveTypeChecker('array'),
          bool: createPrimitiveTypeChecker('boolean'),
          func: createPrimitiveTypeChecker('function'),
          number: createPrimitiveTypeChecker('number'),
          object: createPrimitiveTypeChecker('object'),
          string: createPrimitiveTypeChecker('string'),
          symbol: createPrimitiveTypeChecker('symbol'),
          any: createAnyTypeChecker(),
          arrayOf: createArrayOfTypeChecker,
          element: createElementTypeChecker(),
          instanceOf: createInstanceTypeChecker,
          node: createNodeChecker(),
          objectOf: createObjectOfTypeChecker,
          oneOf: createEnumTypeChecker,
          oneOfType: createUnionTypeChecker,
          shape: createShapeTypeChecker
        };

        /**
         * inlined Object.is polyfill to avoid requiring consumers ship their own
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
         */
        /*eslint-disable no-self-compare*/
        function is(x, y) {
          // SameValue algorithm
          if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
          } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
          }
        }
        /*eslint-enable no-self-compare*/

        /**
         * We use an Error-like object for backward compatibility as people may call
         * PropTypes directly and inspect their output. However, we don't use real
         * Errors anymore. We don't inspect their stack anyway, and creating them
         * is prohibitively expensive if they are created too often, such as what
         * happens in oneOfType() for any type before the one that matched.
         */
        function PropTypeError(message) {
          this.message = message;
          this.stack = '';
        }
        // Make `instanceof Error` still work for returned errors.
        PropTypeError.prototype = Error.prototype;
        function createChainableTypeChecker(validate) {
          {
            var manualPropTypeCallCache = {};
            var manualPropTypeWarningCount = 0;
          }
          function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
            componentName = componentName || ANONYMOUS;
            propFullName = propFullName || propName;
            if (secret !== ReactPropTypesSecret) {
              if (throwOnDirectAccess) {
                // New behavior only for users of `prop-types` package
                invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
              } else if ( typeof console !== 'undefined') {
                // Old behavior for people using React.PropTypes
                var cacheKey = componentName + ':' + propName;
                if (!manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3) {
                  warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
                  manualPropTypeCallCache[cacheKey] = true;
                  manualPropTypeWarningCount++;
                }
              }
            }
            if (props[propName] == null) {
              if (isRequired) {
                if (props[propName] === null) {
                  return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
                }
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
              }
              return null;
            } else {
              return validate(props, propName, componentName, location, propFullName);
            }
          }
          var chainedCheckType = checkType.bind(null, false);
          chainedCheckType.isRequired = checkType.bind(null, true);
          return chainedCheckType;
        }
        function createPrimitiveTypeChecker(expectedType) {
          function validate(props, propName, componentName, location, propFullName, secret) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== expectedType) {
              // `propValue` being instance of, say, date/regexp, pass the 'object'
              // check, but we can offer a more precise error message here rather than
              // 'of type `object`'.
              var preciseType = getPreciseType(propValue);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createAnyTypeChecker() {
          return createChainableTypeChecker(emptyFunction.thatReturnsNull);
        }
        function createArrayOfTypeChecker(typeChecker) {
          function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
              return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
            }
            var propValue = props[propName];
            if (!Array.isArray(propValue)) {
              var propType = getPropType(propValue);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
            }
            for (var i = 0; i < propValue.length; i++) {
              var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createElementTypeChecker() {
          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            if (!isValidElement(propValue)) {
              var propType = getPropType(propValue);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createInstanceTypeChecker(expectedClass) {
          function validate(props, propName, componentName, location, propFullName) {
            if (!(props[propName] instanceof expectedClass)) {
              var expectedClassName = expectedClass.name || ANONYMOUS;
              var actualClassName = getClassName(props[propName]);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createEnumTypeChecker(expectedValues) {
          if (!Array.isArray(expectedValues)) {
             warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') ;
            return emptyFunction.thatReturnsNull;
          }
          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            for (var i = 0; i < expectedValues.length; i++) {
              if (is(propValue, expectedValues[i])) {
                return null;
              }
            }
            var valuesString = JSON.stringify(expectedValues);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
          }
          return createChainableTypeChecker(validate);
        }
        function createObjectOfTypeChecker(typeChecker) {
          function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
              return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
            }
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
            }
            for (var key in propValue) {
              if (propValue.hasOwnProperty(key)) {
                var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                if (error instanceof Error) {
                  return error;
                }
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createUnionTypeChecker(arrayOfTypeCheckers) {
          if (!Array.isArray(arrayOfTypeCheckers)) {
             warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') ;
            return emptyFunction.thatReturnsNull;
          }
          function validate(props, propName, componentName, location, propFullName) {
            for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
              var checker = arrayOfTypeCheckers[i];
              if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
                return null;
              }
            }
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
          }
          return createChainableTypeChecker(validate);
        }
        function createNodeChecker() {
          function validate(props, propName, componentName, location, propFullName) {
            if (!isNode(props[propName])) {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function createShapeTypeChecker(shapeTypes) {
          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
            }
            for (var key in shapeTypes) {
              var checker = shapeTypes[key];
              if (!checker) {
                continue;
              }
              var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error) {
                return error;
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }
        function isNode(propValue) {
          switch (typeof propValue) {
            case 'number':
            case 'string':
            case 'undefined':
              return true;
            case 'boolean':
              return !propValue;
            case 'object':
              if (Array.isArray(propValue)) {
                return propValue.every(isNode);
              }
              if (propValue === null || isValidElement(propValue)) {
                return true;
              }
              var iteratorFn = getIteratorFn(propValue);
              if (iteratorFn) {
                var iterator = iteratorFn.call(propValue);
                var step;
                if (iteratorFn !== propValue.entries) {
                  while (!(step = iterator.next()).done) {
                    if (!isNode(step.value)) {
                      return false;
                    }
                  }
                } else {
                  // Iterator will provide entry [k,v] tuples rather than values.
                  while (!(step = iterator.next()).done) {
                    var entry = step.value;
                    if (entry) {
                      if (!isNode(entry[1])) {
                        return false;
                      }
                    }
                  }
                }
              } else {
                return false;
              }
              return true;
            default:
              return false;
          }
        }
        function isSymbol(propType, propValue) {
          // Native Symbol.
          if (propType === 'symbol') {
            return true;
          }

          // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
          if (propValue['@@toStringTag'] === 'Symbol') {
            return true;
          }

          // Fallback for non-spec compliant Symbols which are polyfilled.
          if (typeof Symbol === 'function' && propValue instanceof Symbol) {
            return true;
          }
          return false;
        }

        // Equivalent of `typeof` but with special handling for array and regexp.
        function getPropType(propValue) {
          var propType = typeof propValue;
          if (Array.isArray(propValue)) {
            return 'array';
          }
          if (propValue instanceof RegExp) {
            // Old webkits (at least until Android 4.0) return 'function' rather than
            // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
            // passes PropTypes.object.
            return 'object';
          }
          if (isSymbol(propType, propValue)) {
            return 'symbol';
          }
          return propType;
        }

        // This handles more types than `getPropType`. Only used for error messages.
        // See `createPrimitiveTypeChecker`.
        function getPreciseType(propValue) {
          var propType = getPropType(propValue);
          if (propType === 'object') {
            if (propValue instanceof Date) {
              return 'date';
            } else if (propValue instanceof RegExp) {
              return 'regexp';
            }
          }
          return propType;
        }

        // Returns class name of the object, if any.
        function getClassName(propValue) {
          if (!propValue.constructor || !propValue.constructor.name) {
            return ANONYMOUS;
          }
          return propValue.constructor.name;
        }
        ReactPropTypes.checkPropTypes = checkPropTypes;
        ReactPropTypes.PropTypes = ReactPropTypes;
        return ReactPropTypes;
      };

      /***/
    }, /* 5 */
    /***/function (module, exports) {

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */
      function makeEmptyFunction(arg) {
        return function () {
          return arg;
        };
      }

      /**
       * This function accepts and discards inputs; it has no side effects. This is
       * primarily useful idiomatically for overridable function endpoints which
       * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
       */
      var emptyFunction = function emptyFunction() {};
      emptyFunction.thatReturns = makeEmptyFunction;
      emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
      emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
      emptyFunction.thatReturnsNull = makeEmptyFunction(null);
      emptyFunction.thatReturnsThis = function () {
        return this;
      };
      emptyFunction.thatReturnsArgument = function (arg) {
        return arg;
      };
      module.exports = emptyFunction;

      /***/
    }, /* 6 */
    /***/function (module, exports, __webpack_require__) {

      /**
       * Use invariant() to assert state which your program assumes to be true.
       *
       * Provide sprintf-style format (only %s is supported) and arguments
       * to provide information about what broke and what you were
       * expecting.
       *
       * The invariant message will be stripped in production, but the invariant
       * will remain to ensure logic does not differ in production.
       */
      var validateFormat = function validateFormat(format) {};
      {
        validateFormat = function validateFormat(format) {
          if (format === undefined) {
            throw new Error('invariant requires an error message argument');
          }
        };
      }
      function invariant(condition, format, a, b, c, d, e, f) {
        validateFormat(format);
        if (!condition) {
          var error;
          if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
          } else {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
            error = new Error(format.replace(/%s/g, function () {
              return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
          }
          error.framesToPop = 1; // we don't care about invariant's own frame
          throw error;
        }
      }
      module.exports = invariant;

      /***/
    }, /* 7 */
    /***/function (module, exports, __webpack_require__) {

      var emptyFunction = __webpack_require__(5);

      /**
       * Similar to invariant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */

      var warning = emptyFunction;
      {
        (function () {
          var printWarning = function printWarning(format) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function () {
              return args[argIndex++];
            });
            if (typeof console !== 'undefined') {
              console.error(message);
            }
            try {
              // --- Welcome to debugging React ---
              // This error was thrown as a convenience so that you can use this stack
              // to find the callsite that caused this warning to fire.
              throw new Error(message);
            } catch (x) {}
          };
          warning = function warning(condition, format) {
            if (format === undefined) {
              throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
            }
            if (format.indexOf('Failed Composite propType: ') === 0) {
              return; // Ignore CompositeComponent proptype check.
            }
            if (!condition) {
              for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }
              printWarning.apply(undefined, [format].concat(args));
            }
          };
        })();
      }
      module.exports = warning;

      /***/
    }, /* 8 */
    /***/function (module, exports) {

      var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
      module.exports = ReactPropTypesSecret;

      /***/
    }, /* 9 */
    /***/function (module, exports, __webpack_require__) {

      {
        var invariant = __webpack_require__(6);
        var warning = __webpack_require__(7);
        var ReactPropTypesSecret = __webpack_require__(8);
        var loggedTypeFailures = {};
      }

      /**
       * Assert that the values match with the type specs.
       * Error messages are memorized and will only be shown once.
       *
       * @param {object} typeSpecs Map of name to a ReactPropType
       * @param {object} values Runtime values that need to be type-checked
       * @param {string} location e.g. "prop", "context", "child context"
       * @param {string} componentName Name of the component for error messages.
       * @param {?Function} getStack Returns the component stack.
       * @private
       */
      function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
        {
          for (var typeSpecName in typeSpecs) {
            if (typeSpecs.hasOwnProperty(typeSpecName)) {
              var error;
              // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.
              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
              } catch (ex) {
                error = ex;
              }
              warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
              if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error.message] = true;
                var stack = getStack ? getStack() : '';
                warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
              }
            }
          }
        }
      }
      module.exports = checkPropTypes;

      /***/
    }, /* 10 */
    /***/function (module, exports, __webpack_require__) {

      var emptyFunction = __webpack_require__(5);
      var invariant = __webpack_require__(6);
      module.exports = function () {
        // Important!
        // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
        function shim() {
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        }
        shim.isRequired = shim;
        function getShim() {
          return shim;
        }
        var ReactPropTypes = {
          array: shim,
          bool: shim,
          func: shim,
          number: shim,
          object: shim,
          string: shim,
          symbol: shim,
          any: shim,
          arrayOf: getShim,
          element: shim,
          instanceOf: getShim,
          node: shim,
          objectOf: getShim,
          oneOf: getShim,
          oneOfType: getShim,
          shape: getShim
        };
        ReactPropTypes.checkPropTypes = emptyFunction;
        ReactPropTypes.PropTypes = ReactPropTypes;
        return ReactPropTypes;
      };

      /***/
    }, /* 11 */
    /***/function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

      /***/
    }, /* 12 */
    /***/function (module, exports, __webpack_require__) {
      var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; /*!
                                                                       Copyright (c) 2016 Jed Watson.
                                                                       Licensed under the MIT License (MIT), see
                                                                       http://jedwatson.github.io/classnames
                                                                       */
      /* global define */

      (function () {

        var hasOwn = {}.hasOwnProperty;
        function classNames() {
          var classes = [];
          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;
            var argType = typeof arg;
            if (argType === 'string' || argType === 'number') {
              classes.push(arg);
            } else if (Array.isArray(arg)) {
              classes.push(classNames.apply(null, arg));
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
        if (typeof module !== 'undefined' && module.exports) {
          module.exports = classNames;
        } else {
          // register as 'classnames', consistent with npm package name
          !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return classNames;
          }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
      })();

      /***/
    }, /* 13 */
    /***/function (module, exports, __webpack_require__) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      exports.matchesSelector = matchesSelector;
      exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
      exports.addEvent = addEvent;
      exports.removeEvent = removeEvent;
      exports.outerHeight = outerHeight;
      exports.outerWidth = outerWidth;
      exports.innerHeight = innerHeight;
      exports.innerWidth = innerWidth;
      exports.offsetXYFromParent = offsetXYFromParent;
      exports.createCSSTransform = createCSSTransform;
      exports.createSVGTransform = createSVGTransform;
      exports.getTouch = getTouch;
      exports.getTouchIdentifier = getTouchIdentifier;
      exports.addUserSelectStyles = addUserSelectStyles;
      exports.removeUserSelectStyles = removeUserSelectStyles;
      exports.styleHacks = styleHacks;
      var _shims = __webpack_require__(14);
      var _getPrefix = __webpack_require__(15);
      var _getPrefix2 = _interopRequireDefault(_getPrefix);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
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

      /*:: import type {ControlPosition} from './types';*/

      var matchesSelectorFunc = '';
      function matchesSelector(el /*: Node*/, selector /*: string*/) /*: boolean*/{
        if (!matchesSelectorFunc) {
          matchesSelectorFunc = (0, _shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
            // $FlowIgnore: Doesn't think elements are indexable
            return (0, _shims.isFunction)(el[method]);
          });
        }

        // $FlowIgnore: Doesn't think elements are indexable
        return el[matchesSelectorFunc].call(el, selector);
      }

      // Works up the tree to the draggable itself attempting to match selector.
      function matchesSelectorAndParentsTo(el /*: Node*/, selector /*: string*/, baseNode /*: Node*/) /*: boolean*/{
        var node = el;
        do {
          if (matchesSelector(node, selector)) return true;
          if (node === baseNode) return false;
          node = node.parentNode;
        } while (node);
        return false;
      }
      function addEvent(el /*: ?Node*/, event /*: string*/, handler /*: Function*/) /*: void*/{
        if (!el) {
          return;
        }
        if (el.attachEvent) {
          el.attachEvent('on' + event, handler);
        } else if (el.addEventListener) {
          el.addEventListener(event, handler, true);
        } else {
          // $FlowIgnore: Doesn't think elements are indexable
          el['on' + event] = handler;
        }
      }
      function removeEvent(el /*: ?Node*/, event /*: string*/, handler /*: Function*/) /*: void*/{
        if (!el) {
          return;
        }
        if (el.detachEvent) {
          el.detachEvent('on' + event, handler);
        } else if (el.removeEventListener) {
          el.removeEventListener(event, handler, true);
        } else {
          // $FlowIgnore: Doesn't think elements are indexable
          el['on' + event] = null;
        }
      }
      function outerHeight(node /*: HTMLElement*/) /*: number*/{
        // This is deliberately excluding margin for our calculations, since we are using
        // offsetTop which is including margin. See getBoundPosition
        var height = node.clientHeight;
        var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
        height += (0, _shims.int)(computedStyle.borderTopWidth);
        height += (0, _shims.int)(computedStyle.borderBottomWidth);
        return height;
      }
      function outerWidth(node /*: HTMLElement*/) /*: number*/{
        // This is deliberately excluding margin for our calculations, since we are using
        // offsetLeft which is including margin. See getBoundPosition
        var width = node.clientWidth;
        var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
        width += (0, _shims.int)(computedStyle.borderLeftWidth);
        width += (0, _shims.int)(computedStyle.borderRightWidth);
        return width;
      }
      function innerHeight(node /*: HTMLElement*/) /*: number*/{
        var height = node.clientHeight;
        var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
        height -= (0, _shims.int)(computedStyle.paddingTop);
        height -= (0, _shims.int)(computedStyle.paddingBottom);
        return height;
      }
      function innerWidth(node /*: HTMLElement*/) /*: number*/{
        var width = node.clientWidth;
        var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
        width -= (0, _shims.int)(computedStyle.paddingLeft);
        width -= (0, _shims.int)(computedStyle.paddingRight);
        return width;
      }

      // Get from offsetParent
      function offsetXYFromParent(evt /*: {clientX: number, clientY: number}*/, offsetParent /*: HTMLElement*/) /*: ControlPosition*/{
        var isBody = offsetParent === offsetParent.ownerDocument.body;
        var offsetParentRect = isBody ? {
          left: 0,
          top: 0
        } : offsetParent.getBoundingClientRect();
        var x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
        var y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;
        return {
          x: x,
          y: y
        };
      }
      function createCSSTransform(_ref) /*: Object*/{
        var x = _ref.x,
          y = _ref.y;

        // Replace unitless items with px
        return _defineProperty({}, (0, _getPrefix.browserPrefixToKey)('transform', _getPrefix2.default), 'translate(' + x + 'px,' + y + 'px)');
      }
      function createSVGTransform(_ref3) /*: string*/{
        var x = _ref3.x,
          y = _ref3.y;
        return 'translate(' + x + ',' + y + ')';
      }
      function getTouch(e /*: MouseTouchEvent*/, identifier /*: number*/) /*: ?{clientX: number, clientY: number}*/{
        return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, function (t) {
          return identifier === t.identifier;
        }) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, function (t) {
          return identifier === t.identifier;
        });
      }
      function getTouchIdentifier(e /*: MouseTouchEvent*/) /*: ?number*/{
        if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
        if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
      }

      // User-select Hacks:
      //
      // Useful for preventing blue highlights all over everything when dragging.
      var userSelectPrefix = (0, _getPrefix.getPrefix)('user-select');
      var userSelect = (0, _getPrefix.browserPrefixToStyle)('user-select', userSelectPrefix);
      var userSelectStyle = ';' + userSelect + ': none;';
      var userSelectReplaceRegExp = new RegExp(';?' + userSelect + ': none;'); // leading ; not present on IE

      // Note we're passing `document` b/c we could be iframed
      function addUserSelectStyles(body /*: HTMLElement*/) {
        var style = body.getAttribute('style') || '';
        if (userSelectReplaceRegExp.test(style)) return; // don't add twice
        body.setAttribute('style', style + userSelectStyle);
      }
      function removeUserSelectStyles(body /*: HTMLElement*/) {
        var style = body.getAttribute('style') || '';
        body.setAttribute('style', style.replace(userSelectReplaceRegExp, ''));
      }
      function styleHacks() /*: Object*/{
        var childStyle /*: Object*/ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // Workaround IE pointer events; see #51
        // https://github.com/mzabriskie/react-draggable/issues/51#issuecomment-103488278
        return _extends({
          touchAction: 'none'
        }, childStyle);
      }

      /***/
    }, /* 14 */
    /***/function (module, exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.findInArray = findInArray;
      exports.isFunction = isFunction;
      exports.isNum = isNum;
      exports.int = int;
      exports.dontSetMe = dontSetMe;

      // @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
      function findInArray(array /*: Array<any> | TouchList*/, callback /*: Function*/) /*: any*/{
        for (var i = 0, length = array.length; i < length; i++) {
          if (callback.apply(callback, [array[i], i, array])) return array[i];
        }
      }
      function isFunction(func /*: any*/) /*: boolean*/{
        return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
      }
      function isNum(num /*: any*/) /*: boolean*/{
        return typeof num === 'number' && !isNaN(num);
      }
      function int(a /*: string*/) /*: number*/{
        return parseInt(a, 10);
      }
      function dontSetMe(props /*: Object*/, propName /*: string*/, componentName /*: string*/) {
        if (props[propName]) {
          return new Error('Invalid prop ' + propName + ' passed to ' + componentName + ' - do not set this, set it on the child.');
        }
      }

      /***/
    }, /* 15 */
    /***/function (module, exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getPrefix = getPrefix;
      exports.browserPrefixToKey = browserPrefixToKey;
      exports.browserPrefixToStyle = browserPrefixToStyle;
      var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
      function getPrefix() /*: string*/{
        var prop /*: string*/ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';

        // Checking specifically for 'window.document' is for pseudo-browser server-side
        // environments that define 'window' as the global context.
        // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
        if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';
        var style = window.document.documentElement.style;
        if (prop in style) return '';
        for (var i = 0; i < prefixes.length; i++) {
          if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
        }
        return '';
      }
      function browserPrefixToKey(prop /*: string*/, prefix /*: string*/) /*: string*/{
        return prefix ? '' + prefix + kebabToTitleCase(prop) : prop;
      }
      function browserPrefixToStyle(prop /*: string*/, prefix /*: string*/) /*: string*/{
        return prefix ? '-' + prefix.toLowerCase() + '-' + prop : prop;
      }
      function kebabToTitleCase(str /*: string*/) /*: string*/{
        var out = '';
        var shouldCapitalize = true;
        for (var i = 0; i < str.length; i++) {
          if (shouldCapitalize) {
            out += str[i].toUpperCase();
            shouldCapitalize = false;
          } else if (str[i] === '-') {
            shouldCapitalize = true;
          } else {
            out += str[i];
          }
        }
        return out;
      }

      // Default export is the prefix itself, like 'Moz', 'Webkit', etc
      // Note that you may have to re-test for certain things; for instance, Chrome 50
      // can handle unprefixed `transform`, but not unprefixed `user-select`
      exports.default = getPrefix();

      /***/
    }, /* 16 */
    /***/function (module, exports, __webpack_require__) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getBoundPosition = getBoundPosition;
      exports.snapToGrid = snapToGrid;
      exports.canDragX = canDragX;
      exports.canDragY = canDragY;
      exports.getControlPosition = getControlPosition;
      exports.createCoreData = createCoreData;
      exports.createDraggableData = createDraggableData;
      var _shims = __webpack_require__(14);
      var _reactDom = __webpack_require__(11);
      var _reactDom2 = _interopRequireDefault(_reactDom);
      var _domFns = __webpack_require__(13);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /*:: import type Draggable from '../Draggable';*/
      /*:: import type {Bounds, ControlPosition, DraggableData} from './types';*/
      /*:: import type DraggableCore from '../DraggableCore';*/
      function getBoundPosition(draggable /*: Draggable*/, x /*: number*/, y /*: number*/) /*: [number, number]*/{
        // If no bounds, short-circuit and move on
        if (!draggable.props.bounds) return [x, y];

        // Clone new bounds
        var bounds = draggable.props.bounds;
        bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
        var node = _reactDom2.default.findDOMNode(draggable);
        if (typeof bounds === 'string') {
          var ownerDocument = node.ownerDocument;
          var ownerWindow = ownerDocument.defaultView;
          var boundNode = void 0;
          if (bounds === 'parent') {
            boundNode = node.parentNode;
          } else {
            boundNode = ownerDocument.querySelector(bounds);
            if (!boundNode) throw new Error('Bounds selector "' + bounds + '" could not find an element.');
          }
          var nodeStyle = ownerWindow.getComputedStyle(node);
          var boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
          // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
          bounds = {
            left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
            top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
            right: (0, _domFns.innerWidth)(boundNode) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
            bottom: (0, _domFns.innerHeight)(boundNode) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
          };
        }

        // Keep x and y below right and bottom limits...
        if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
        if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);

        // But above left and top limits.
        if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
        if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
        return [x, y];
      }
      function snapToGrid(grid /*: [number, number]*/, pendingX /*: number*/, pendingY /*: number*/) /*: [number, number]*/{
        var x = Math.round(pendingX / grid[0]) * grid[0];
        var y = Math.round(pendingY / grid[1]) * grid[1];
        return [x, y];
      }
      function canDragX(draggable /*: Draggable*/) /*: boolean*/{
        return draggable.props.axis === 'both' || draggable.props.axis === 'x';
      }
      function canDragY(draggable /*: Draggable*/) /*: boolean*/{
        return draggable.props.axis === 'both' || draggable.props.axis === 'y';
      }

      // Get {x, y} positions from event.
      function getControlPosition(e /*: MouseTouchEvent*/, touchIdentifier /*: ?number*/, draggableCore /*: DraggableCore*/) /*: ?ControlPosition*/{
        var touchObj = typeof touchIdentifier === 'number' ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
        if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch
        var node = _reactDom2.default.findDOMNode(draggableCore);
        // User can provide an offsetParent if desired.
        var offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
        return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent);
      }

      // Create an data object exposed by <DraggableCore>'s events
      function createCoreData(draggable /*: DraggableCore*/, x /*: number*/, y /*: number*/) /*: DraggableData*/{
        var state = draggable.state;
        var isStart = !(0, _shims.isNum)(state.lastX);
        if (isStart) {
          // If this is our first move, use the x and y as last coords.
          return {
            node: _reactDom2.default.findDOMNode(draggable),
            deltaX: 0,
            deltaY: 0,
            lastX: x,
            lastY: y,
            x: x,
            y: y
          };
        } else {
          // Otherwise calculate proper values.
          return {
            node: _reactDom2.default.findDOMNode(draggable),
            deltaX: x - state.lastX,
            deltaY: y - state.lastY,
            lastX: state.lastX,
            lastY: state.lastY,
            x: x,
            y: y
          };
        }
      }

      // Create an data exposed by <Draggable>'s events
      function createDraggableData(draggable /*: Draggable*/, coreData /*: DraggableData*/) /*: DraggableData*/{
        return {
          node: coreData.node,
          x: draggable.state.x + coreData.deltaX,
          y: draggable.state.y + coreData.deltaY,
          deltaX: coreData.deltaX,
          deltaY: coreData.deltaY,
          lastX: draggable.state.x,
          lastY: draggable.state.y
        };
      }

      // A lot faster than stringify/parse
      function cloneBounds(bounds /*: Bounds*/) /*: Bounds*/{
        return {
          left: bounds.left,
          top: bounds.top,
          right: bounds.right,
          bottom: bounds.bottom
        };
      }

      /***/
    }, /* 17 */
    /***/function (module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */(function (process) {

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        var _slicedToArray = function () {
          function sliceIterator(arr, i) {
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
                if (!_n && _i["return"]) _i["return"]();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i);
            } else {
              throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
          };
        }();
        var _createClass = function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var _react = __webpack_require__(2);
        var _react2 = _interopRequireDefault(_react);
        var _propTypes = __webpack_require__(3);
        var _propTypes2 = _interopRequireDefault(_propTypes);
        var _reactDom = __webpack_require__(11);
        var _reactDom2 = _interopRequireDefault(_reactDom);
        var _domFns = __webpack_require__(13);
        var _positionFns = __webpack_require__(16);
        var _shims = __webpack_require__(14);
        var _log = __webpack_require__(19);
        var _log2 = _interopRequireDefault(_log);
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
            default: obj
          };
        }
        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }
          return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }
        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
          }
          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        // Simple abstraction for dragging events names.
        /*:: import type {EventHandler} from './utils/types';*/
        var eventsFor = {
          touch: {
            start: 'touchstart',
            move: 'touchmove',
            stop: 'touchend'
          },
          mouse: {
            start: 'mousedown',
            move: 'mousemove',
            stop: 'mouseup'
          }
        };

        // Default to mouse events.
        var dragEventFor = eventsFor.mouse;

        //
        // Define <DraggableCore>.
        //
        // <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
        // work well with libraries that require more control over the element.
        //

        /*:: type CoreState = {
          dragging: boolean,
          lastX: number,
          lastY: number,
          touchIdentifier: ?number
        };*/

        var DraggableCore = function (_React$Component) {
          _inherits(DraggableCore, _React$Component);
          function DraggableCore() {
            var _ref;
            var _temp, _this, _ret;
            _classCallCheck(this, DraggableCore);
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DraggableCore.__proto__ || Object.getPrototypeOf(DraggableCore)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
              dragging: false,
              // Used while dragging to determine deltas.
              lastX: NaN,
              lastY: NaN,
              touchIdentifier: null
            }, _this.handleDragStart = function (e) {
              // Make it possible to attach event handlers on top of this one.
              _this.props.onMouseDown(e);

              // Only accept left-clicks.
              if (!_this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

              // Get nodes. Be sure to grab relative document (could be iframed)
              var domNode = _reactDom2.default.findDOMNode(_this);
              var ownerDocument = domNode.ownerDocument;

              // Short circuit if handle or cancel prop was provided and selector doesn't match.

              if (_this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || _this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.handle, domNode) || _this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.cancel, domNode)) {
                return;
              }

              // Set touch identifier in component state if this is a touch event. This allows us to
              // distinguish between individual touches on multitouch screens by identifying which
              // touchpoint was set to this element.
              var touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
              _this.setState({
                touchIdentifier: touchIdentifier
              });

              // Get the current drag point from the event. This is used as the offset.
              var position = (0, _positionFns.getControlPosition)(e, touchIdentifier, _this);
              if (position == null) return; // not possible but satisfies flow
              var x = position.x,
                y = position.y;

              // Create an event object with all the data parents need to make a decision here.

              var coreEvent = (0, _positionFns.createCoreData)(_this, x, y);
              (0, _log2.default)('DraggableCore: handleDragStart: %j', coreEvent);

              // Call event handler. If it returns explicit false, cancel.
              (0, _log2.default)('calling', _this.props.onStart);
              var shouldUpdate = _this.props.onStart(e, coreEvent);
              if (shouldUpdate === false) return;

              // Add a style to the body to disable user-select. This prevents text from
              // being selected all over the page.
              if (_this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument.body);

              // Initiate dragging. Set the current x and y as offsets
              // so we know how much we've moved during the drag. This allows us
              // to drag elements around even if they have been moved, without issue.
              _this.setState({
                dragging: true,
                lastX: x,
                lastY: y
              });

              // Add events to the document directly so we catch when the user's mouse/touch moves outside of
              // this element. We use different events depending on whether or not we have detected that this
              // is a touch-capable device.
              (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
              (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
            }, _this.handleDrag = function (e) {
              // Prevent scrolling on mobile devices, like ipad/iphone.
              if (e.type === 'touchmove') e.preventDefault();

              // Get the current drag point from the event. This is used as the offset.
              var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _this);
              if (position == null) return;
              var x = position.x,
                y = position.y;

              // Snap to grid if prop has been provided

              if (Array.isArray(_this.props.grid)) {
                var deltaX = x - _this.state.lastX,
                  deltaY = y - _this.state.lastY;
                var _snapToGrid = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);
                var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);
                deltaX = _snapToGrid2[0];
                deltaY = _snapToGrid2[1];
                if (!deltaX && !deltaY) return; // skip useless drag
                x = _this.state.lastX + deltaX, y = _this.state.lastY + deltaY;
              }
              var coreEvent = (0, _positionFns.createCoreData)(_this, x, y);
              (0, _log2.default)('DraggableCore: handleDrag: %j', coreEvent);

              // Call event handler. If it returns explicit false, trigger end.
              var shouldUpdate = _this.props.onDrag(e, coreEvent);
              if (shouldUpdate === false) {
                try {
                  // $FlowIgnore
                  _this.handleDragStop(new MouseEvent('mouseup'));
                } catch (err) {
                  // Old browsers
                  var event = document.createEvent('MouseEvents') /*: any*/ /*: MouseTouchEvent*/;
                  // I see why this insanity was deprecated
                  // $FlowIgnore
                  event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                  _this.handleDragStop(event);
                }
                return;
              }
              _this.setState({
                lastX: x,
                lastY: y
              });
            }, _this.handleDragStop = function (e) {
              if (!_this.state.dragging) return;
              var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _this);
              if (position == null) return;
              var x = position.x,
                y = position.y;
              var coreEvent = (0, _positionFns.createCoreData)(_this, x, y);
              var _ReactDOM$findDOMNode = _reactDom2.default.findDOMNode(_this),
                ownerDocument = _ReactDOM$findDOMNode.ownerDocument;

              // Remove user-select hack

              if (_this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument.body);
              (0, _log2.default)('DraggableCore: handleDragStop: %j', coreEvent);

              // Reset the el.
              _this.setState({
                dragging: false,
                lastX: NaN,
                lastY: NaN
              });

              // Call event handler
              _this.props.onStop(e, coreEvent);

              // Remove event handlers
              (0, _log2.default)('DraggableCore: Removing handlers');
              (0, _domFns.removeEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
              (0, _domFns.removeEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
            }, _this.onMouseDown = function (e) {
              dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

              return _this.handleDragStart(e);
            }, _this.onMouseUp = function (e) {
              dragEventFor = eventsFor.mouse;
              return _this.handleDragStop(e);
            }, _this.onTouchStart = function (e) {
              // We're on a touch device now, so change the event handlers
              dragEventFor = eventsFor.touch;
              return _this.handleDragStart(e);
            }, _this.onTouchEnd = function (e) {
              // We're on a touch device now, so change the event handlers
              dragEventFor = eventsFor.touch;
              return _this.handleDragStop(e);
            }, _temp), _possibleConstructorReturn(_this, _ret);
          }
          _createClass(DraggableCore, [{
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              // Remove any leftover event handlers. Remove both touch and mouse handlers in case
              // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
              var _ReactDOM$findDOMNode2 = _reactDom2.default.findDOMNode(this),
                ownerDocument = _ReactDOM$findDOMNode2.ownerDocument;
              (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
              (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
              (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
              (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
              if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument.body);
            }

            // Same as onMouseDown (start drag), but now consider this a touch device.
          }, {
            key: 'render',
            value: function render() /*: React.Element<any>*/{
              // Reuse the child provided
              // This makes it flexible to use whatever element is wanted (div, ul, etc)
              return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
                style: (0, _domFns.styleHacks)(this.props.children.props.style),
                // Note: mouseMove handler is attached to document so it will still function
                // when the user drags quickly and leaves the bounds of the element.
                onMouseDown: this.onMouseDown,
                onTouchStart: this.onTouchStart,
                onMouseUp: this.onMouseUp,
                onTouchEnd: this.onTouchEnd
              });
            }
          }]);
          return DraggableCore;
        }(_react2.default.Component);
        DraggableCore.displayName = 'DraggableCore';
        DraggableCore.propTypes = {
          /**
           * `allowAnyClick` allows dragging using any mouse button.
           * By default, we only accept the left button.
           *
           * Defaults to `false`.
           */
          allowAnyClick: _propTypes2.default.bool,
          /**
           * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
           * with the exception of `onMouseDown`, will not fire.
           */
          disabled: _propTypes2.default.bool,
          /**
           * By default, we add 'user-select:none' attributes to the document body
           * to prevent ugly text selection during drag. If this is causing problems
           * for your app, set this to `false`.
           */
          enableUserSelectHack: _propTypes2.default.bool,
          /**
           * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
           * instead of using the parent node.
           */
          offsetParent: function offsetParent(props, propName) {
            if (process.browser && props[propName] && props[propName].nodeType !== 1) {
              throw new Error('Draggable\'s offsetParent must be a DOM Node.');
            }
          },
          /**
           * `grid` specifies the x and y that dragging should snap to.
           */
          grid: _propTypes2.default.arrayOf(_propTypes2.default.number),
          /**
           * `handle` specifies a selector to be used as the handle that initiates drag.
           *
           * Example:
           *
           * ```jsx
           *   let App = React.createClass({
           *       render: function () {
           *         return (
           *            <Draggable handle=".handle">
           *              <div>
           *                  <div className="handle">Click me to drag</div>
           *                  <div>This is some other content</div>
           *              </div>
           *           </Draggable>
           *         );
           *       }
           *   });
           * ```
           */
          handle: _propTypes2.default.string,
          /**
           * `cancel` specifies a selector to be used to prevent drag initialization.
           *
           * Example:
           *
           * ```jsx
           *   let App = React.createClass({
           *       render: function () {
           *           return(
           *               <Draggable cancel=".cancel">
           *                   <div>
           *                     <div className="cancel">You can't drag from here</div>
           *                     <div>Dragging here works fine</div>
           *                   </div>
           *               </Draggable>
           *           );
           *       }
           *   });
           * ```
           */
          cancel: _propTypes2.default.string,
          /**
           * Called when dragging starts.
           * If this function returns the boolean false, dragging will be canceled.
           */
          onStart: _propTypes2.default.func,
          /**
           * Called while dragging.
           * If this function returns the boolean false, dragging will be canceled.
           */
          onDrag: _propTypes2.default.func,
          /**
           * Called when dragging stops.
           * If this function returns the boolean false, the drag will remain active.
           */
          onStop: _propTypes2.default.func,
          /**
           * A workaround option which can be passed if onMouseDown needs to be accessed,
           * since it'll always be blocked (as there is internal use of onMouseDown)
           */
          onMouseDown: _propTypes2.default.func,
          /**
           * These properties should be defined on the child, not here.
           */
          className: _shims.dontSetMe,
          style: _shims.dontSetMe,
          transform: _shims.dontSetMe
        };
        DraggableCore.defaultProps = {
          allowAnyClick: false,
          // by default only accept left click
          cancel: null,
          disabled: false,
          enableUserSelectHack: true,
          offsetParent: null,
          handle: null,
          grid: null,
          transform: null,
          onStart: function onStart() {},
          onDrag: function onDrag() {},
          onStop: function onStop() {},
          onMouseDown: function onMouseDown() {}
        };
        exports.default = DraggableCore;
        /* WEBPACK VAR INJECTION */
      }).call(exports, __webpack_require__(18));

      /***/
    }, /* 18 */
    /***/function (module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };

      /***/
    }, /* 19 */
    /***/function (module, exports, __webpack_require__) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = log;

      /*eslint no-console:0*/
      function log() {
      }

      /***/
    }
    /******/]);
  });
  });

  var reactDraggable$1 = unwrapExports(reactDraggable);
  var reactDraggable_1 = reactDraggable.DraggableCore;

  /**
   * A collection of shims that provide minimal functionality of the ES6 collections.
   *
   * These implementations are not meant to be used outside of the ResizeObserver
   * modules as they cover only a limited range of use cases.
   */
  /* eslint-disable require-jsdoc, valid-jsdoc */
  var MapShim = function () {
    if (typeof Map !== 'undefined') {
      return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
      var result = -1;
      arr.some(function (entry, index) {
        if (entry[0] === key) {
          result = index;
          return true;
        }
        return false;
      });
      return result;
    }
    return /** @class */function () {
      function class_1() {
        this.__entries__ = [];
      }
      Object.defineProperty(class_1.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function () {
          return this.__entries__.length;
        },
        enumerable: true,
        configurable: true
      });
      /**
       * @param {*} key
       * @returns {*}
       */
      class_1.prototype.get = function (key) {
        var index = getIndex(this.__entries__, key);
        var entry = this.__entries__[index];
        return entry && entry[1];
      };
      /**
       * @param {*} key
       * @param {*} value
       * @returns {void}
       */
      class_1.prototype.set = function (key, value) {
        var index = getIndex(this.__entries__, key);
        if (~index) {
          this.__entries__[index][1] = value;
        } else {
          this.__entries__.push([key, value]);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */
      class_1.prototype.delete = function (key) {
        var entries = this.__entries__;
        var index = getIndex(entries, key);
        if (~index) {
          entries.splice(index, 1);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */
      class_1.prototype.has = function (key) {
        return !!~getIndex(this.__entries__, key);
      };
      /**
       * @returns {void}
       */
      class_1.prototype.clear = function () {
        this.__entries__.splice(0);
      };
      /**
       * @param {Function} callback
       * @param {*} [ctx=null]
       * @returns {void}
       */
      class_1.prototype.forEach = function (callback, ctx) {
        if (ctx === void 0) {
          ctx = null;
        }
        for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
          var entry = _a[_i];
          callback.call(ctx, entry[1], entry[0]);
        }
      };
      return class_1;
    }();
  }();

  /**
   * Detects whether window and document objects are available in current environment.
   */
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

  // Returns global object of a current environment.
  var global$1 = function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
      return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
      return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
      return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
  }();

  /**
   * A shim for the requestAnimationFrame which falls back to the setTimeout if
   * first one is not supported.
   *
   * @returns {number} Requests' identifier.
   */
  var requestAnimationFrame$1 = function () {
    if (typeof requestAnimationFrame === 'function') {
      // It's required to use a bounded function because IE sometimes throws
      // an "Invalid calling object" error if rAF is invoked without the global
      // object on the left hand side.
      return requestAnimationFrame.bind(global$1);
    }
    return function (callback) {
      return setTimeout(function () {
        return callback(Date.now());
      }, 1000 / 60);
    };
  }();

  // Defines minimum timeout before adding a trailing call.
  var trailingTimeout = 2;
  /**
   * Creates a wrapper function which ensures that provided callback will be
   * invoked only once during the specified delay period.
   *
   * @param {Function} callback - Function to be invoked after the delay period.
   * @param {number} delay - Delay after which to invoke callback.
   * @returns {Function}
   */
  function throttle(callback, delay) {
    var leadingCall = false,
      trailingCall = false,
      lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
      if (leadingCall) {
        leadingCall = false;
        callback();
      }
      if (trailingCall) {
        proxy();
      }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
      requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
      var timeStamp = Date.now();
      if (leadingCall) {
        // Reject immediately following calls.
        if (timeStamp - lastCallTime < trailingTimeout) {
          return;
        }
        // Schedule new call to be in invoked when the pending one is resolved.
        // This is important for "transitions" which never actually start
        // immediately so there is a chance that we might miss one if change
        // happens amids the pending invocation.
        trailingCall = true;
      } else {
        leadingCall = true;
        trailingCall = false;
        setTimeout(timeoutCallback, delay);
      }
      lastCallTime = timeStamp;
    }
    return proxy;
  }

  // Minimum delay before invoking the update of observers.
  var REFRESH_DELAY = 20;
  // A list of substrings of CSS properties used to find transition events that
  // might affect dimensions of observed elements.
  var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
  // Check if MutationObserver is available.
  var mutationObserverSupported = typeof MutationObserver !== 'undefined';
  /**
   * Singleton controller class which handles updates of ResizeObserver instances.
   */
  var ResizeObserverController = /** @class */function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
      /**
       * Indicates whether DOM listeners have been added.
       *
       * @private {boolean}
       */
      this.connected_ = false;
      /**
       * Tells that controller has subscribed for Mutation Events.
       *
       * @private {boolean}
       */
      this.mutationEventsAdded_ = false;
      /**
       * Keeps reference to the instance of MutationObserver.
       *
       * @private {MutationObserver}
       */
      this.mutationsObserver_ = null;
      /**
       * A list of connected observers.
       *
       * @private {Array<ResizeObserverSPI>}
       */
      this.observers_ = [];
      this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
      this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
      if (!~this.observers_.indexOf(observer)) {
        this.observers_.push(observer);
      }
      // Add listeners if they haven't been added yet.
      if (!this.connected_) {
        this.connect_();
      }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
      var observers = this.observers_;
      var index = observers.indexOf(observer);
      // Remove observer if it's present in registry.
      if (~index) {
        observers.splice(index, 1);
      }
      // Remove listeners if controller has no connected observers.
      if (!observers.length && this.connected_) {
        this.disconnect_();
      }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
      var changesDetected = this.updateObservers_();
      // Continue running updates if changes have been detected as there might
      // be future ones caused by CSS transitions.
      if (changesDetected) {
        this.refresh();
      }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
      // Collect observers that have active observations.
      var activeObservers = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
      });
      // Deliver notifications in a separate cycle in order to avoid any
      // collisions between observers, e.g. when multiple instances of
      // ResizeObserver are tracking the same element and the callback of one
      // of them changes content dimensions of the observed target. Sometimes
      // this may result in notifications being blocked for the rest of observers.
      activeObservers.forEach(function (observer) {
        return observer.broadcastActive();
      });
      return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
      // Do nothing if running in a non-browser environment or if listeners
      // have been already added.
      if (!isBrowser || this.connected_) {
        return;
      }
      // Subscription to the "Transitionend" event is used as a workaround for
      // delayed transitions. This way it's possible to capture at least the
      // final state of an element.
      document.addEventListener('transitionend', this.onTransitionEnd_);
      window.addEventListener('resize', this.refresh);
      if (mutationObserverSupported) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);
        this.mutationsObserver_.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      } else {
        document.addEventListener('DOMSubtreeModified', this.refresh);
        this.mutationEventsAdded_ = true;
      }
      this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
      // Do nothing if running in a non-browser environment or if listeners
      // have been already removed.
      if (!isBrowser || !this.connected_) {
        return;
      }
      document.removeEventListener('transitionend', this.onTransitionEnd_);
      window.removeEventListener('resize', this.refresh);
      if (this.mutationsObserver_) {
        this.mutationsObserver_.disconnect();
      }
      if (this.mutationEventsAdded_) {
        document.removeEventListener('DOMSubtreeModified', this.refresh);
      }
      this.mutationsObserver_ = null;
      this.mutationEventsAdded_ = false;
      this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
      var _b = _a.propertyName,
        propertyName = _b === void 0 ? '' : _b;
      // Detect whether transition may affect dimensions of an element.
      var isReflowProperty = transitionKeys.some(function (key) {
        return !!~propertyName.indexOf(key);
      });
      if (isReflowProperty) {
        this.refresh();
      }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
      if (!this.instance_) {
        this.instance_ = new ResizeObserverController();
      }
      return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
  }();

  /**
   * Defines non-writable/enumerable properties of the provided target object.
   *
   * @param {Object} target - Object for which to define properties.
   * @param {Object} props - Properties to be defined.
   * @returns {Object} Target object.
   */
  var defineConfigurable = function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
      var key = _a[_i];
      Object.defineProperty(target, key, {
        value: props[key],
        enumerable: false,
        writable: false,
        configurable: true
      });
    }
    return target;
  };

  /**
   * Returns the global object associated with provided element.
   *
   * @param {Object} target
   * @returns {Object}
   */
  var getWindowOf = function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
  };

  // Placeholder of an empty content rectangle.
  var emptyRect = createRectInit(0, 0, 0, 0);
  /**
   * Converts provided string to a number.
   *
   * @param {number|string} value
   * @returns {number}
   */
  function toFloat(value) {
    return parseFloat(value) || 0;
  }
  /**
   * Extracts borders size from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @param {...string} positions - Borders positions (top, right, ...)
   * @returns {number}
   */
  function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
      var value = styles['border-' + position + '-width'];
      return size + toFloat(value);
    }, 0);
  }
  /**
   * Extracts paddings sizes from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @returns {Object} Paddings box.
   */
  function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
      var position = positions_1[_i];
      var value = styles['padding-' + position];
      paddings[position] = toFloat(value);
    }
    return paddings;
  }
  /**
   * Calculates content rectangle of provided SVG element.
   *
   * @param {SVGGraphicsElement} target - Element content rectangle of which needs
   *      to be calculated.
   * @returns {DOMRectInit}
   */
  function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
  }
  /**
   * Calculates content rectangle of provided HTMLElement.
   *
   * @param {HTMLElement} target - Element for which to calculate the content rectangle.
   * @returns {DOMRectInit}
   */
  function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth,
      clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
      return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width),
      height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
      // Following conditions are required to handle Internet Explorer which
      // doesn't include paddings and borders to computed CSS dimensions.
      //
      // We can say that if CSS dimensions + paddings are equal to the "client"
      // properties then it's either IE, and thus we don't need to subtract
      // anything, or an element merely doesn't have paddings/borders styles.
      if (Math.round(width + horizPad) !== clientWidth) {
        width -= getBordersSize(styles, 'left', 'right') + horizPad;
      }
      if (Math.round(height + vertPad) !== clientHeight) {
        height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
      }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
      // In some browsers (only in Firefox, actually) CSS width & height
      // include scroll bars size which can be removed at this step as scroll
      // bars are the only difference between rounded dimensions + paddings
      // and "client" properties, though that is not always true in Chrome.
      var vertScrollbar = Math.round(width + horizPad) - clientWidth;
      var horizScrollbar = Math.round(height + vertPad) - clientHeight;
      // Chrome has a rather weird rounding of "client" properties.
      // E.g. for an element with content width of 314.2px it sometimes gives
      // the client width of 315px and for the width of 314.7px it may give
      // 314px. And it doesn't happen all the time. So just ignore this delta
      // as a non-relevant.
      if (Math.abs(vertScrollbar) !== 1) {
        width -= vertScrollbar;
      }
      if (Math.abs(horizScrollbar) !== 1) {
        height -= horizScrollbar;
      }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
  }
  /**
   * Checks whether provided element is an instance of the SVGGraphicsElement.
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  var isSVGGraphicsElement = function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
      return function (target) {
        return target instanceof getWindowOf(target).SVGGraphicsElement;
      };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) {
      return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function';
    };
  }();
  /**
   * Checks whether provided element is a document element (<html>).
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
  }
  /**
   * Calculates an appropriate content rectangle for provided html or svg element.
   *
   * @param {Element} target - Element content rectangle of which needs to be calculated.
   * @returns {DOMRectInit}
   */
  function getContentRect(target) {
    if (!isBrowser) {
      return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
      return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
  }
  /**
   * Creates rectangle with an interface of the DOMRectReadOnly.
   * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
   *
   * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
   * @returns {DOMRectReadOnly}
   */
  function createReadOnlyRect(_a) {
    var x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
      x: x,
      y: y,
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: height + y,
      left: x
    });
    return rect;
  }
  /**
   * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
   * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
   *
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   * @param {number} width - Rectangle's width.
   * @param {number} height - Rectangle's height.
   * @returns {DOMRectInit}
   */
  function createRectInit(x, y, width, height) {
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  /**
   * Class that is responsible for computations of the content rectangle of
   * provided DOM element and for keeping track of it's changes.
   */
  var ResizeObservation = /** @class */function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
      /**
       * Broadcasted width of content rectangle.
       *
       * @type {number}
       */
      this.broadcastWidth = 0;
      /**
       * Broadcasted height of content rectangle.
       *
       * @type {number}
       */
      this.broadcastHeight = 0;
      /**
       * Reference to the last observed content rectangle.
       *
       * @private {DOMRectInit}
       */
      this.contentRect_ = createRectInit(0, 0, 0, 0);
      this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
      var rect = getContentRect(this.target);
      this.contentRect_ = rect;
      return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
      var rect = this.contentRect_;
      this.broadcastWidth = rect.width;
      this.broadcastHeight = rect.height;
      return rect;
    };
    return ResizeObservation;
  }();
  var ResizeObserverEntry = /** @class */function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
      var contentRect = createReadOnlyRect(rectInit);
      // According to the specification following properties are not writable
      // and are also not enumerable in the native implementation.
      //
      // Property accessors are not being used as they'd require to define a
      // private WeakMap storage which may cause memory leaks in browsers that
      // don't support this type of collections.
      defineConfigurable(this, {
        target: target,
        contentRect: contentRect
      });
    }
    return ResizeObserverEntry;
  }();
  var ResizeObserverSPI = /** @class */function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
      /**
       * Collection of resize observations that have detected changes in dimensions
       * of elements.
       *
       * @private {Array<ResizeObservation>}
       */
      this.activeObservations_ = [];
      /**
       * Registry of the ResizeObservation instances.
       *
       * @private {Map<Element, ResizeObservation>}
       */
      this.observations_ = new MapShim();
      if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
      }
      this.callback_ = callback;
      this.controller_ = controller;
      this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      }
      // Do nothing if current environment doesn't have the Element interface.
      if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
      }
      if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
      }
      var observations = this.observations_;
      // Do nothing if element is already being observed.
      if (observations.has(target)) {
        return;
      }
      observations.set(target, new ResizeObservation(target));
      this.controller_.addObserver(this);
      // Force the update of observations.
      this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      }
      // Do nothing if current environment doesn't have the Element interface.
      if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
      }
      if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
      }
      var observations = this.observations_;
      // Do nothing if element is not being observed.
      if (!observations.has(target)) {
        return;
      }
      observations.delete(target);
      if (!observations.size) {
        this.controller_.removeObserver(this);
      }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
      this.clearActive();
      this.observations_.clear();
      this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
      var _this = this;
      this.clearActive();
      this.observations_.forEach(function (observation) {
        if (observation.isActive()) {
          _this.activeObservations_.push(observation);
        }
      });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
      // Do nothing if observer doesn't have active observations.
      if (!this.hasActive()) {
        return;
      }
      var ctx = this.callbackCtx_;
      // Create ResizeObserverEntry instance for every active observation.
      var entries = this.activeObservations_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
      });
      this.callback_.call(ctx, entries, ctx);
      this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
      this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
      return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
  }();

  // Registry of internal observers. If WeakMap is not available use current shim
  // for the Map collection as it has all required methods and because WeakMap
  // can't be fully polyfilled anyway.
  var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
  /**
   * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
   * exposing only those methods and properties that are defined in the spec.
   */
  var ResizeObserver = /** @class */function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
      if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function.');
      }
      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      }
      var controller = ResizeObserverController.getInstance();
      var observer = new ResizeObserverSPI(callback, controller, this);
      observers.set(this, observer);
    }
    return ResizeObserver;
  }();
  // Expose public methods of ResizeObserver.
  ['observe', 'unobserve', 'disconnect'].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
      var _a;
      return (_a = observers.get(this))[method].apply(_a, arguments);
    };
  });
  var index = function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
      return global$1.ResizeObserver;
    }
    return ResizeObserver;
  }();

  var getMargin_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = getMargin;
  var toNumber = function toNumber(n) {
    return parseInt(n) || 0;
  };
  function getMargin(style) {
    return {
      top: style ? toNumber(style.marginTop) : 0,
      right: style ? toNumber(style.marginRight) : 0,
      bottom: style ? toNumber(style.marginBottom) : 0,
      left: style ? toNumber(style.marginLeft) : 0
    };
  }
  module.exports = exports["default"];
  });

  unwrapExports(getMargin_1);

  var getCloneDimensions_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = getCloneDimensions;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      'default': obj
    };
  }

  var _getMargin2 = _interopRequireDefault(getMargin_1);
  function getCloneDimensions(node, options) {
    var parentNode = node.parentNode;
    var context = document.createElement('div');
    var clone = node.cloneNode(true);
    var style = getComputedStyle(node);
    var rect = undefined,
      width = undefined,
      height = undefined;

    // give the node some context to measure off of
    // no height and hidden overflow hide node copy
    context.style.height = 0;
    context.style.overflow = 'hidden';

    // clean up any attributes that might cause a conflict with the original node
    // i.e. inputs that should focus or submit data
    clone.setAttribute('id', '');
    clone.setAttribute('name', '');

    // set props to get a true dimension calculation
    if (options.display || style && style.getPropertyValue('display') === 'none') {
      clone.style.display = options.display || 'block';
    }
    if (options.width || style && !parseInt(style.getPropertyValue('width'))) {
      clone.style.width = options.width || 'auto';
    }
    if (options.height || style && !parseInt(style.getPropertyValue('height'))) {
      clone.style.height = options.height || 'auto';
    }

    // append copy to context
    context.appendChild(clone);

    // append context to DOM so we can measure
    parentNode.appendChild(context);

    // get accurate dimensions
    rect = clone.getBoundingClientRect();
    width = clone.offsetWidth;
    height = clone.offsetHeight;

    // destroy clone
    parentNode.removeChild(context);
    return {
      rect: {
        width: width,
        height: height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      },
      margin: (0, _getMargin2['default'])(style)
    };
  }
  module.exports = exports['default'];
  });

  unwrapExports(getCloneDimensions_1);

  var getNodeDimensions_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = getNodeDimensions;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      'default': obj
    };
  }

  var _getCloneDimensions2 = _interopRequireDefault(getCloneDimensions_1);

  var _getMargin2 = _interopRequireDefault(getMargin_1);
  function getNodeDimensions(node) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var rect = node.getBoundingClientRect();
    var width = undefined,
      height = undefined,
      margin = undefined;

    // determine if we need to clone the element to get proper dimensions or not
    if ((!rect.width || !rect.height) && !options.noCloneOnZeroDimension || options.clone) {
      var cloneDimensions = (0, _getCloneDimensions2['default'])(node, options);
      rect = cloneDimensions.rect;
      margin = cloneDimensions.margin;
    }
    // if no cloning needed, we need to determine if margin should be accounted for
    else if (options.margin) {
      margin = (0, _getMargin2['default'])(getComputedStyle(node));
    }

    // include margin in width/height calculation if desired
    if (options.margin) {
      width = margin.left + rect.width + margin.right;
      height = margin.top + rect.height + margin.bottom;
    } else {
      width = rect.width;
      height = rect.height;
    }
    return {
      width: width,
      height: height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
    };
  }
  module.exports = exports['default'];
  });

  unwrapExports(getNodeDimensions_1);

  var Measure_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _react2 = _interopRequireDefault(React$1__default);

  var _propTypes2 = _interopRequireDefault(propTypes);

  var _reactDom2 = _interopRequireDefault(ReactDOM);

  var _resizeObserverPolyfill2 = _interopRequireDefault(index);

  var _getNodeDimensions2 = _interopRequireDefault(getNodeDimensions_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  var Measure = function (_Component) {
    _inherits(Measure, _Component);
    function Measure(props) {
      _classCallCheck(this, Measure);
      var _this = _possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).call(this, props));
      _this.measure = function () {
        var includeMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.includeMargin;
        var useClone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.useClone;

        // bail out if we shouldn't measure
        if (!_this.props.shouldMeasure) return;

        // if no parent available we need to requery the DOM node
        if (!_this._node.parentNode) {
          _this._setDOMNode();
        }
        var dimensions = _this.getDimensions(_this._node, includeMargin, useClone);
        var isChildFunction = typeof _this.props.children === 'function';

        // determine if we need to update our callback with new dimensions or not
        _this._propsToMeasure.some(function (prop) {
          if (dimensions[prop] !== _this._lastDimensions[prop]) {
            // update our callback if we've found a dimension that has changed
            _this.props.onMeasure(dimensions);

            // update state to send dimensions to child function
            if (isChildFunction && typeof _this !== 'undefined') {
              _this.setState({
                dimensions: dimensions
              });
            }

            // store last dimensions to compare changes
            _this._lastDimensions = dimensions;

            // we don't need to look any further, bail out
            return true;
          }
        });
      };
      _this.state = {
        dimensions: {
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };
      _this._node = null;
      _this._propsToMeasure = _this._getPropsToMeasure(props);
      _this._lastDimensions = {};
      return _this;
    }
    _createClass(Measure, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;
        this._setDOMNode();

        // measure on first render
        this.measure();

        // add component to resize observer to detect changes on resize
        this.resizeObserver = new _resizeObserverPolyfill2.default(function () {
          return _this2.measure();
        });
        this.resizeObserver.observe(this._node);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(_ref) {
        var config = _ref.config,
          whitelist = _ref.whitelist,
          blacklist = _ref.blacklist;

        // we store the properties ourselves so we need to update them if the
        // whitelist or blacklist props have changed
        if (this.props.whitelist !== whitelist || this.props.blacklist !== blacklist) {
          this._propsToMeasure = this._getPropsToMeasure({
            whitelist: whitelist,
            blacklist: blacklist
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.resizeObserver.disconnect(this._node);
        this._node = null;
      }
    }, {
      key: '_setDOMNode',
      value: function _setDOMNode() {
        this._node = _reactDom2.default.findDOMNode(this);
      }
    }, {
      key: 'getDimensions',
      value: function getDimensions() {
        var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._node;
        var includeMargin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.includeMargin;
        var useClone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.useClone;
        var cloneOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.props.cloneOptions;
        return (0, _getNodeDimensions2.default)(node, _extends({
          margin: includeMargin,
          clone: useClone
        }, cloneOptions));
      }
    }, {
      key: '_getPropsToMeasure',
      value: function _getPropsToMeasure(_ref2) {
        var whitelist = _ref2.whitelist,
          blacklist = _ref2.blacklist;
        return whitelist.filter(function (prop) {
          return blacklist.indexOf(prop) < 0;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var children = this.props.children;
        return React$1__default.Children.only(typeof children === 'function' ? children(this.state.dimensions) : children);
      }
    }]);
    return Measure;
  }(React$1__default.Component);
  Measure.propTypes = {
    whitelist: _propTypes2.default.array,
    blacklist: _propTypes2.default.array,
    includeMargin: _propTypes2.default.bool,
    useClone: _propTypes2.default.bool,
    cloneOptions: _propTypes2.default.object,
    shouldMeasure: _propTypes2.default.bool,
    onMeasure: _propTypes2.default.func
  };
  Measure.defaultProps = {
    whitelist: ['width', 'height', 'top', 'right', 'bottom', 'left'],
    blacklist: [],
    includeMargin: true,
    useClone: false,
    cloneOptions: {},
    shouldMeasure: true,
    onMeasure: function onMeasure() {
      return null;
    }
  };
  exports.default = Measure;
  module.exports = exports['default'];
  });

  unwrapExports(Measure_1);

  var reactMeasure = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Measure2 = _interopRequireDefault(Measure_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  exports.default = _Measure2.default;
  module.exports = exports['default'];
  });

  var Measure = unwrapExports(reactMeasure);

  const ARROW_LEFT = 37;
  const ARROW_RIGHT = 39;
  const SPACE = 32;
  const TAB = 9;

  class ProgressSlider extends React$1__default.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        handleWidth: null,
        progressHolderWidth: null
      };
      this.measureProgressHolder = ({
        width
      }) => {
        this.setState({
          progressHolderWidth: width
        });
      };
      this.measureHandle = ({
        width
      }) => {
        this.setState({
          handleWidth: width
        });
      };
      this.handleStop = (mouseEvent, dragEvent) => {
        if (this.props.onSeek) {
          this.props.onSeek(this.positionToTime(dragEvent.x));
        }
      };
      this.handleDrag = (mouseEvent, dragEvent) => {
        if (this.props.onScrub) {
          this.props.onScrub(this.positionToTime(dragEvent.x));
        }
      };
      this.handleKeyDown = event => {
        let destination;
        if (event.keyCode == ARROW_LEFT) {
          destination = Math.max(0, this.props.currentTime - 1);
        } else if (event.keyCode == ARROW_RIGHT) {
          destination = Math.min(this.props.currentTime + 1, this.props.duration || Infinity);
        }
        if (this.prop.onSeek) {
          this.props.onSeek(destination);
        }
      };
    }
    positionToTime(x) {
      if (this.props.duration && this.state.progressHolderWidth) {
        const fraction = Math.max(0, Math.min(1, x / this.state.progressHolderWidth));
        return fraction * this.props.duration;
      } else {
        return 0;
      }
    }
    render() {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "vjs-progress-control",
        tabIndex: "4",
        onKeyDown: this.handleKeyDown
      }, /*#__PURE__*/React$1__default.createElement(Measure, {
        whitelist: ['width'],
        onMeasure: this.measureProgressHolder
      }, /*#__PURE__*/React$1__default.createElement(reactDraggable_1, {
        onStart: this.handleDrag,
        onDrag: this.handleDrag,
        onStop: this.handleStop
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "vjs-progress-holder"
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "vjs-load-progress",
        style: {
          width: toPercent(this.loadProgress())
        }
      }), /*#__PURE__*/React$1__default.createElement("div", {
        className: "vjs-play-progress",
        style: {
          width: toPercent(this.playProgress())
        }
      }), /*#__PURE__*/React$1__default.createElement(Measure, {
        whitelist: ['width'],
        onMeasure: this.measureHandle
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "vjs-seek-handle",
        style: {
          left: this.handlePosition()
        }
      }))))));
    }
    handlePosition() {
      if (this.state.handleWidth && this.state.progressHolderWidth) {
        return (this.state.progressHolderWidth - this.state.handleWidth) * this.playProgress();
      } else {
        return toPercent(this.playProgress());
      }
    }
    loadProgress() {
      return this.props.duration > 0 ? this.props.bufferedEnd / this.props.duration : 0;
    }
    playProgress() {
      return this.props.duration > 0 ? this.props.currentTime / this.props.duration : 0;
    }
  }
  ProgressSlider.defaultProps = {
    currentTime: 0,
    bufferedEnd: 0
  };
  function toPercent(value) {
    return value > 0 ? value * 100 + '%' : 0;
  }

  class MenuBarButton extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        subMenuVisible: false
      };
      this.onLinkClick = event => {
        event.preventDefault();
        if (this.props.subMenuItems.length > 0) {
          this.setState({
            subMenuVisible: true
          });
        }
        if (this.props.onClick) {
          this.props.onClick();
        }
      };
      this.onMouseEnter = () => {
        if (this.props.subMenuItems.length > 0) {
          this.setState({
            subMenuVisible: true
          });
        }
        if (this.props.onMouseEnter) {
          this.props.onMouseEnter();
        }
      };
      this.onMouseLeave = () => {
        this.closeMenu();
        if (this.props.onMouseEnter) {
          this.props.onMouseLeave();
        }
      };
      this.onFocus = () => {
        clearTimeout(this.closeMenuTimeout);
      };
      this.onBlur = () => {
        clearTimeout(this.closeMenuTimeout);
        this.closeMenuTimeout = setTimeout(() => {
          this.closeMenu();
        }, 100);
      };
      this.closeMenu = () => {
        this.setState({
          subMenuVisible: false
        });
      };
    }
    render() {
      const props = this.props;
      return /*#__PURE__*/React.createElement("div", {
        className: wrapperClassName(props, this.state.subMenuVisible),
        ref: wrapper => this.wrapper = wrapper,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onFocus: this.onFocus,
        onBlur: this.onBlur
      }, /*#__PURE__*/React.createElement("a", {
        className: className$5(props, 'link'),
        href: "#",
        tabIndex: "4",
        title: props.title,
        onClick: this.onLinkClick
      }, /*#__PURE__*/React.createElement(Icon, {
        className: className$5(props, 'icon'),
        name: props.iconName
      })), renderSubMenu(props, this.closeMenu));
    }
  }
  MenuBarButton.defaultProps = {
    subMenuItems: []
  };
  function renderSubMenu(props, closeMenu) {
    if (props.subMenuItems.length > 0) {
      return /*#__PURE__*/React.createElement("ul", {
        className: "player_controls-menu_bar_button_sub_menu"
      }, renderSubMenuItems(props, closeMenu));
    }
  }
  function renderSubMenuItems(props, closeMenu) {
    return props.subMenuItems.map(item => {
      return /*#__PURE__*/React.createElement("li", {
        className: itemClassName(item),
        key: item.value
      }, /*#__PURE__*/React.createElement("a", {
        className: "player_controls-menu_bar_button_sub_menu_item_link",
        href: "#",
        tabIndex: "4",
        onClick: subMenuItemClickHandler(props, item.value, closeMenu)
      }, renderSubMenuItemIcon(item), item.label, renderSubMenuItemAnnotation(props, item)));
    });
  }
  function wrapperClassName(props, subMenuVisible) {
    return classnames({
      'player_controls-menu_bar_button-sub_menu_visible': subMenuVisible
    }, className$5(props));
  }
  function itemClassName(item) {
    return classnames('player_controls-menu_bar_button_sub_menu_item', {
      'player_controls-menu_bar_button_sub_menu_item-active': item.active
    });
  }
  function renderSubMenuItemIcon(item) {
    if (item.active) {
      return /*#__PURE__*/React.createElement(Icon, {
        className: "player_controls-menu_bar_button_sub_menu_item_icon",
        name: "activeMenuItem"
      });
    }
  }
  function renderSubMenuItemAnnotation(props, item) {
    if (item.annotation) {
      return /*#__PURE__*/React.createElement("span", {
        className: className$5(props, 'sub_menu_item_annotation')
      }, item.annotation);
    }
  }
  function subMenuItemClickHandler(props, value, closeMenu) {
    return event => {
      event.preventDefault();
      closeMenu();
      if (props.onSubMenuItemClick) {
        props.onSubMenuItemClick(value);
      }
    };
  }
  function className$5(props, ...suffix) {
    return classnames(['player_controls-menu_bar_button', ...suffix].join('_'), [props.className, ...suffix].join('_'));
  }

  function QualityMenu(props) {
    if (props.items.length < 2) {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
    return /*#__PURE__*/React.createElement(MenuBarButton, {
      className: "player_controls-quality_menu_button",
      title: props.buttonTitle,
      iconName: "mediaQuality",
      subMenuItems: props.items,
      onSubMenuItemClick: props.onItemClick
    });
  }
  QualityMenu.defaultProps = {
    items: []
  };

  function TextTracksMenu(props) {
    if (props.items.length < 2) {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
    return /*#__PURE__*/React.createElement(MenuBarButton, {
      className: "player_controls-text_tracks_menu_button",
      title: props.buttonTitle,
      iconName: "textTracks",
      subMenuItems: props.items,
      onSubMenuItemClick: props.onItemClick
    });
  }
  TextTracksMenu.defaultProps = {
    items: []
  };

  function MenuBar(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: className$6(props)
    }, renderAdditionalButtons(props), /*#__PURE__*/React.createElement(TextTracksMenu, {
      buttonTitle: props.textTracksMenuButtonTitle,
      items: props.textTracksMenuItems,
      onItemClick: props.onTextTracksMenuItemClick
    }), /*#__PURE__*/React.createElement(QualityMenu, {
      buttonTitle: props.qualityMenuButtonTitle,
      items: props.qualityMenuItems,
      onItemClick: props.onQualityMenuItemClick
    }));
  }
  MenuBar.defaultProps = {
    additionalButtons: [],
    standAlone: true
  };
  function className$6(props) {
    return classnames(props.className, 'player_controls-menu_bar', {
      'player_controls-menu_bar-hidden_on_phone': props.hiddenOnPhone,
      'player_controls-menu_bar-stand_alone': props.standAlone,
      'player_controls-menu_bar-inverted': props.inverted
    });
  }
  function renderAdditionalButtons(props) {
    return props.additionalButtons.map(additionalButton => {
      return /*#__PURE__*/React.createElement(MenuBarButton, {
        title: additionalButton.label,
        iconName: additionalButton.iconName,
        className: additionalButton.className,
        key: additionalButton.name,
        onClick: createHandler(props.onAdditionalButtonClick, additionalButton.name),
        onMouseEnter: createHandler(props.onAdditionalButtonMouseEnter, additionalButton.name),
        onMouseLeave: createHandler(props.onAdditionalButtonMouseLeave, additionalButton.name)
      });
    });
  }
  function createHandler(handler, name) {
    if (handler) {
      return () => handler(name);
    }
  }

  function withVisibilityWatching(Component) {
    return class VisibilityWatcher extends React$1__default.Component {
      constructor(props) {
        super(props);
        this.checkVisibility = () => {
          const style = window.getComputedStyle(this.element);
          if (this.lastVisibility != style.visibility) {
            if (style.visibility == 'visible' && style.display != 'none') {
              if (this.props.onVisible) {
                this.props.onVisible();
              }
            } else {
              if (this.props.onHidden) {
                this.props.onHidden();
              }
            }
          }
          this.lastVisibility = style.visibility;
        };
      }
      componentDidMount() {
        this.element = ReactDOM.findDOMNode(this);
        this.updateInterval();
      }
      componentDidUpdate() {
        this.updateInterval();
      }
      componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
        this.element = null;
      }
      updateInterval() {
        if (this.props.watchVisibility && !this.interval) {
          this.interval = setInterval(this.checkVisibility, 50);
        } else if (!this.props.watchVisibility && this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }
      render() {
        return /*#__PURE__*/React$1__default.createElement(Component, this.props);
      }
    };
  }

  function PlayerControls(props) {
    return /*#__PURE__*/React$1__default.createElement(Container, props, /*#__PURE__*/React$1__default.createElement("span", {
      className: "hint"
    }, props.hint), /*#__PURE__*/React$1__default.createElement(InfoBox, Object.assign({}, props.infoBox, {
      hiddenDuringPlayback: props.infoBoxHiddenDuringPlayback
    })), /*#__PURE__*/React$1__default.createElement("div", {
      className: controlBarClassNames(props)
    }, renderLoadingSpinner(props), /*#__PURE__*/React$1__default.createElement("div", {
      className: "play_button"
    }, /*#__PURE__*/React$1__default.createElement(PlayButton$1, {
      title: props.playButtonTitle,
      iconName: props.playButtonIconName,
      isPlaying: props.isPlaying,
      onClick: props.onPlayButtonClick
    })), renderProgress(props), /*#__PURE__*/React$1__default.createElement("div", {
      className: "control_bar_text"
    }, props.controlBarText)), /*#__PURE__*/React$1__default.createElement(MenuBar, {
      standAlone: false,
      additionalButtons: props.additionalMenuBarButtons,
      onAdditionalButtonClick: props.onAdditionalButtonClick,
      onAdditionalButtonMouseEnter: props.onAdditionalButtonMouseEnter,
      onAdditionalButtonMouseLeave: props.onAdditionalButtonMouseLeave,
      qualityMenuButtonTitle: props.qualityMenuButtonTitle,
      qualityMenuItems: props.qualityMenuItems,
      onQualityMenuItemClick: props.onQualityMenuItemClick,
      textTracksMenuButtonTitle: props.textTracksMenuButtonTitle,
      textTracksMenuItems: props.textTracksMenuItems,
      onTextTracksMenuItemClick: props.onTextTracksMenuItemClick
    }));
  }
  function renderLoadingSpinner(props) {
    if (props.isLoading) {
      return /*#__PURE__*/React$1__default.createElement(LoadingSpinner, props);
    }
  }
  function renderProgress(props) {
    if (props.hasProgress) {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "player_controls-progress"
      }, /*#__PURE__*/React$1__default.createElement(CurrentTime, props), /*#__PURE__*/React$1__default.createElement(TimeDivider, null), /*#__PURE__*/React$1__default.createElement(Duration, props), /*#__PURE__*/React$1__default.createElement(ProgressSlider, props));
    }
  }
  function controlBarClassNames(props) {
    return classnames('vjs-control-bar', {
      'with_quality_menu_present': props.qualityMenuItems && props.qualityMenuItems.length >= 2,
      'with_text_tracks_menu_present': props.textTracksMenuItems && props.textTracksMenuItems.length >= 2
    });
  }
  var PlayerControls$1 = withVisibilityWatching(PlayerControls);

  const t$1 = memoizedSelector(locale, locale => function (key, options) {
    return I18n.t(key, {
      locale,
      ...options
    });
  });
  function locale(state) {
    return state.i18n.locale;
  }

  function CloseButton(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "close_button text_hidden_only",
      tabIndex: "4",
      title: props.t('pageflow.public.close'),
      onClick: props.onClick
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, props.t('pageflow.public.close')));
  }
  var CloseButton$1 = connect(combine$1({
    t: t$1
  }))(CloseButton);

  function editorOnly (Component) {
    if (!PAGEFLOW_EDITOR) {
      return function () {
        return false;
      };
    } else {
      return Component;
    }
  }



  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PageWrapper: PageWrapper,
    PageBackground: PageBackground,
    PageBackgroundImage: PageBackgroundImage,
    PageShadow: PageShadow,
    PageForeground: PageForeground,
    PageContent: PageContent,
    PageScroller: PageScroller$1,
    PageHeader: PageHeader,
    PageText: PageText,
    PageLink: PageLink$1,
    PageThumbnail: PageThumbnail$1,
    LazyLoadedPageThumbnail: LazyLoadedPageThumbnail,
    PlayerControls: PlayerControls$1,
    CloseButton: CloseButton$1,
    MenuBar: MenuBar,
    Icon: Icon,
    editorOnly: editorOnly,
    withVisibilityWatching: withVisibilityWatching,
    Draggable: reactDraggable$1,
    Measure: Measure
  });

  const selector$1 = createItemSelector('chapters');
  function chapterAttribute(name, options) {
    return memoizedSelector(selector$1(options), chapter => chapter && chapter[name]);
  }
  const chapterAttributes = selector$1;

  const selector$2 = createItemSelector('storylines');
  function storylineAttribute(name, options) {
    return memoizedSelector(selector$2(options), storyline => storyline && storyline[name]);
  }

  function currentParentChapterAttributes() {
    return function (state, props) {
      const parentPage = currentParentPageAttributes()(state, props);
      if (!parentPage) {
        return null;
      }
      return chapterAttributes({
        id: parentPage.chapterId
      })(state, props);
    };
  }
  function currentParentPageAttributes() {
    return function (state, props) {
      const currentChapterId = pageAttribute('chapterId', {
        id: state.currentPageId
      })(state, props);
      const currentStorylineId = chapterAttribute('storylineId', {
        id: currentChapterId
      })(state, props);
      const currentParentPageId = storylineAttribute('parentPagePermaId', {
        id: currentStorylineId
      })(state, props);
      return pageAttributes({
        id: currentParentPageId
      })(state, props);
    };
  }

  function setting({
    property
  }) {
    return function (state) {
      return state.settings[property];
    };
  }

  const selector$3 = createItemSelector('widgets');
  function widgetAttribute(property, {
    role
  }) {
    return memoizedSelector(selector$3({
      id: role
    }), widget => widget && widget[property]);
  }
  function widgetAttributes({
    role
  }) {
    return memoizedSelector(selector$3({
      id: role
    }), widget => widget);
  }
  function editingWidget({
    role
  }) {
    return memoizedSelector(selector$3({
      id: role
    }), widget => !!(widget && widget.editing));
  }



  var selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    pageAttribute: pageAttribute,
    pageAttributes: pageAttributes,
    pageIsActive: pageIsActive,
    pageIsPrepared: pageIsPrepared,
    currentParentPageAttributes: currentParentPageAttributes,
    currentParentChapterAttributes: currentParentChapterAttributes,
    t: t$1,
    setting: setting,
    file: file,
    prop: prop,
    widgetAttributes: widgetAttributes,
    editingWidget: editingWidget
  });

  function entryAttribute(name) {
    return function (state) {
      return state.entry[name];
    };
  }
  function isEntryReady(state) {
    return !!state.entry.isReady;
  }

  function PagePrintImage({
    page,
    isEntryReady
  }) {
    if (!isEntryReady) {
      return null;
    }
    if (page.backgroundType == 'video' || page.type == 'video') {
      return /*#__PURE__*/React.createElement(PrintVideoPoster, {
        videoId: page.videoFileId,
        posterImageId: page.posterImageId
      });
    } else {
      return /*#__PURE__*/React.createElement(PrintImage, {
        imageId: page.backgroundImageId
      });
    }
  }
  var PagePrintImage$1 = connect(combine$1({
    isEntryReady
  }))(PagePrintImage);
  const PrintVideoPoster = connect(combine$1({
    videoFile: file('videoFiles', {
      id: prop('videoId')
    }),
    posterImageFile: file('imageFiles', {
      id: prop('posterImageId')
    })
  }))(function ({
    videoFile,
    posterImageFile
  }) {
    if (posterImageFile) {
      return /*#__PURE__*/React.createElement(PrintImageTag, {
        file: posterImageFile
      });
    } else {
      return /*#__PURE__*/React.createElement(PrintImageTag, {
        file: videoFile
      });
    }
  });
  const PrintImage = connectInPage(combine$1({
    file: file('imageFiles', {
      id: prop('imageId')
    }),
    pageIsPrepared: pageIsPrepared()
  }))(PrintImageTag);
  function PrintImageTag({
    file
  }) {
    if (file && file.isReady && pageIsPrepared) {
      return /*#__PURE__*/React.createElement("img", {
        src: file.urls.print,
        alt: file.alt,
        className: "print_image"
      });
    } else {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
  }

  function playerStateClassNames (playerState) {
    return classnames({
      'is_playing': playerState.shouldPlay,
      'is_playing_delayed': playerState.hasBeenPlayingJustNow,
      'is_paused': !playerState.shouldPlay
    });
  }

  const TOGGLE_PLAYING = 'MEDIA_TOGGLE_PLAYING';
  const PLAY = 'MEDIA_PLAY';
  const PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
  const PAUSE = 'MEDIA_PAUSE';
  const FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';
  const CHANGE_VOLUME_FACTOR = 'CHANGE_VOLUME_FACTOR';
  const PLAY_FAILED = 'MEDIA_PLAY_FAILED';
  const PLAYING_MUTED = 'MEDIA_PLAYING_MUTED';
  const SCRUB_TO = 'MEDIA_SCRUB_TO';
  const SEEK_TO = 'MEDIA_SEEK_TO';
  const PREBUFFER = 'MEDIA_PREBUFFER';
  const PREBUFFERED = 'MEDIA_PREBUFFERED';
  const ABORT_PREBUFFERING = 'MEDIA_ABORT_PREBUFFERING';
  const BUFFER_UNDERRUN = 'MEDIA_BUFFER_UNDERRUN';
  const BUFFER_UNDERRUN_CONTINUE = 'MEDIA_BUFFER_UNDERRUN_CONTINUE';
  const META_DATA_LOADED = 'MEDIA_META_DATA_LOADED';
  const PROGRESS = 'MEDIA_PROGRESS';
  const PLAYING = 'MEDIA_PLAYING';
  const PAUSED = 'MEDIA_PAUSED';
  const TIME_UPDATE = 'MEDIA_TIME_UPDATE';
  const ENDED = 'MEDIA_ENDED';
  const SEEKING = 'MEDIA_SEEKING';
  const SEEKED = 'MEDIA_SEEKED';
  const WAITING = 'MEDIA_WAITING';
  const HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT = 'MEDIA_HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT';
  const USER_INTERACTION = 'MEDIA_USER_INTERACTION';
  const USER_IDLE = 'MEDIA_USER_IDLE';
  const CONTROLS_ENTERED = 'MEDIA_CONTROLS_ENTERED';
  const CONTROLS_LEFT = 'MEDIA_CONTROLS_LEFT';
  const FOCUS_ENTERED_CONTROLS = 'MEDIA_FOCUS_ENTERED_CONTROLS';
  const FOCUS_LEFT_CONTROLS = 'MEDIA_FOCUS_LEFT_CONTROLS';
  const CONTROLS_HIDDEN = 'MEDIA_CONTROLS_HIDDEN';
  const SHOW_INFO_BOX_DURING_PLAYBACK = 'SHOW_INFO_BOX_DURING_PLAYBACK';
  const HIDE_INFO_BOX_DURING_PLAYBACK = 'HIDE_INFO_BOX_DURING_PLAYBACK';
  const TOGGLE_INFO_BOX_DURING_PLAYBACK = 'TOGGLE_INFO_BOX_DURING_PLAYBACK';
  const SAVE_MEDIA_ELEMENT_ID = 'MEDIA_SAVE_MEDIA_ELEMENT_ID';
  const DISCARD_MEDIA_ELEMENT_ID = 'MEDIA_DISCARD_MEDIA_ELEMENT_ID';
  function actionCreators({
    scope = 'default'
  } = {}) {
    return {
      togglePlaying() {
        return pageAction(TOGGLE_PLAYING);
      },
      play() {
        return pageAction(PLAY);
      },
      playAndFadeIn({
        fadeDuration
      }) {
        return pageAction(PLAY_AND_FADE_IN, {
          fadeDuration
        });
      },
      pause() {
        return pageAction(PAUSE);
      },
      fadeOutAndPause({
        fadeDuration
      }) {
        return pageAction(FADE_OUT_AND_PAUSE, {
          fadeDuration
        });
      },
      changeVolumeFactor(volumeFactor, {
        fadeDuration
      }) {
        return pageAction(CHANGE_VOLUME_FACTOR, {
          volumeFactor,
          fadeDuration
        });
      },
      playFailed() {
        return pageAction(PLAY_FAILED);
      },
      playingMuted() {
        return pageAction(PLAYING_MUTED);
      },
      scrubTo(time) {
        return pageAction(SCRUB_TO, {
          time
        });
      },
      seekTo(time) {
        return pageAction(SEEK_TO, {
          time
        });
      },
      prebuffer() {
        return pageAction(PREBUFFER);
      },
      prebuffered() {
        return pageAction(PREBUFFERED);
      },
      abortPrebuffering() {
        return pageAction(ABORT_PREBUFFERING);
      },
      bufferUnderrun() {
        return pageAction(BUFFER_UNDERRUN);
      },
      bufferUnderrunContinue() {
        return pageAction(BUFFER_UNDERRUN_CONTINUE);
      },
      playing() {
        return pageAction(PLAYING);
      },
      paused() {
        return pageAction(PAUSED);
      },
      timeUpdate({
        currentTime,
        duration
      }) {
        return pageAction(TIME_UPDATE, {
          currentTime,
          duration
        });
      },
      metaDataLoaded({
        currentTime,
        duration
      }) {
        return pageAction(META_DATA_LOADED, {
          currentTime,
          duration
        });
      },
      progress({
        bufferedEnd
      }) {
        return pageAction(PROGRESS, {
          bufferedEnd
        });
      },
      ended() {
        return pageAction(ENDED);
      },
      seeking() {
        return pageAction(SEEKING);
      },
      seeked() {
        return pageAction(SEEKED);
      },
      waiting() {
        return pageAction(WAITING);
      },
      hasNotBeenPlayingForAMoment(value) {
        return pageAction(HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT);
      },
      userInteraction() {
        return pageAction(USER_INTERACTION);
      },
      userIdle() {
        return pageAction(USER_IDLE);
      },
      controlsEntered() {
        return pageAction(CONTROLS_ENTERED);
      },
      controlsLeft() {
        return pageAction(CONTROLS_LEFT);
      },
      focusEnteredControls() {
        return pageAction(FOCUS_ENTERED_CONTROLS);
      },
      focusLeftControls() {
        return pageAction(FOCUS_LEFT_CONTROLS);
      },
      controlsHidden() {
        return pageAction(CONTROLS_HIDDEN);
      },
      showInfoBoxDuringPlayback() {
        return pageAction(SHOW_INFO_BOX_DURING_PLAYBACK);
      },
      hideInfoBoxDuringPlayback() {
        return pageAction(HIDE_INFO_BOX_DURING_PLAYBACK);
      },
      toggleInfoBoxDuringPlayback() {
        return pageAction(TOGGLE_INFO_BOX_DURING_PLAYBACK);
      },
      saveMediaElementId(id) {
        return pageAction(SAVE_MEDIA_ELEMENT_ID, {
          id
        });
      },
      discardMediaElementId() {
        return pageAction(DISCARD_MEDIA_ELEMENT_ID);
      }
    };
    function pageAction(type, payload = {}) {
      return {
        type,
        meta: {
          collectionName: 'pages',
          mediaScope: scope
        },
        payload
      };
    }
  }
  function updateTextTrackSettings(textTrack) {
    return update({
      property: 'textTrack',
      value: textTrack ? {
        srclang: textTrack.srclang,
        kind: textTrack.kind
      } : {}
    });
  }
  function updateVideoQualitySetting(value) {
    return update({
      property: 'videoQuality',
      value
    });
  }

  function muted(state) {
    return state.backgroundMedia.muted;
  }

  function playerState({
    scope = 'default'
  } = {}) {
    return pageState(`media.${scope}`);
  }
  function playerActions({
    scope = 'default'
  } = {}) {
    return function (dispatch) {
      return bindActionCreators(actionCreators({
        scope
      }), dispatch);
    };
  }
  function textTracks({
    file,
    defaultTextTrackFileId = () => {}
  }) {
    return memoizedSelector(setting({
      property: 'textTrack'
    }), setting({
      property: 'volume'
    }), t$1, locale, nestedFiles('textTrackFiles', {
      parent: file
    }), defaultTextTrackFileId, (textTrackSettings, volume, translate, currentLocale, textTrackFiles, defaultTextTrackFileId) => {
      textTrackSettings = textTrackSettings || {};
      const files = textTrackFiles.map(textTrackFile => ({
        displayLabel: displayLabel(textTrackFile, translate),
        ...textTrackFile
      }));
      const autoFile = autoTextTrackFile(files, defaultTextTrackFileId, currentLocale, volume);
      return {
        files: files.sort((file1, file2) => (file1.displayLabel || '').localeCompare(file2.displayLabel || '')),
        autoFile,
        activeFileId: getActiveTextTrackFileId(files, autoFile, textTrackSettings),
        mode: textTrackSettings.kind == 'off' ? 'off' : textTrackSettings.kind ? 'user' : 'auto'
      };
    });
  }
  function autoTextTrackFile(textTrackFiles, defaultTextTrackFileId, locale, volume) {
    if (defaultTextTrackFileId) {
      const defaultTextTrackFile = textTrackFiles.find(textTrackFile => textTrackFile.permaId == defaultTextTrackFileId);
      if (defaultTextTrackFile) {
        return defaultTextTrackFile;
      }
    }
    const subtitlesInEntryLanguage = textTrackFiles.find(textTrackFile => {
      return textTrackFile.kind == 'subtitles' && textTrackFile.srclang == locale;
    });
    const captionsForMutedVideo = volume == 0 && textTrackFiles.find(textTrackFile => {
      return textTrackFile.kind == 'captions';
    });
    return subtitlesInEntryLanguage || captionsForMutedVideo;
  }
  function displayLabel(textTrackFile, t) {
    return textTrackFile.label || t('pageflow.public.languages.' + textTrackFile.srclang || 'unknown', {
      defaultValue: t('pageflow.public.languages.unknown')
    });
  }
  function getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, options) {
    if (options.kind == 'off') {
      return null;
    }
    const file = textTrackFiles.find(textTrackFile => textTrackFile.srclang == options.srclang && textTrackFile.kind == options.kind);
    if (file) {
      return file.id;
    }
    return autoTextTrackFile && autoTextTrackFile.id;
  }
  function videoQualitySetting() {
    return setting({
      property: 'videoQuality'
    });
  }
  function pageShouldAutoplay({
    autoplayWhenBackgroundMediaMuted,
    id
  }) {
    return memoizedSelector(autoplayWhenBackgroundMediaMuted, pageHasAutoplayOption({
      id: id
    }), muted, (autoplayWhenBackgroundMediaMuted, autoplayOption, isBackgroudMediaMuted) => {
      return autoplayOption && (!isBackgroudMediaMuted || autoplayWhenBackgroundMediaMuted);
    });
  }
  function pageHasAutoplayOption(options) {
    return memoizedSelector(pageAttribute('autoplay', options), autoplayOption => {
      return autoplayOption !== false;
    });
  }

  function MediaPlayerControls(props) {
    const actions = props.playerActions;
    const playerState = props.playerState;
    const onTextTracksMenuItemClick = function (value) {
      if (value == 'off') {
        props.updateTextTrackSettings({
          kind: 'off'
        });
      } else {
        props.updateTextTrackSettings(props.textTracks.files.find(textTrackFile => {
          return textTrackFile.id == value;
        }));
      }
    };
    const PlayerControls = props.playerControlsComponent;
    return /*#__PURE__*/React$1__default.createElement(PlayerControls, Object.assign({
      hasProgress: true,
      controlBarText: props.controlBarText,
      isLoading: playerState.isLoading || playerState.bufferUnderrun,
      isPlaying: playerState.shouldPlay,
      currentTime: playerState.scrubbingAt !== undefined ? playerState.scrubbingAt : playerState.currentTime,
      bufferedEnd: playerState.bufferedEnd,
      duration: playerState.duration,
      mediaElementId: playerState.mediaElementId,
      onPlayButtonClick: actions.togglePlaying,
      onScrub: actions.scrubTo,
      onSeek: actions.seekTo,
      onMouseEnter: actions.controlsEntered,
      onMouseLeave: actions.controlsLeft,
      onFocus: actions.focusEnteredControls,
      onBlur: actions.focusLeftControls,
      watchVisibility: playerState.isPlaying,
      onHidden: actions.controlsHidden,
      additionalMenuBarButtons: additionalMenuBarButtons(props),
      infoBoxHiddenDuringPlayback: infoBoxHiddenDuringPlayback(props),
      onAdditionalButtonMouseEnter: actions.showInfoBoxDuringPlayback,
      onAdditionalButtonMouseLeave: actions.hideInfoBoxDuringPlayback,
      onAdditionalButtonClick: actions.toggleInfoBoxDuringPlayback,
      qualityMenuItems: qualityMenuItems(props.qualities, props.file, props.activeQuality, props.t),
      qualityMenuButtonTitle: props.t('pageflow.public.media_quality'),
      onQualityMenuItemClick: props.updateVideoQualitySetting,
      textTracksMenuItems: textTracksMenuItems(props.textTracks, props.t),
      textTracksMenuButtonTitle: props.t('pageflow.public.text_tracks'),
      onTextTracksMenuItemClick: onTextTracksMenuItemClick
    }, props, {
      className: className$7(playerState)
    }));
  }
  MediaPlayerControls.defaultProps = {
    playerControlsComponent: PlayerControls$1,
    qualities: [],
    textTracks: {
      files: []
    }
  };
  var MediaPlayerControls$1 = connect(combine$1({
    activeQuality: videoQualitySetting(),
    t: t$1
  }), {
    updateTextTrackSettings,
    updateVideoQualitySetting
  })(MediaPlayerControls);
  function className$7(playerState) {
    return classnames(playerStateClassNames(playerState));
  }
  function additionalMenuBarButtons(props) {
    const t = props.t;
    if (isEmpty(props.infoBox)) {
      return [];
    }
    return [{
      name: 'toggleInfoBox',
      className: 'player_controls-toggle_info_box_menu_button',
      label: t('pageflow.public.toggle_info_box'),
      iconName: 'toggleInfoBox'
    }];
  }
  function infoBoxHiddenDuringPlayback(props) {
    const playerState = props.playerState;
    if (playerState.infoBoxHiddenDuringPlayback === undefined) {
      return !!props.textTracks.activeFileId;
    } else {
      return playerState.infoBoxHiddenDuringPlayback;
    }
  }
  function textTracksMenuItems(textTracks, t) {
    if (!textTracks.files.length) {
      return [];
    }
    const offItem = {
      value: 'off',
      label: t('pageflow.public.text_track_modes.none'),
      active: textTracks.mode == 'off'
    };
    const autoItem = {
      value: 'auto',
      label: textTracks.autoFile ? t('pageflow.public.text_track_modes.auto', {
        label: textTracks.autoFile.displayLabel
      }) : t('pageflow.public.text_track_modes.auto_off'),
      active: textTracks.mode == 'auto'
    };
    return [autoItem, offItem].concat(textTracks.files.map(textTrackFile => {
      return {
        value: textTrackFile.id,
        label: textTrackFile.displayLabel,
        active: textTracks.mode == 'user' && textTrackFile.id == textTracks.activeFileId
      };
    }));
  }
  function qualityMenuItems(qualities, videoFile, activeQuality, t) {
    activeQuality = activeQuality || 'auto';
    return availableQualities(qualities, videoFile).map(value => ({
      value,
      label: t(`pageflow.public.video_qualities.labels.${value}`),
      annotation: t(`pageflow.public.video_qualities.annotations.${value}`, {
        defaultValue: ''
      }),
      active: value == activeQuality
    }));
  }
  function availableQualities(qualities, videoFile) {
    if (!videoFile) {
      return [];
    }
    return qualities.filter(quality => !!videoFile.urls[quality] || quality == 'auto');
  }

  function NonJsLinks(props) {
    if (!props.file) {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
    return /*#__PURE__*/React.createElement("p", {
      className: "non_js_video"
    }, /*#__PURE__*/React.createElement("a", {
      href: url(props),
      target: "_blank"
    }, text$1(props)));
  }
  function url({
    entrySlug,
    file
  }) {
    const type = file.collectionName == 'videoFiles' ? 'videos' : 'audio';
    return `/${entrySlug}/${type}/${file.id}`;
  }
  function text$1({
    file,
    t
  }) {
    const type = file.collectionName == 'videoFiles' ? 'video' : 'audio';
    return t(`pageflow.public.open_${type}`);
  }
  var NonJsLinks$1 = connect(combine$1({
    t: t$1,
    entrySlug: entryAttribute('slug')
  }))(NonJsLinks);

  const pageScrollerMarginBottom = memoizedSelector(pageState('media.pageScrollerMargin'), pageState => {
    return pageState && pageState.bottom;
  });

  function MediaPage(props) {
    const page = props.page;
    const playerState = props.playerState;
    const infoBox = {
      title: page.additionalTitle,
      description: page.additionalDescription
    };
    return /*#__PURE__*/React.createElement(PageWrapper, {
      className: pageWraperClassName(props.className, willAutoplay(props), props.textTracks, playerState)
    }, /*#__PURE__*/React.createElement(PageBackground, {
      pageHasPlayerControls: true
    }, props.children, /*#__PURE__*/React.createElement(PageShadow, {
      page: page,
      className: playerStateClassNames(playerState)
    })), /*#__PURE__*/React.createElement(PageForeground, {
      onInteraction: () => playerState.userIsIdle && props.playerActions.userInteraction(),
      classNames: playerStateClassNames(playerState)
    }, /*#__PURE__*/React.createElement(MediaPlayerControls$1, {
      file: props.file,
      textTracks: props.textTracks,
      playerState: playerState,
      playerActions: props.playerActions,
      qualities: props.qualities,
      controlBarText: props.controlBarText,
      infoBox: infoBox,
      playerControlsComponent: props.playerControlsComponent
    }), /*#__PURE__*/React.createElement(PageScroller$1, {
      className: playerStateClassNames(playerState),
      marginBottom: props.dynamicPageScrollerMargin && props.pageScrollerMarginBottom
    }, /*#__PURE__*/React.createElement(PageHeader, {
      page: page
    }), /*#__PURE__*/React.createElement(PagePrintImage$1, {
      page: page
    }), /*#__PURE__*/React.createElement(PageText, {
      page: page,
      marginBottom: props.dynamicPageScrollerMargin ? 'none' : 'for_player_controls'
    }, /*#__PURE__*/React.createElement(NonJsLinks$1, {
      file: props.file
    })))));
  }
  MediaPage.defaultProps = {
    playerControlsCanOverlapPageText: true
  };
  var MediaPage$1 = connectInPage(combine$1({
    pageScrollerMarginBottom,
    textTracks: textTracks({
      file: prop('file'),
      defaultTextTrackFileId: prop('page.defaultTextTrackFileId')
    }),
    hasAutoplaySupport: has$3('autoplay support'),
    shouldAutoplay: pageShouldAutoplay({
      id: prop('page.permaId'),
      autoplayWhenBackgroundMediaMuted: prop('autoplayWhenBackgroundMediaMuted')
    })
  }))(MediaPage);
  function willAutoplay(props) {
    return props.shouldAutoplay && props.hasAutoplaySupport && !props.playerState.playFailed;
  }
  function pageWraperClassName(className, autoplay, textTracks, playerState) {
    return classnames(className, {
      'has_text_tracks': !!textTracks.activeFileId,
      'is_idle': playerState.isPlaying && playerState.userIsIdle,
      'is_control_bar_focused': playerState.focusInsideControls,
      'is_control_bar_hovered': playerState.userHoveringControls,
      'is_control_bar_hidden': playerState.controlsHidden,
      'unplayed': playerState.unplayed && !autoplay,
      'should_play': playerState.shouldPlay,
      'has_played': playerState.hasPlayed
    });
  }

  function PageFilePlayer(props) {
    const fileReady = props.file && props.file.isReady;
    if (fileReady) {
      const StructuredDataComponent = props.structuredDataComponent || function () {
        return null;
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%'
        }
      }, renderFile(props), /*#__PURE__*/React.createElement(StructuredDataComponent, {
        file: props.file
      }));
    } else {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
  }
  function renderFile(props) {
    if (props.pageIsPrepared) {
      const FilePlayer = props.playerComponent;
      return /*#__PURE__*/React.createElement(FilePlayer, {
        file: props.file,
        posterImageFile: props.posterImageFile,
        playerState: props.playerState,
        playerActions: props.playerActions,
        atmoDuringPlayback: props.atmoDuringPlayback,
        fit: props.fit,
        position: props.position,
        loop: props.loop,
        muted: props.muted,
        playsInline: props.playsInline,
        defaultTextTrackFileId: props.defaultTextTrackFileId,
        textTracksEnabled: props.textTracksEnabled,
        textTrackPosition: props.textTrackPosition
      });
    } else if (props.preloadComponent && props.pageIsPreloaded) {
      const Preload = props.preloadComponent;
      return /*#__PURE__*/React.createElement(Preload, {
        file: props.file,
        posterImageFile: props.posterImageFile
      });
    } else {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
  }
  var PageFilePlayer$1 = connectInPage(combine$1({
    pageIsPrepared: pageIsPrepared(),
    pageIsPreloaded: pageIsPreloaded(),
    atmoDuringPlayback: pageAttribute('atmoDuringPlayback'),
    defaultTextTrackFileId: pageAttribute('defaultTextTrackFileId')
  }))(PageFilePlayer);

  // This component acts as an isolation layer between React and
  // Video.js. During initialization, Video.js rearranges the DOM,
  // wraps the video tag into a div and adds further elements.
  //
  // While the original media tag could easily be built using React,
  // once the DOM has been changed, there is no secure way to update the
  // tag using React.
  //
  // To avoid this problem, this component allows re-rendering the
  // media tag while discarding all changes made by Video.js. This is
  // achieved by constructing the media tag as a detached DOM node and
  // replacing the inner HTML of the element.
  //
  // The `onSetup`/`onDispose` callback props can be used to
  // re-initialize Video.js on a fresh media tag.
  //
  // The component performs a deep comparison of its props to decide
  // whether the media tag has to be refreshed.
  class MediaTag extends React$1__default.Component {
    render() {
      return /*#__PURE__*/React$1__default.createElement("div", {
        ref: element => this.containerElement = element,
        dangerouslySetInnerHTML: this.mediaTagHTML()
      });
    }
    shouldComponentUpdate(nextProps) {
      return nextProps.tagName !== this.props.tagName || nextProps.poster !== this.props.poster || nextProps.loop !== this.props.loop || nextProps.muted !== this.props.muted || nextProps.playsInline !== this.props.playsInline || !deepEqual(nextProps.sources, this.props.sources) || !deepEqual(nextProps.tracks, this.props.tracks);
    }
    componentDidMount() {
      this.triggerOnSetup();
    }
    componentWillUpdate() {
      this.triggerOnDispose();
    }
    componentDidUpdate() {
      this.triggerOnSetup();
    }
    componentWillUnmount() {
      this.triggerOnDispose();
    }
    triggerOnSetup() {
      if (this.props.onSetup) {
        this.props.onSetup(this.containerElement.firstElementChild);
      }
    }
    triggerOnDispose() {
      if (this.props.onDispose) {
        this.props.onDispose();
      }
    }
    mediaTagHTML() {
      const wrapper = document.createElement('div');
      const mediaElement = document.createElement(this.props.tagName);
      mediaElement.setAttribute('preload', 'none');
      mediaElement.setAttribute('crossorigin', 'anonymous');
      mediaElement.setAttribute('alt', this.props.alt);
      if (this.props.poster) {
        mediaElement.setAttribute('data-poster', this.props.poster);
      }
      if (this.props.loop) {
        mediaElement.setAttribute('loop', 'true');
      }
      if (this.props.muted) {
        mediaElement.setAttribute('muted', 'true');
      }
      if (this.props.playsInline) {
        mediaElement.setAttribute('playsinline', 'true');
      }
      this.props.sources.forEach(source => {
        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', source.src);
        sourceElement.setAttribute('type', source.type);
        mediaElement.appendChild(sourceElement);
      });
      this.props.tracks.forEach(track => {
        const trackElement = document.createElement('track');
        trackElement.setAttribute('src', track.src);
        trackElement.setAttribute('id', track.id);
        trackElement.setAttribute('kind', track.kind);
        trackElement.setAttribute('srclang', track.srclang);
        trackElement.setAttribute('label', track.label);
        mediaElement.appendChild(trackElement);
      });
      wrapper.appendChild(mediaElement);
      return {
        __html: wrapper.innerHTML.replace('preload="none"', 'preload="auto"')
      };
    }
  }
  MediaTag.defaultProps = {
    tagName: 'video',
    sources: [],
    tracks: []
  };

  // This function assumes that that the parameters are arrays of
  // objects containing only skalar values. It is not a full deep
  // equality check, but  suffices for the use case.
  function deepEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      let aItem = a[i];
      let bItem = b[i];
      if (Object.keys(aItem).length !== Object.keys(bItem).length) {
        return false;
      }
      for (let key in aItem) {
        if (aItem[key] !== bItem[key]) {
          return false;
        }
      }
    }
    return true;
  }

  function createPageflowPlayer(element, {
    emulateTextTracksDisplay,
    atmoSettings,
    mediaContext,
    playsInline
  }) {
    const isAudio = element.tagName.toLowerCase() == 'audio';
    const player = new pageflow.VideoPlayer(element, {
      controlBar: false,
      loadingSpinner: false,
      bigPlayButton: false,
      errorDisplay: false,
      textTrackSettings: false,
      poster: element.getAttribute('data-poster'),
      html5: {
        nativeCaptions: !isAudio && pageflow.browser.has('iphone platform')
      },
      bufferUnderrunWaiting: true,
      useSlimPlayerControlsDuringPhonePlayback: !playsInline && !isAudio,
      fullscreenDuringPhonePlayback: !playsInline && !isAudio,
      fallbackToMutedAutoplay: !isAudio,
      volumeFading: true,
      hooks: pageflow.atmo.createMediaPlayerHooks(atmoSettings),
      mediaEvents: true,
      context: mediaContext
    });
    player.textTrackSettings = {
      getValues() {
        return {};
      }
    };
    player.addClass('video-js');
    player.addClass('player');
    return player;
  }

  function watchPlayer (player, actions) {
    player.on('loadedmetadata', () => actions.metaDataLoaded({
      currentTime: player.currentTime(),
      duration: player.duration()
    }));
    player.on('progress', () => actions.progress({
      bufferedEnd: player.bufferedEnd()
    }));
    player.on('play', actions.playing);
    player.on('playfailed', actions.playFailed);
    player.on('playmuted', actions.playingMuted);
    player.on('pause', actions.paused);
    player.on('waiting', actions.waiting);
    player.on('seeking', actions.seeking);
    player.on('seeked', actions.seeked);
    player.on('bufferunderrun', actions.bufferUnderrun);
    player.on('bufferunderruncontinue', actions.bufferUnderrunContinue);
    player.on('timeupdate', () => actions.timeUpdate({
      currentTime: player.currentTime(),
      duration: player.duration()
    }));
    player.on('ended', actions.ended);
  }

  function initPlayer(player, getPlayerState, playerActions, prevFileId, fileId) {
    const playerState = getPlayerState();
    if (fileId === prevFileId) {
      if (playerState.currentTime > 0) {
        player.currentTime(playerState.currentTime);
      }
    }
    if (playerState.shouldPrebuffer) {
      player.prebuffer().then(playerActions.prebuffered, () => {});
    }
    if (playerState.isPlaying) {
      player.play();
    }
    player.on('canplay', function () {
      if (getPlayerState().shouldPlay && player.paused()) {
        player.play();
      }
    });
  }
  function updatePlayer(player, playerState, nextPlayerState, playerActions) {
    if (!playerState.shouldPrebuffer && nextPlayerState.shouldPrebuffer) {
      player.prebuffer().then(() => setTimeout(playerActions.prebuffered, 0));
    }
    if (!playerState.shouldPlay && nextPlayerState.shouldPlay) {
      if (nextPlayerState.fadeDuration) {
        player.playAndFadeIn(nextPlayerState.fadeDuration);
      } else {
        player.play();
      }
    } else if (playerState.shouldPlay && !nextPlayerState.shouldPlay && nextPlayerState.isPlaying) {
      if (nextPlayerState.fadeDuration) {
        player.fadeOutAndPause(nextPlayerState.fadeDuration);
      } else {
        player.pause();
      }
    }
    if (nextPlayerState.shouldSeekTo !== undefined && nextPlayerState.shouldSeekTo !== playerState.shouldSeekTo) {
      player.currentTime(nextPlayerState.shouldSeekTo);
    }
  }

  function initTextTracks(player, getActiveTexTrackFileId, getPosition) {
    player.on('pause', () => {
      updateOnNextPlay(player, getActiveTexTrackFileId, getPosition);
    });
    player.textTracks().on('addtrack', () => {
      updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
    });
    updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
    updateOnNextPlay(player, getActiveTexTrackFileId, getPosition);
  }
  function updateOnNextPlay(player, getActiveTexTrackFileId, getPosition) {
    player.one('timeupdate', () => {
      updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
    });
  }
  function updateTextTracks(player, prevActiveTextTrackFileId, activeTextTrackFileId, position) {
    if (prevActiveTextTrackFileId != activeTextTrackFileId) {
      updateMode(player, activeTextTrackFileId);
    }
    updatePosition(player, position);
  }
  function updateMode(player, activeTextTrackFileId) {
    [].slice.call(player.textTracks()).forEach(textTrack => {
      if (textTrack.id == `text_track_file_${activeTextTrackFileId}`) {
        textTrack.mode = 'showing';
      } else {
        textTrack.mode = 'disabled';
      }
    });
  }
  function updatePosition(player, position) {
    player.updateCueLineSettings(position);
  }
  function textTracksFromFiles(textTrackFiles, textTracksEnabled) {
    if (!textTracksEnabled) {
      return [];
    }
    return textTrackFiles.filter(textTrackFile => textTrackFile.isReady).map(textTrackFile => ({
      id: `text_track_file_${textTrackFile.id}`,
      kind: textTrackFile.kind,
      label: textTrackFile.displayLabel,
      srclang: textTrackFile.srclang,
      src: textTrackFile.urls.vtt
    }));
  }

  function widgetPresent(typeName) {
    return function (state) {
      return state.widgetPresence[typeName];
    };
  }

  function isFeatureEnabled(name) {
    return function (state) {
      return state.features.indexOf(name) >= 0;
    };
  }

  function createFilePlayer ({
    tagName,
    sources,
    poster = () => {},
    emulateTextTracksDisplay = false,
    createPlayer = createPageflowPlayer
  }) {
    class FilePlayer extends React$1__default.Component {
      constructor(props, context) {
        super(props, context);
        this.displaysTextTracksInNativePlayer = this.props.hasNativeVideoPlayer && tagName == 'video';
        this.initiallyMuted = this.props.muted;
        this.updateAtmoSettings();
        this.setupMediaTag = element => {
          this.player = createPlayer(element, {
            emulateTextTracksDisplay,
            atmoSettings: this.atmoSettings,
            mediaContext: this.context.mediaContext,
            playsInline: props.playsInline
          });
          this.player.ready(() => {
            this.props.playerActions.saveMediaElementId(element.id);
            initPlayer(this.player, () => this.props.playerState, this.props.playerActions, this.prevFileId, this.props.file.id);
            if (!this.displaysTextTracksInNativePlayer) {
              initTextTracks(this.player, () => this.props.textTracks.activeFileId, () => this.props.textTrackPosition);
            }
            watchPlayer(this.player, this.props.playerActions);
            this.prevFileId = this.props.file.id;
          }, true);
        };
        this.disposeMediaTag = () => {
          this.player.dispose();
          this.player = null;
          this.props.playerActions.discardMediaElementId();
        };
      }
      componentDidUpdate(prevProps) {
        if (!this.player) {
          return;
        }
        this.player.ready(() => {
          updatePlayerMuted(this.player, prevProps.muted, this.props.muted);
          updatePlayerVolumeFactor(this.player, prevProps.playerState.volumeFactor, this.props.playerState.volumeFactor, this.props.playerState.volumeFactorFadeDuration);
          updatePlayer(this.player, prevProps.playerState, this.props.playerState, this.props.playerActions);
        }, true);
        if (!this.displaysTextTracksInNativePlayer) {
          updateTextTracks(this.player, prevProps.textTracks.activeFileId, this.props.textTracks.activeFileId, this.props.textTrackPosition);
        }
        this.updateAtmoSettings();
      }
      updateAtmoSettings() {
        this.atmoSettings = this.atmoSettings || {};
        this.atmoSettings['atmo_during_playback'] = this.props.atmoDuringPlayback;
      }
      render() {
        return /*#__PURE__*/React$1__default.createElement(MediaTag, {
          tagName: tagName,
          sources: sources(this.props.file, this.props.quality, {
            hasHighBandwidth: this.props.hasHighBandwidth,
            hasBrokenOggSupport: this.props.hasBrokenOggSupport,
            forceBestQuality: this.props.forceBestQuality,
            forceFullhdQuality: this.props.forceFullhdQuality
          }),
          tracks: textTracksFromFiles(this.props.textTracks.files, this.props.textTracksEnabled),
          poster: poster(this.props.file, this.props.posterImageFile),
          loop: this.props.loop,
          muted: this.initiallyMuted,
          playsInline: this.props.playsInline,
          alt: this.props.file.alt,
          onSetup: this.setupMediaTag,
          onDispose: this.disposeMediaTag
        });
      }
    }
    FilePlayer.contextTypes = {
      mediaContext: React$1__default.PropTypes.object
    };
    FilePlayer.defaultProps = {
      textTracksEnabled: true,
      textTracks: {
        files: []
      }
    };
    const result = connect(combine$1({
      textTracks: textTracks({
        file: prop('file'),
        defaultTextTrackFileId: prop('defaultTextTrackFileId')
      }),
      quality: setting({
        property: 'videoQuality'
      }),
      hasNativeVideoPlayer: has$3('native video player'),
      hasHighBandwidth: has$3('high bandwidth'),
      hasBrokenOggSupport: has$3('broken ogg support'),
      forceBestQuality: isFeatureEnabled('force_best_video_quality'),
      forceFullhdQuality: isFeatureEnabled('force_fullhd_video_quality'),
      textTrackPosition
    }), {
      updateTextTrackSettings
    })(FilePlayer);
    result.WrappedComponent = FilePlayer;
    return result;
  }
  const slimPlayerControlsPresent = widgetPresent('slimPlayerControls');
  function textTrackPosition(state, {
    playerState,
    textTrackPosition
  }) {
    if (textTrackPosition) {
      return textTrackPosition;
    }
    if (slimPlayerControlsPresent(state)) {
      // see pageflow.VideoPlayer#updateCueLineSettings for explanation of values.
      if (playerState.controlsHidden) {
        return 'auto.lazy';
      } else {
        return 'auto.translated';
      }
    } else {
      return playerState.controlsHidden ? 'auto.lazy' : 'top';
    }
  }
  function updatePlayerMuted(player, prevMuted, muted) {
    if (prevMuted !== muted) {
      player.muted(muted);
    }
  }
  function updatePlayerVolumeFactor(player, prevVolumeFactor, volumeFactor, fadeDuration) {
    if (prevVolumeFactor !== volumeFactor) {
      player.changeVolumeFactor(volumeFactor, fadeDuration);
    }
  }

  var AudioFilePlayer = createFilePlayer({
    tagName: 'audio',
    sources: (audioFile, _, {
      hasBrokenOggSupport
    }) => [!hasBrokenOggSupport && {
      type: 'audio/ogg',
      src: `${audioFile.urls.ogg}?u=1`
    }, {
      type: 'audio/mp4',
      src: `${audioFile.urls.m4a}?u=1`
    }, {
      type: 'audio/mp3',
      src: `${audioFile.urls.mp3}?u=1`
    }].filter(Boolean),
    emulateTextTracksDisplay: true
  });

  function ensureProtocol(protocol, url) {
    if (url && url.match(/^\/\//)) {
      return `${protocol}:${url}`;
    }
    return url;
  }

  function formatTimeDuration(durationInMs) {
    const seconds = Math.round(durationInMs / 1000) % 60;
    const minutes = Math.floor(durationInMs / 1000 / 60) % 60;
    const hours = Math.floor(durationInMs / 1000 / 60 / 60);
    let result = 'PT';
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (minutes > 0) {
      result += `${minutes}M`;
    }
    if (seconds > 0 || minutes == 0 && hours == 0) {
      result += `${seconds}S`;
    }
    return result;
  }

  function StructuredData({
    data,
    isEnabled
  }) {
    if (isEnabled) {
      return /*#__PURE__*/React.createElement("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify(data)
        }
      });
    } else {
      return null;
    }
  }
  var StructuredData$1 = connect(combine$1({
    isEnabled: isFeatureEnabled('structured_data')
  }))(StructuredData);

  function VideoStructuredData({
    file,
    entryPublishedAt
  }) {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'AudioObject',
      name: file.basename,
      description: file.alt,
      url: ensureProtocol('https', file.urls.mp3),
      duration: formatTimeDuration(file.durationInMs),
      datePublished: entryPublishedAt,
      uploadDate: file.createdAt,
      copyrightHolder: {
        '@type': 'Organization',
        name: file.rights
      }
    };
    return /*#__PURE__*/React.createElement(StructuredData$1, {
      data: data
    });
  }
  var AudioStructuredData = connect(combine$1({
    entryPublishedAt: entryAttribute('publishedAt')
  }))(VideoStructuredData);

  function PageAudioFilePlayer(props) {
    return /*#__PURE__*/React.createElement(PageFilePlayer$1, Object.assign({}, props, {
      playerComponent: AudioFilePlayer,
      structuredDataComponent: AudioStructuredData
    }));
  }

  function getDimensions (videoFile, fit, position, wrapperDimensions) {
    if (!wrapperDimensions || !wrapperDimensions.height || !fit || fit == 'contain') {
      return;
    }
    let videoWidth, videoHeight, factor;
    const videoRatio = videoFile.width / videoFile.height;
    const wrapperRatio = wrapperDimensions.width / wrapperDimensions.height;
    const scaleToFit = wrapperRatio > videoRatio ? 'width' : 'height';
    if (scaleToFit == 'width') {
      videoHeight = wrapperDimensions.height;
      videoWidth = videoHeight * videoRatio;
      factor = wrapperDimensions.width / videoWidth;
    } else {
      videoWidth = wrapperDimensions.width;
      videoHeight = videoWidth / videoRatio;
      factor = wrapperDimensions.height / videoHeight;
    }
    if (fit == 'smart_contain' && factor > 1.2) {
      return;
    }
    const width = videoWidth * factor;
    const height = videoHeight * factor;
    const positionX = position[0] !== undefined && fit == 'cover' ? position[0] : 50;
    const positionY = position[1] !== undefined && fit == 'cover' ? position[1] : 50;
    return {
      left: (wrapperDimensions.width - width) * positionX / 100,
      top: (wrapperDimensions.height - height) * positionY / 100,
      width,
      height
    };
  }

  function cueOffsetClassName(dimensions, wrapperDimensions) {
    if (!dimensions || !wrapperDimensions) {
      return;
    }
    const clippedSizeLeft = Math.max(0, -dimensions.left);
    const clippedSizeRight = Math.max(0, dimensions.width - wrapperDimensions.width + dimensions.left);
    const clippedSizeTop = Math.max(0, -dimensions.top);
    const clippedSizeBottom = Math.max(0, dimensions.height - wrapperDimensions.height + dimensions.top);
    return ['cue_offset', `cue_offset_${Math.ceil(clippedSizeBottom / 10)}`, `cue_margin_left_${Math.ceil(clippedSizeLeft / 10)}`, `cue_margin_right_${Math.ceil(clippedSizeRight / 10)}`, `cue_margin_top_${Math.ceil(clippedSizeTop / 10)}`, `cue_margin_bottom_${Math.ceil(clippedSizeBottom / 10)}`].join(' ');
  }

  function Positioner(props) {
    return /*#__PURE__*/React$1__default.createElement(Measure, {
      whitelist: ['width', 'height'],
      cloneOptions: {
        noCloneOnZeroDimension: true
      }
    }, wrapperDimensions => renderWrapper(props, wrapperDimensions));
  }
  function renderWrapper(props, wrapperDimensions) {
    const dimensions = getDimensions(props.videoFile, props.fit, props.position, wrapperDimensions);
    return /*#__PURE__*/React$1__default.createElement("div", {
      className: "uncropped_media_wrapper"
    }, /*#__PURE__*/React$1__default.createElement("div", {
      className: cueOffsetClassName(dimensions, wrapperDimensions),
      style: style$1(dimensions)
    }, props.children));
  }
  function style$1(dimensions) {
    return dimensions && {
      position: 'absolute',
      ...dimensions
    };
  }

  function sources (videoFile, quality, {
    hasHighBandwidth,
    forceBestQuality,
    forceFullhdQuality
  } = {}) {
    quality = quality || 'auto';
    if (forceBestQuality) {
      return [{
        type: 'video/mp4',
        src: videoFile.urls['4k'] || videoFile.urls.fullhd || videoFile.urls.high
      }];
    }
    if (forceFullhdQuality) {
      return [{
        type: 'video/mp4',
        src: videoFile.urls.fullhd || videoFile.urls.high
      }];
    } else if (quality == 'auto') {
      let fallbackQuality = hasHighBandwidth ? 'high' : 'medium';
      let result = [{
        type: 'application/x-mpegURL',
        src: `${videoFile.urls['hls-playlist']}?u=1`
      }, {
        type: 'video/mp4',
        src: `${videoFile.urls[fallbackQuality]}?u=1`
      }];
      if (videoFile.urls['dash-playlist']) {
        result = [{
          type: 'application/dash+xml',
          src: `${videoFile.urls['dash-playlist']}`
        }].concat(result);
      }
      return result;
    } else {
      if (!videoFile.urls[quality]) {
        quality = 'high';
      }
      return [{
        type: 'video/mp4',
        src: `${videoFile.urls[quality]}?u=1`
      }];
    }
  }

  const FilePlayer = createFilePlayer({
    tagName: 'video',
    sources,
    poster
  });
  function VideoFilePlayer(props) {
    return /*#__PURE__*/React$1__default.createElement(Positioner, {
      videoFile: props.file,
      fit: props.fit,
      position: props.position
    }, /*#__PURE__*/React$1__default.createElement(FilePlayer, {
      file: props.file,
      posterImageFile: props.posterImageFile,
      playerState: props.playerState,
      playerActions: props.playerActions,
      atmoDuringPlayback: props.atmoDuringPlayback,
      defaultTextTrackFileId: props.defaultTextTrackFileId,
      textTracksEnabled: props.textTracksEnabled,
      loop: props.loop,
      muted: props.muted,
      playsInline: props.playsInline
    }));
  }
  class VideoFilePlayerPreload extends React$1__default.Component {
    componentDidMount() {
      const {
        file,
        posterImageFile,
        preloadImage
      } = this.props;
      const posterUrl = poster(file, posterImageFile);
      if (posterUrl) {
        preloadImage(posterUrl);
      }
    }
    render() {
      return null;
    }
  }
  VideoFilePlayerPreload.defaultProps = {
    preloadImage
  };
  function poster(videoFile, posterImageFile) {
    const style = has$2('mobile platform') ? 'medium' : 'large';
    return posterImageFile ? posterImageFile.urls[style] : videoFile.urls[`poster_${style}`];
  }

  function VideoStructuredData$1({
    file,
    entryPublishedAt
  }) {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'VideoObject',
      name: file.basename,
      description: file.alt,
      url: ensureProtocol('https', file.urls.high),
      thumbnailUrl: ensureProtocol('https', file.urls.poster_medium),
      width: file.width,
      height: file.height,
      duration: formatTimeDuration(file.durationInMs),
      datePublished: entryPublishedAt,
      uploadDate: file.createdAt,
      copyrightHolder: {
        '@type': 'Organization',
        name: file.rights
      }
    };
    return /*#__PURE__*/React.createElement(StructuredData$1, {
      data: data
    });
  }
  var VideoStructuredData$2 = connect(combine$1({
    entryPublishedAt: entryAttribute('publishedAt')
  }))(VideoStructuredData$1);

  function PageVideoFilePlayer(props) {
    return /*#__PURE__*/React.createElement(PageFilePlayer$1, Object.assign({}, props, {
      playerComponent: VideoFilePlayer,
      preloadComponent: VideoFilePlayerPreload,
      structuredDataComponent: VideoStructuredData$2
    }));
  }
  const VideoPlayer = connect(combine$1({
    file: file('videoFiles', {
      id: prop('videoFileId')
    }),
    posterImageFile: file('imageFiles', {
      id: prop('posterImageFileId')
    }),
    muted: muted$1
  }))(PageVideoFilePlayer);
  function muted$1(state, props) {
    return props.muted || muted(state);
  }
  function PageVideoPlayer(props) {
    const page = props.page;
    const videoProperty = camelize.concat(props.propertyNamePrefix, props.videoPropertyBaseName);
    const posterProperty = camelize.concat(props.propertyNamePrefix, props.posterImagePropertyBaseName);
    return /*#__PURE__*/React.createElement(VideoPlayer, {
      videoFileId: page[`${videoProperty}Id`],
      posterImageFileId: page[`${posterProperty}Id`],
      playerState: props.playerState,
      playerActions: props.playerActions,
      fit: props.fit,
      position: [page[`${videoProperty}X`], page[`${videoProperty}Y`]],
      textTracksEnabled: props.textTracksEnabled,
      loop: props.loop,
      muted: props.muted,
      playsInline: props.playsInline
    });
  }
  PageVideoPlayer.defaultProps = {
    videoPropertyBaseName: 'videoFile',
    posterImagePropertyBaseName: 'posterImage',
    fit: 'smart_contain'
  };

  class PlayerMediaContextProvider extends React$1__default.Component {
    getChildContext() {
      return {
        mediaContext: {
          ...this.context.mediaContext,
          playbackMode: this.props.playbackMode,
          playerDescription: this.props.playerDescription
        }
      };
    }
    render() {
      return this.props.children;
    }
  }
  PlayerMediaContextProvider.contextTypes = {
    mediaContext: React$1__default.PropTypes.object
  };
  PlayerMediaContextProvider.childContextTypes = {
    mediaContext: React$1__default.PropTypes.object
  };

  function MobilePageVideoPoster(props) {
    const candidate = findCandidate(props);
    if (candidate) {
      return /*#__PURE__*/React.createElement(PageBackgroundImage, {
        page: props.page,
        propertyBaseName: candidate.propertyBaseName,
        fileCollection: candidate.collection
      });
    } else {
      return /*#__PURE__*/React.createElement("noscript", null);
    }
  }
  function findCandidate(props) {
    return candidates(props.propertyNamePrefix).find(candidate => props.fileExists(candidate.collection, props.page[`${candidate.propertyBaseName}Id`]));
  }
  function candidates(prefix) {
    return [{
      propertyBaseName: camelize.concat(prefix, 'mobilePosterImage'),
      collection: 'imageFiles'
    }, {
      propertyBaseName: camelize.concat(prefix, 'posterImage'),
      collection: 'imageFiles'
    }, {
      propertyBaseName: camelize.concat(prefix, 'videoFile'),
      collection: 'videoFiles'
    }];
  }
  var MobilePageVideoPoster$1 = connect(combine$1({
    fileExists: fileExists()
  }))(MobilePageVideoPoster);

  function PageBackgroundVideo(props) {
    if (props.hasMobilePlatform && mobilePosterExists(props)) {
      return /*#__PURE__*/React.createElement(MobilePageVideoPoster$1, {
        page: props.page,
        propertyNamePrefix: props.propertyNamePrefix
      });
    } else {
      return /*#__PURE__*/React.createElement(PlayerMediaContextProvider, {
        playbackMode: "loop",
        playerDescription: "Background Video Player"
      }, /*#__PURE__*/React.createElement(PageVideoPlayer, Object.assign({
        loop: true,
        fit: "cover",
        muted: !props.hasAutoplaySupport,
        playsInline: true,
        textTracksEnabled: false
      }, props)));
    }
  }
  function mobilePosterExists(props) {
    const property = camelize.concat(props.propertyNamePrefix, 'mobilePosterImageId');
    return props.fileExists('imageFiles', props.page[property]);
  }
  var PageBackgroundVideo$1 = connect(combine$1({
    fileExists: fileExists(),
    hasMobilePlatform: has$3('mobile platform'),
    hasAutoplaySupport: has$3('autoplay support')
  }))(PageBackgroundVideo);

  function ImageStructuredData({
    file,
    entryPublishedAt
  }) {
    if (file) {
      const data = {
        '@context': 'http://schema.org',
        '@type': 'ImageObject',
        name: file.basename,
        description: file.alt,
        url: ensureProtocol('https', file.urls.large),
        width: file.width,
        height: file.height,
        datePublished: entryPublishedAt,
        uploadDate: file.createdAt,
        copyrightHolder: {
          '@type': 'Organization',
          name: file.rights
        }
      };
      return /*#__PURE__*/React.createElement(StructuredData$1, {
        data: data
      });
    } else {
      return null;
    }
  }
  var ImageStructuredData$1 = connect(combine$1({
    file: file('imageFiles', {
      id: prop('fileId')
    }),
    entryPublishedAt: entryAttribute('publishedAt')
  }))(ImageStructuredData);

  function PageBackgroundAsset({
    page,
    playerState,
    playerActions,
    propertyNamePrefix
  }) {
    const typePropertyName = camelize.concat(propertyNamePrefix, 'backgroundType');
    if (page[typePropertyName] == 'video') {
      return /*#__PURE__*/React.createElement(PageBackgroundVideo$1, {
        page: page,
        playerState: playerState,
        playerActions: playerActions,
        propertyNamePrefix: propertyNamePrefix
      });
    } else {
      return /*#__PURE__*/React.createElement(PageBackgroundImage, {
        page: page,
        propertyNamePrefix: propertyNamePrefix,
        structuredDataComponent: ImageStructuredData$1
      });
    }
  }
  var PageBackgroundAsset$1 = connectInPage(combine$1({
    page: pageAttributes(),
    playerState: playerState({
      scope: 'background'
    })
  }), combine({
    playerActions: playerActions({
      scope: 'background'
    })
  }))(PageBackgroundAsset);

  function MediaPageBackground(props) {
    return /*#__PURE__*/React.createElement(PageBackground, null, /*#__PURE__*/React.createElement(PageBackgroundAsset$1, {
      propertyNamePrefix: props.propertyNamePrefix
    }), /*#__PURE__*/React.createElement(PageShadow, {
      page: props.page
    }));
  }

  function InfoBox$1(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "waveform_player_controls-info_box"
    }, renderTitle(props), renderDescription(props));
  }
  function renderTitle(props) {
    if (!isBlank(props.title)) {
      return /*#__PURE__*/React.createElement("h3", {
        className: titleClassName(props)
      }, props.title);
    }
  }
  function titleClassName(props) {
    const titleAndDescriptionPresent = !isBlank(props.title) && !isBlank(props.description);
    return classnames('waveform_player_controls-info_box-title', {
      'waveform_player_controls-info_box-title-with_separator': titleAndDescriptionPresent
    });
  }
  function renderDescription(props) {
    if (!isBlank(props.description)) {
      return /*#__PURE__*/React.createElement("p", {
        className: "waveform_player_controls-info_box-description",
        dangerouslySetInnerHTML: {
          __html: props.description
        }
      });
    }
  }

  const SET_BOTTOM = 'MEDIA_PAGE_SCROLLER_MARGIN_SET_BOTTOM';
  function setPageScrollerMarginBottom(value) {
    return {
      type: SET_BOTTOM,
      payload: {
        value
      },
      meta: {
        collectionName: 'pages'
      }
    };
  }

  function Container$2(props) {
    return /*#__PURE__*/React.createElement(Measure, {
      whitelist: ['height'],
      onMeasure: ({
        height
      }) => props.setPageScrollerMarginBottom(height)
    }, /*#__PURE__*/React.createElement("div", {
      className: "waveform_player_controls-container"
    }, props.children));
  }
  var Container$3 = connectInPage(null, {
    setPageScrollerMarginBottom
  })(Container$2);

  function PlayButton$2(props) {
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: className$8(props),
      id: props.id,
      tabIndex: "4",
      title: props.title,
      onClick: clickHandler$1(props)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: props.isPlaying ? 'pause' : 'play'
    }));
  }
  var PlayButton$3 = pageSkipLinkTarget(PlayButton$2);
  function className$8(props) {
    return classnames('waveform_player_controls-play_button', {
      'waveform_player_controls-play_button-inverted': props.inverted
    });
  }
  function clickHandler$1(props) {
    return event => {
      event.preventDefault();
      if (props.onClick) {
        props.onClick();
      }
    };
  }

  function mainColor(state) {
    return state.theme.mainColor;
  }

  var wavesurfer_min = createCommonjsModule(function (module) {
  /*! wavesurfer.js 1.4.0 (Thu, 22 Jun 2017 13:03:29 GMT)
  * https://github.com/katspaugh/wavesurfer.js
  * @license BSD-3-Clause */
  !function (t, e) {
      module.exports ? module.exports = e() : t.WaveSurfer = e();
  }(commonjsGlobal, function () {

    var t = {
      defaultParams: {
        audioContext: null,
        audioRate: 1,
        autoCenter: !0,
        backend: "WebAudio",
        barHeight: 1,
        closeAudioContext: !1,
        container: null,
        cursorColor: "#333",
        cursorWidth: 1,
        dragSelection: !0,
        fallbackProgressHeight: 4,
        fillParent: !0,
        forceDecode: !1,
        height: 128,
        hideScrollbar: !1,
        interact: !0,
        loopSelection: !0,
        mediaContainer: null,
        mediaControls: !1,
        mediaType: "audio",
        minPxPerSec: 20,
        partialRender: !1,
        pixelRatio: window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
        progressColor: "#555",
        normalize: !1,
        removeMediaElementOnDestroy: !0,
        renderer: "MultiCanvas",
        scrollParent: !1,
        skipLength: 2,
        splitChannels: !1,
        waveColor: "#999"
      },
      init: function (e) {
        if (this.params = t.util.extend({}, this.defaultParams, e), this.container = "string" == typeof e.container ? document.querySelector(this.params.container) : this.params.container, !this.container) throw new Error("Container element not found");
        if (null == this.params.mediaContainer ? this.mediaContainer = this.container : "string" == typeof this.params.mediaContainer ? this.mediaContainer = document.querySelector(this.params.mediaContainer) : this.mediaContainer = this.params.mediaContainer, !this.mediaContainer) throw new Error("Media Container element not found");
        this.savedVolume = 0, this.isMuted = !1, this.tmpEvents = [], this.currentAjax = null, this.createDrawer(), this.createBackend(), this.createPeakCache(), this.isDestroyed = !1;
      },
      createDrawer: function () {
        var e = this;
        this.drawer = Object.create(t.Drawer[this.params.renderer]), this.drawer.init(this.container, this.params), this.drawer.on("click", function (t, i) {
          setTimeout(function () {
            e.seekTo(i);
          }, 0);
        }), this.drawer.on("scroll", function (t) {
          e.params.partialRender && e.drawBuffer(), e.fireEvent("scroll", t);
        });
      },
      createBackend: function () {
        var e = this;
        this.backend && this.backend.destroy(), "AudioElement" == this.params.backend && (this.params.backend = "MediaElement"), "WebAudio" != this.params.backend || t.WebAudio.supportsWebAudio() || (this.params.backend = "MediaElement"), this.backend = Object.create(t[this.params.backend]), this.backend.init(this.params), this.backend.on("finish", function () {
          e.fireEvent("finish");
        }), this.backend.on("play", function () {
          e.fireEvent("play");
        }), this.backend.on("pause", function () {
          e.fireEvent("pause");
        }), this.backend.on("audioprocess", function (t) {
          e.drawer.progress(e.backend.getPlayedPercents()), e.fireEvent("audioprocess", t);
        });
      },
      createPeakCache: function () {
        this.params.partialRender && (this.peakCache = Object.create(t.PeakCache), this.peakCache.init());
      },
      getDuration: function () {
        return this.backend.getDuration();
      },
      play: function (t, e) {
        this.fireEvent("interaction", this.play.bind(this, t, e)), this.backend.play(t, e);
      },
      pause: function () {
        this.backend.isPaused() || this.backend.pause();
      },
      playPause: function () {
        this.backend.isPaused() ? this.play() : this.pause();
      },
      isPlaying: function () {
        return !this.backend.isPaused();
      },
      skipBackward: function (t) {
        this.skip(-t || -this.params.skipLength);
      },
      skipForward: function (t) {
        this.skip(t || this.params.skipLength);
      },
      skip: function (t) {
        var e = this.getCurrentTime() || 0,
          i = this.getDuration() || 1;
        e = Math.max(0, Math.min(i, e + (t || 0))), this.seekAndCenter(e / i);
      },
      seekAndCenter: function (t) {
        this.seekTo(t), this.drawer.recenter(t);
      },
      seekTo: function (t) {
        this.fireEvent("interaction", this.seekTo.bind(this, t));
        var e = this.backend.isPaused();
        e || this.backend.pause();
        var i = this.params.scrollParent;
        this.params.scrollParent = !1, this.backend.seekTo(t * this.getDuration()), this.drawer.progress(this.backend.getPlayedPercents()), e || this.backend.play(), this.params.scrollParent = i, this.fireEvent("seek", t);
      },
      stop: function () {
        this.pause(), this.seekTo(0), this.drawer.progress(0);
      },
      setVolume: function (t) {
        this.backend.setVolume(t);
      },
      getVolume: function () {
        return this.backend.getVolume();
      },
      getCurrentTime: function () {
        return this.backend.getCurrentTime();
      },
      setCurrentTime: function (t) {
        this.getDuration() >= t ? this.seekTo(1) : this.seekTo(t / this.getDuration());
      },
      setPlaybackRate: function (t) {
        this.backend.setPlaybackRate(t);
      },
      getPlaybackRate: function () {
        return this.backend.getPlaybackRate();
      },
      toggleMute: function () {
        this.setMute(!this.isMuted);
      },
      setMute: function (t) {
        t !== this.isMuted && (t ? (this.savedVolume = this.backend.getVolume(), this.backend.setVolume(0), this.isMuted = !0) : (this.backend.setVolume(this.savedVolume), this.isMuted = !1));
      },
      getMute: function () {
        return this.isMuted;
      },
      getFilters: function () {
        return this.backend.filters || [];
      },
      toggleScroll: function () {
        this.params.scrollParent = !this.params.scrollParent, this.drawBuffer();
      },
      toggleInteraction: function () {
        this.params.interact = !this.params.interact;
      },
      getWaveColor: function () {
        return this.params.waveColor;
      },
      setWaveColor: function (t) {
        this.params.waveColor = t, this.drawBuffer();
      },
      getProgressColor: function () {
        return this.params.progressColor;
      },
      setProgressColor: function (t) {
        this.params.progressColor = t, this.drawBuffer();
      },
      getCursorColor: function () {
        return this.params.cursorColor;
      },
      setCursorColor: function (t) {
        this.params.cursorColor = t, this.drawer.updateCursor();
      },
      getHeight: function () {
        return this.params.height;
      },
      setHeight: function (t) {
        this.params.height = t, this.drawer.setHeight(t * this.params.pixelRatio);
      },
      drawBuffer: function () {
        var t = Math.round(this.getDuration() * this.params.minPxPerSec * this.params.pixelRatio),
          e = this.drawer.getWidth(),
          i = t,
          s = this.drawer.getScrollX(),
          a = Math.min(s + e, i);
        if (this.params.fillParent && (!this.params.scrollParent || t < e) && (s = 0, a = i = e), this.params.partialRender) for (var r = this.peakCache.addRangeToPeakCache(i, s, a), n = 0; n < r.length; n++) {
          o = this.backend.getPeaks(i, r[n][0], r[n][1]);
          this.drawer.drawPeaks(o, i, r[n][0], r[n][1]);
        } else {
          s = 0, a = i;
          var o = this.backend.getPeaks(i, s, a);
          this.drawer.drawPeaks(o, i, s, a);
        }
        this.fireEvent("redraw", o, i);
      },
      zoom: function (t) {
        this.params.minPxPerSec = t, this.params.scrollParent = !0, this.refresh(), this.drawer.recenter(this.getCurrentTime() / this.getDuration()), this.fireEvent("zoom", t);
      },
      refresh: function () {
        this.drawBuffer(), this.drawer.progress(this.backend.getPlayedPercents());
      },
      loadArrayBuffer: function (t) {
        this.decodeArrayBuffer(t, function (t) {
          this.isDestroyed || this.loadDecodedBuffer(t);
        }.bind(this));
      },
      loadDecodedBuffer: function (t) {
        this.backend.load(t), this.drawBuffer(), this.fireEvent("ready");
      },
      loadBlob: function (t) {
        var e = this,
          i = new FileReader();
        i.addEventListener("progress", function (t) {
          e.onProgress(t);
        }), i.addEventListener("load", function (t) {
          e.loadArrayBuffer(t.target.result);
        }), i.addEventListener("error", function () {
          e.fireEvent("error", "Error reading file");
        }), i.readAsArrayBuffer(t), this.empty();
      },
      load: function (t, e, i) {
        switch (this.empty(), this.isMuted = !1, this.params.backend) {
          case "WebAudio":
            return this.loadBuffer(t, e);
          case "MediaElement":
            return this.loadMediaElement(t, e, i);
        }
      },
      loadBuffer: function (t, e) {
        var i = function (e) {
          return e && this.tmpEvents.push(this.once("ready", e)), this.getArrayBuffer(t, this.loadArrayBuffer.bind(this));
        }.bind(this);
        if (!e) return i();
        this.backend.setPeaks(e), this.drawBuffer(), this.tmpEvents.push(this.once("interaction", i));
      },
      loadMediaElement: function (t, e, i) {
        var s = t;
        if ("string" == typeof t) this.backend.load(s, this.mediaContainer, e, i);else {
          var a = t;
          this.backend.loadElt(a, e), s = a.src;
        }
        this.tmpEvents.push(this.backend.once("canplay", function () {
          this.drawBuffer(), this.fireEvent("ready");
        }.bind(this)), this.backend.once("error", function (t) {
          this.fireEvent("error", t);
        }.bind(this))), e && this.backend.setPeaks(e), e && !this.params.forceDecode || !this.backend.supportsWebAudio() || this.getArrayBuffer(s, function (t) {
          this.decodeArrayBuffer(t, function (t) {
            this.backend.buffer = t, this.backend.setPeaks(null), this.drawBuffer(), this.fireEvent("waveform-ready");
          }.bind(this));
        }.bind(this));
      },
      decodeArrayBuffer: function (t, e) {
        this.arraybuffer = t, this.backend.decodeArrayBuffer(t, function (i) {
          this.isDestroyed || this.arraybuffer != t || (e(i), this.arraybuffer = null);
        }.bind(this), this.fireEvent.bind(this, "error", "Error decoding audiobuffer"));
      },
      getArrayBuffer: function (e, i) {
        var s = this,
          a = t.util.ajax({
            url: e,
            responseType: "arraybuffer"
          });
        return this.currentAjax = a, this.tmpEvents.push(a.on("progress", function (t) {
          s.onProgress(t);
        }), a.on("success", function (t, e) {
          i(t), s.currentAjax = null;
        }), a.on("error", function (t) {
          s.fireEvent("error", "XHR error: " + t.target.statusText), s.currentAjax = null;
        })), a;
      },
      onProgress: function (t) {
        if (t.lengthComputable) var e = t.loaded / t.total;else e = t.loaded / (t.loaded + 1e6);
        this.fireEvent("loading", Math.round(100 * e), t.target);
      },
      exportPCM: function (t, e, i, s) {
        t = t || 1024, s = s || 0, e = e || 1e4, i = i || !1;
        var a = this.backend.getPeaks(t, s),
          r = [].map.call(a, function (t) {
            return Math.round(t * e) / e;
          }),
          n = JSON.stringify(r);
        return i || window.open("data:application/json;charset=utf-8," + encodeURIComponent(n)), n;
      },
      exportImage: function (t, e) {
        return t || (t = "image/png"), e || (e = 1), this.drawer.getImage(t, e);
      },
      cancelAjax: function () {
        this.currentAjax && (this.currentAjax.xhr.abort(), this.currentAjax = null);
      },
      clearTmpEvents: function () {
        this.tmpEvents.forEach(function (t) {
          t.un();
        });
      },
      empty: function () {
        this.backend.isPaused() || (this.stop(), this.backend.disconnectSource()), this.cancelAjax(), this.clearTmpEvents(), this.drawer.progress(0), this.drawer.setWidth(0), this.drawer.drawPeaks({
          length: this.drawer.getWidth()
        }, 0);
      },
      destroy: function () {
        this.fireEvent("destroy"), this.cancelAjax(), this.clearTmpEvents(), this.unAll(), this.backend.destroy(), this.drawer.destroy(), this.isDestroyed = !0;
      }
    };
    return t.create = function (e) {
      var i = Object.create(t);
      return i.init(e), i;
    }, t.util = {
      requestAnimationFrame: (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t, e) {
        setTimeout(t, 1e3 / 60);
      }).bind(window),
      frame: function (e) {
        return function () {
          var i = this,
            s = arguments;
          t.util.requestAnimationFrame(function () {
            e.apply(i, s);
          });
        };
      },
      extend: function (t) {
        return Array.prototype.slice.call(arguments, 1).forEach(function (e) {
          Object.keys(e).forEach(function (i) {
            t[i] = e[i];
          });
        }), t;
      },
      debounce: function (t, e, i) {
        var s,
          a,
          r,
          n = function () {
            r = null, i || t.apply(a, s);
          };
        return function () {
          a = this, s = arguments;
          var o = i && !r;
          clearTimeout(r), (r = setTimeout(n, e)) || (r = setTimeout(n, e)), o && t.apply(a, s);
        };
      },
      min: function (t) {
        var e = 1 / 0;
        for (var i in t) t[i] < e && (e = t[i]);
        return e;
      },
      max: function (t) {
        var e = -1 / 0;
        for (var i in t) t[i] > e && (e = t[i]);
        return e;
      },
      getId: function () {
        return "wavesurfer_" + Math.random().toString(32).substring(2);
      },
      ajax: function (e) {
        var i = Object.create(t.Observer),
          s = new XMLHttpRequest(),
          a = !1;
        return s.open(e.method || "GET", e.url, !0), s.responseType = e.responseType || "json", s.addEventListener("progress", function (t) {
          i.fireEvent("progress", t), t.lengthComputable && t.loaded == t.total && (a = !0);
        }), s.addEventListener("load", function (t) {
          a || i.fireEvent("progress", t), i.fireEvent("load", t), 200 == s.status || 206 == s.status ? i.fireEvent("success", s.response, t) : i.fireEvent("error", t);
        }), s.addEventListener("error", function (t) {
          i.fireEvent("error", t);
        }), s.send(), i.xhr = s, i;
      }
    }, t.Observer = {
      on: function (t, e) {
        this.handlers || (this.handlers = {});
        var i = this.handlers[t];
        return i || (i = this.handlers[t] = []), i.push(e), {
          name: t,
          callback: e,
          un: this.un.bind(this, t, e)
        };
      },
      un: function (t, e) {
        if (this.handlers) {
          var i = this.handlers[t];
          if (i) if (e) for (var s = i.length - 1; s >= 0; s--) i[s] == e && i.splice(s, 1);else i.length = 0;
        }
      },
      unAll: function () {
        this.handlers = null;
      },
      once: function (t, e) {
        var i = this,
          s = function () {
            e.apply(this, arguments), setTimeout(function () {
              i.un(t, s);
            }, 0);
          };
        return this.on(t, s);
      },
      fireEvent: function (t) {
        if (this.handlers) {
          var e = this.handlers[t],
            i = Array.prototype.slice.call(arguments, 1);
          e && e.forEach(function (t) {
            t.apply(null, i);
          });
        }
      }
    }, t.util.extend(t, t.Observer), t.WebAudio = {
      scriptBufferSize: 256,
      PLAYING_STATE: 0,
      PAUSED_STATE: 1,
      FINISHED_STATE: 2,
      supportsWebAudio: function () {
        return !(!window.AudioContext && !window.webkitAudioContext);
      },
      getAudioContext: function () {
        return t.WebAudio.audioContext || (t.WebAudio.audioContext = new (window.AudioContext || window.webkitAudioContext)()), t.WebAudio.audioContext;
      },
      getOfflineAudioContext: function (e) {
        return t.WebAudio.offlineAudioContext || (t.WebAudio.offlineAudioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, e)), t.WebAudio.offlineAudioContext;
      },
      init: function (e) {
        this.params = e, this.ac = e.audioContext || this.getAudioContext(), this.lastPlay = this.ac.currentTime, this.startPosition = 0, this.scheduledPause = null, this.states = [Object.create(t.WebAudio.state.playing), Object.create(t.WebAudio.state.paused), Object.create(t.WebAudio.state.finished)], this.createVolumeNode(), this.createScriptNode(), this.createAnalyserNode(), this.setState(this.PAUSED_STATE), this.setPlaybackRate(this.params.audioRate), this.setLength(0);
      },
      disconnectFilters: function () {
        this.filters && (this.filters.forEach(function (t) {
          t && t.disconnect();
        }), this.filters = null, this.analyser.connect(this.gainNode));
      },
      setState: function (t) {
        this.state !== this.states[t] && (this.state = this.states[t], this.state.init.call(this));
      },
      setFilter: function () {
        this.setFilters([].slice.call(arguments));
      },
      setFilters: function (t) {
        this.disconnectFilters(), t && t.length && (this.filters = t, this.analyser.disconnect(), t.reduce(function (t, e) {
          return t.connect(e), e;
        }, this.analyser).connect(this.gainNode));
      },
      createScriptNode: function () {
        this.ac.createScriptProcessor ? this.scriptNode = this.ac.createScriptProcessor(this.scriptBufferSize) : this.scriptNode = this.ac.createJavaScriptNode(this.scriptBufferSize), this.scriptNode.connect(this.ac.destination);
      },
      addOnAudioProcess: function () {
        var t = this;
        this.scriptNode.onaudioprocess = function () {
          var e = t.getCurrentTime();
          e >= t.getDuration() ? (t.setState(t.FINISHED_STATE), t.fireEvent("pause")) : e >= t.scheduledPause ? t.pause() : t.state === t.states[t.PLAYING_STATE] && t.fireEvent("audioprocess", e);
        };
      },
      removeOnAudioProcess: function () {
        this.scriptNode.onaudioprocess = null;
      },
      createAnalyserNode: function () {
        this.analyser = this.ac.createAnalyser(), this.analyser.connect(this.gainNode);
      },
      createVolumeNode: function () {
        this.ac.createGain ? this.gainNode = this.ac.createGain() : this.gainNode = this.ac.createGainNode(), this.gainNode.connect(this.ac.destination);
      },
      setVolume: function (t) {
        this.gainNode.gain.value = t;
      },
      getVolume: function () {
        return this.gainNode.gain.value;
      },
      decodeArrayBuffer: function (t, e, i) {
        this.offlineAc || (this.offlineAc = this.getOfflineAudioContext(this.ac ? this.ac.sampleRate : 44100)), this.offlineAc.decodeAudioData(t, function (t) {
          e(t);
        }.bind(this), i);
      },
      setPeaks: function (t) {
        this.peaks = t;
      },
      setLength: function (t) {
        if (!this.mergedPeaks || t != 2 * this.mergedPeaks.length - 1 + 2) {
          this.splitPeaks = [], this.mergedPeaks = [];
          for (var e = this.buffer ? this.buffer.numberOfChannels : 1, i = 0; i < e; i++) this.splitPeaks[i] = [], this.splitPeaks[i][2 * (t - 1)] = 0, this.splitPeaks[i][2 * (t - 1) + 1] = 0;
          this.mergedPeaks[2 * (t - 1)] = 0, this.mergedPeaks[2 * (t - 1) + 1] = 0;
        }
      },
      getPeaks: function (t, e, i) {
        if (this.peaks) return this.peaks;
        e = e || 0, i = i || t - 1, this.setLength(t);
        for (var s = this.buffer.length / t, a = ~~(s / 10) || 1, r = this.buffer.numberOfChannels, n = 0; n < r; n++) for (var o = this.splitPeaks[n], h = this.buffer.getChannelData(n), l = e; l <= i; l++) {
          for (var c = ~~(l * s), u = ~~(c + s), d = 0, p = 0, f = c; f < u; f += a) {
            var m = h[f];
            m > p && (p = m), m < d && (d = m);
          }
          o[2 * l] = p, o[2 * l + 1] = d, (0 == n || p > this.mergedPeaks[2 * l]) && (this.mergedPeaks[2 * l] = p), (0 == n || d < this.mergedPeaks[2 * l + 1]) && (this.mergedPeaks[2 * l + 1] = d);
        }
        return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
      },
      getPlayedPercents: function () {
        return this.state.getPlayedPercents.call(this);
      },
      disconnectSource: function () {
        this.source && this.source.disconnect();
      },
      destroy: function () {
        this.isPaused() || this.pause(), this.unAll(), this.buffer = null, this.disconnectFilters(), this.disconnectSource(), this.gainNode.disconnect(), this.scriptNode.disconnect(), this.analyser.disconnect(), this.params.closeAudioContext && ("function" == typeof this.ac.close && "closed" != this.ac.state && this.ac.close(), this.ac = null, this.params.audioContext ? this.params.audioContext = null : t.WebAudio.audioContext = null, t.WebAudio.offlineAudioContext = null);
      },
      load: function (t) {
        this.startPosition = 0, this.lastPlay = this.ac.currentTime, this.buffer = t, this.createSource();
      },
      createSource: function () {
        this.disconnectSource(), this.source = this.ac.createBufferSource(), this.source.start = this.source.start || this.source.noteGrainOn, this.source.stop = this.source.stop || this.source.noteOff, this.source.playbackRate.value = this.playbackRate, this.source.buffer = this.buffer, this.source.connect(this.analyser);
      },
      isPaused: function () {
        return this.state !== this.states[this.PLAYING_STATE];
      },
      getDuration: function () {
        return this.buffer ? this.buffer.duration : 0;
      },
      seekTo: function (t, e) {
        if (this.buffer) return this.scheduledPause = null, null == t && (t = this.getCurrentTime()) >= this.getDuration() && (t = 0), null == e && (e = this.getDuration()), this.startPosition = t, this.lastPlay = this.ac.currentTime, this.state === this.states[this.FINISHED_STATE] && this.setState(this.PAUSED_STATE), {
          start: t,
          end: e
        };
      },
      getPlayedTime: function () {
        return (this.ac.currentTime - this.lastPlay) * this.playbackRate;
      },
      play: function (t, e) {
        if (this.buffer) {
          this.createSource();
          var i = this.seekTo(t, e);
          t = i.start, e = i.end, this.scheduledPause = e, this.source.start(0, t, e - t), "suspended" == this.ac.state && this.ac.resume && this.ac.resume(), this.setState(this.PLAYING_STATE), this.fireEvent("play");
        }
      },
      pause: function () {
        this.scheduledPause = null, this.startPosition += this.getPlayedTime(), this.source && this.source.stop(0), this.setState(this.PAUSED_STATE), this.fireEvent("pause");
      },
      getCurrentTime: function () {
        return this.state.getCurrentTime.call(this);
      },
      getPlaybackRate: function () {
        return this.playbackRate;
      },
      setPlaybackRate: function (t) {
        t = t || 1, this.isPaused() ? this.playbackRate = t : (this.pause(), this.playbackRate = t, this.play());
      }
    }, t.WebAudio.state = {}, t.WebAudio.state.playing = {
      init: function () {
        this.addOnAudioProcess();
      },
      getPlayedPercents: function () {
        var t = this.getDuration();
        return this.getCurrentTime() / t || 0;
      },
      getCurrentTime: function () {
        return this.startPosition + this.getPlayedTime();
      }
    }, t.WebAudio.state.paused = {
      init: function () {
        this.removeOnAudioProcess();
      },
      getPlayedPercents: function () {
        var t = this.getDuration();
        return this.getCurrentTime() / t || 0;
      },
      getCurrentTime: function () {
        return this.startPosition;
      }
    }, t.WebAudio.state.finished = {
      init: function () {
        this.removeOnAudioProcess(), this.fireEvent("finish");
      },
      getPlayedPercents: function () {
        return 1;
      },
      getCurrentTime: function () {
        return this.getDuration();
      }
    }, t.util.extend(t.WebAudio, t.Observer), t.MediaElement = Object.create(t.WebAudio), t.util.extend(t.MediaElement, {
      init: function (t) {
        this.params = t, this.media = {
          currentTime: 0,
          duration: 0,
          paused: !0,
          playbackRate: 1,
          play: function () {},
          pause: function () {}
        }, this.mediaType = t.mediaType.toLowerCase(), this.elementPosition = t.elementPosition, this.setPlaybackRate(this.params.audioRate), this.createTimer();
      },
      createTimer: function () {
        var t = this,
          e = function () {
            t.isPaused() || (t.fireEvent("audioprocess", t.getCurrentTime()), (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(e));
          };
        this.on("play", e);
      },
      load: function (t, e, i, s) {
        var a = document.createElement(this.mediaType);
        a.controls = this.params.mediaControls, a.autoplay = this.params.autoplay || !1, a.preload = null == s ? "auto" : s, a.src = t, a.style.width = "100%";
        var r = e.querySelector(this.mediaType);
        r && e.removeChild(r), e.appendChild(a), this._load(a, i);
      },
      loadElt: function (t, e) {
        var i = t;
        i.controls = this.params.mediaControls, i.autoplay = this.params.autoplay || !1, this._load(i, e);
      },
      _load: function (t, e) {
        var i = this;
        "function" == typeof t.load && t.load(), t.addEventListener("error", function () {
          i.fireEvent("error", "Error loading media element");
        }), t.addEventListener("canplay", function () {
          i.fireEvent("canplay");
        }), t.addEventListener("ended", function () {
          i.fireEvent("finish");
        }), t.addEventListener("play", function () {
          i.fireEvent("play");
        }), t.addEventListener("pause", function () {
          i.fireEvent("pause");
        }), this.media = t, this.peaks = e, this.onPlayEnd = null, this.buffer = null, this.setPlaybackRate(this.playbackRate);
      },
      isPaused: function () {
        return !this.media || this.media.paused;
      },
      getDuration: function () {
        var t = (this.buffer || this.media).duration;
        return t >= 1 / 0 && (t = this.media.seekable.end(0)), t;
      },
      getCurrentTime: function () {
        return this.media && this.media.currentTime;
      },
      getPlayedPercents: function () {
        return this.getCurrentTime() / this.getDuration() || 0;
      },
      getPlaybackRate: function () {
        return this.playbackRate || this.media.playbackRate;
      },
      setPlaybackRate: function (t) {
        this.playbackRate = t || 1, this.media.playbackRate = this.playbackRate;
      },
      seekTo: function (t) {
        null != t && (this.media.currentTime = t), this.clearPlayEnd();
      },
      play: function (t, e) {
        this.seekTo(t), this.media.play(), e && this.setPlayEnd(e);
      },
      pause: function () {
        this.media && this.media.pause(), this.clearPlayEnd();
      },
      setPlayEnd: function (t) {
        var e = this;
        this.onPlayEnd = function (i) {
          i >= t && (e.pause(), e.seekTo(t));
        }, this.on("audioprocess", this.onPlayEnd);
      },
      clearPlayEnd: function () {
        this.onPlayEnd && (this.un("audioprocess", this.onPlayEnd), this.onPlayEnd = null);
      },
      getPeaks: function (e, i, s) {
        return this.buffer ? t.WebAudio.getPeaks.call(this, e, i, s) : this.peaks || [];
      },
      getVolume: function () {
        return this.media.volume;
      },
      setVolume: function (t) {
        this.media.volume = t;
      },
      destroy: function () {
        this.pause(), this.unAll(), this.params.removeMediaElementOnDestroy && this.media && this.media.parentNode && this.media.parentNode.removeChild(this.media), this.media = null;
      }
    }), t.AudioElement = t.MediaElement, t.Drawer = {
      init: function (t, e) {
        this.container = t, this.params = e, this.width = 0, this.height = e.height * this.params.pixelRatio, this.lastPos = 0, this.initDrawer(e), this.createWrapper(), this.createElements();
      },
      createWrapper: function () {
        this.wrapper = this.container.appendChild(document.createElement("wave")), this.style(this.wrapper, {
          display: "block",
          position: "relative",
          userSelect: "none",
          webkitUserSelect: "none",
          height: this.params.height + "px"
        }), (this.params.fillParent || this.params.scrollParent) && this.style(this.wrapper, {
          width: "100%",
          overflowX: this.params.hideScrollbar ? "hidden" : "auto",
          overflowY: "hidden"
        }), this.setupWrapperEvents();
      },
      handleEvent: function (t, e) {
        !e && t.preventDefault();
        var i,
          s = t.targetTouches ? t.targetTouches[0].clientX : t.clientX,
          a = this.wrapper.getBoundingClientRect(),
          r = this.width,
          n = this.getWidth();
        return !this.params.fillParent && r < n ? (i = (s - a.left) * this.params.pixelRatio / r || 0) > 1 && (i = 1) : i = (s - a.left + this.wrapper.scrollLeft) / this.wrapper.scrollWidth || 0, i;
      },
      setupWrapperEvents: function () {
        var t = this;
        this.wrapper.addEventListener("click", function (e) {
          var i = t.wrapper.offsetHeight - t.wrapper.clientHeight;
          if (0 != i) {
            var s = t.wrapper.getBoundingClientRect();
            if (e.clientY >= s.bottom - i) return;
          }
          t.params.interact && t.fireEvent("click", e, t.handleEvent(e));
        }), this.wrapper.addEventListener("scroll", function (e) {
          t.fireEvent("scroll", e);
        });
      },
      drawPeaks: function (t, e, i, s) {
        this.setWidth(e) || this.clearWave(), this.params.barWidth ? this.drawBars(t, 0, i, s) : this.drawWave(t, 0, i, s);
      },
      style: function (t, e) {
        return Object.keys(e).forEach(function (i) {
          t.style[i] !== e[i] && (t.style[i] = e[i]);
        }), t;
      },
      resetScroll: function () {
        null !== this.wrapper && (this.wrapper.scrollLeft = 0);
      },
      recenter: function (t) {
        var e = this.wrapper.scrollWidth * t;
        this.recenterOnPosition(e, !0);
      },
      recenterOnPosition: function (t, e) {
        var i = this.wrapper.scrollLeft,
          s = ~~(this.wrapper.clientWidth / 2),
          a = t - s,
          r = a - i,
          n = this.wrapper.scrollWidth - this.wrapper.clientWidth;
        if (0 != n) {
          if (!e && -s <= r && r < s) {
            a = i + (r = Math.max(-5, Math.min(5, r)));
          }
          (a = Math.max(0, Math.min(n, a))) != i && (this.wrapper.scrollLeft = a);
        }
      },
      getScrollX: function () {
        return Math.round(this.wrapper.scrollLeft * this.params.pixelRatio);
      },
      getWidth: function () {
        return Math.round(this.container.clientWidth * this.params.pixelRatio);
      },
      setWidth: function (t) {
        return this.width != t && (this.width = t, this.params.fillParent || this.params.scrollParent ? this.style(this.wrapper, {
          width: ""
        }) : this.style(this.wrapper, {
          width: ~~(this.width / this.params.pixelRatio) + "px"
        }), this.updateSize(), !0);
      },
      setHeight: function (t) {
        return t != this.height && (this.height = t, this.style(this.wrapper, {
          height: ~~(this.height / this.params.pixelRatio) + "px"
        }), this.updateSize(), !0);
      },
      progress: function (t) {
        var e = 1 / this.params.pixelRatio,
          i = Math.round(t * this.width) * e;
        if (i < this.lastPos || i - this.lastPos >= e) {
          if (this.lastPos = i, this.params.scrollParent && this.params.autoCenter) {
            var s = ~~(this.wrapper.scrollWidth * t);
            this.recenterOnPosition(s);
          }
          this.updateProgress(i);
        }
      },
      destroy: function () {
        this.unAll(), this.wrapper && (this.wrapper.parentNode == this.container && this.container.removeChild(this.wrapper), this.wrapper = null);
      },
      initDrawer: function () {},
      createElements: function () {},
      updateCursor: function () {},
      updateSize: function () {},
      drawWave: function (t, e) {},
      clearWave: function () {},
      updateProgress: function (t) {}
    }, t.util.extend(t.Drawer, t.Observer), t.Drawer.Canvas = Object.create(t.Drawer), t.util.extend(t.Drawer.Canvas, {
      createElements: function () {
        var t = this.wrapper.appendChild(this.style(document.createElement("canvas"), {
          position: "absolute",
          zIndex: 1,
          left: 0,
          top: 0,
          bottom: 0,
          pointerEvents: "none"
        }));
        if (this.waveCc = t.getContext("2d"), this.progressWave = this.wrapper.appendChild(this.style(document.createElement("wave"), {
          position: "absolute",
          zIndex: 2,
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          width: "0",
          display: "none",
          boxSizing: "border-box",
          borderRightStyle: "solid",
          pointerEvents: "none"
        })), this.updateCursor(), this.params.waveColor != this.params.progressColor) {
          var e = this.progressWave.appendChild(document.createElement("canvas"));
          this.progressCc = e.getContext("2d");
        }
      },
      updateCursor: function () {
        this.style(this.progressWave, {
          borderRightWidth: this.params.cursorWidth + "px",
          borderRightColor: this.params.cursorColor
        });
      },
      updateSize: function () {
        var t = Math.round(this.width / this.params.pixelRatio);
        this.waveCc.canvas.width = this.width, this.waveCc.canvas.height = this.height, this.style(this.waveCc.canvas, {
          width: t + "px"
        }), this.style(this.progressWave, {
          display: "block"
        }), this.progressCc && (this.progressCc.canvas.width = this.width, this.progressCc.canvas.height = this.height, this.style(this.progressCc.canvas, {
          width: t + "px"
        })), this.clearWave();
      },
      clearWave: function () {
        this.waveCc.clearRect(0, 0, this.width, this.height), this.progressCc && this.progressCc.clearRect(0, 0, this.width, this.height);
      },
      drawBars: t.util.frame(function (e, i, s, a) {
        var r = this;
        if (e[0] instanceof Array) {
          var n = e;
          if (this.params.splitChannels) return this.setHeight(n.length * this.params.height * this.params.pixelRatio), void n.forEach(function (t, e) {
            r.drawBars(t, e, s, a);
          });
          e = n[0];
        }
        var o = 1;
        [].some.call(e, function (t) {
          return t < 0;
        }) && (o = 2);
        var h = .5 / this.params.pixelRatio,
          l = this.width,
          c = this.params.height * this.params.pixelRatio,
          u = c * i || 0,
          d = c / 2,
          p = e.length / o,
          f = this.params.barWidth * this.params.pixelRatio,
          m = Math.max(this.params.pixelRatio, ~~(f / 2)),
          v = f + m,
          g = 1 / this.params.barHeight;
        if (this.params.normalize) {
          var w = t.util.max(e),
            C = t.util.min(e);
          g = -C > w ? -C : w;
        }
        var y = p / l;
        this.waveCc.fillStyle = this.params.waveColor, this.progressCc && (this.progressCc.fillStyle = this.params.progressColor), [this.waveCc, this.progressCc].forEach(function (t) {
          if (t) for (var i = s / y; i < a / y; i += v) {
            var r = e[Math.floor(i * y * o)] || 0,
              n = Math.round(r / g * d);
            t.fillRect(i + h, d - n + u, f + h, 2 * n);
          }
        }, this);
      }),
      drawWave: t.util.frame(function (e, i, s, a) {
        var r = this;
        if (e[0] instanceof Array) {
          var n = e;
          if (this.params.splitChannels) return this.setHeight(n.length * this.params.height * this.params.pixelRatio), void n.forEach(function (t, e) {
            r.drawWave(t, e, s, a);
          });
          e = n[0];
        }
        if (![].some.call(e, function (t) {
          return t < 0;
        })) {
          for (var o = [], h = 0, l = e.length; h < l; h++) o[2 * h] = e[h], o[2 * h + 1] = -e[h];
          e = o;
        }
        var c = .5 / this.params.pixelRatio,
          u = this.params.height * this.params.pixelRatio,
          d = u * i || 0,
          p = u / 2,
          f = ~~(e.length / 2),
          m = 1;
        this.params.fillParent && this.width != f && (m = this.width / f);
        var v = 1 / this.params.barHeight;
        if (this.params.normalize) {
          var g = t.util.max(e),
            w = t.util.min(e);
          v = -w > g ? -w : g;
        }
        this.waveCc.fillStyle = this.params.waveColor, this.progressCc && (this.progressCc.fillStyle = this.params.progressColor), [this.waveCc, this.progressCc].forEach(function (t) {
          if (t) {
            t.beginPath(), t.moveTo(s * m + c, p + d);
            for (i = s; i < a; i++) {
              r = Math.round(e[2 * i] / v * p);
              t.lineTo(i * m + c, p - r + d);
            }
            for (var i = a - 1; i >= s; i--) {
              var r = Math.round(e[2 * i + 1] / v * p);
              t.lineTo(i * m + c, p - r + d);
            }
            t.closePath(), t.fill(), t.fillRect(0, p + d - c, this.width, c);
          }
        }, this);
      }),
      updateProgress: function (t) {
        this.style(this.progressWave, {
          width: t + "px"
        });
      },
      getImage: function (t, e) {
        return this.waveCc.canvas.toDataURL(t, e);
      }
    }), t.Drawer.MultiCanvas = Object.create(t.Drawer), t.util.extend(t.Drawer.MultiCanvas, {
      initDrawer: function (t) {
        if (this.maxCanvasWidth = null != t.maxCanvasWidth ? t.maxCanvasWidth : 4e3, this.maxCanvasElementWidth = Math.round(this.maxCanvasWidth / this.params.pixelRatio), this.maxCanvasWidth <= 1) throw "maxCanvasWidth must be greater than 1.";
        if (this.maxCanvasWidth % 2 == 1) throw "maxCanvasWidth must be an even number.";
        this.hasProgressCanvas = this.params.waveColor != this.params.progressColor, this.halfPixel = .5 / this.params.pixelRatio, this.canvases = [];
      },
      createElements: function () {
        this.progressWave = this.wrapper.appendChild(this.style(document.createElement("wave"), {
          position: "absolute",
          zIndex: 2,
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          width: "0",
          display: "none",
          boxSizing: "border-box",
          borderRightStyle: "solid",
          pointerEvents: "none"
        })), this.addCanvas(), this.updateCursor();
      },
      updateCursor: function () {
        this.style(this.progressWave, {
          borderRightWidth: this.params.cursorWidth + "px",
          borderRightColor: this.params.cursorColor
        });
      },
      updateSize: function () {
        for (var t = Math.round(this.width / this.params.pixelRatio), e = Math.ceil(t / this.maxCanvasElementWidth); this.canvases.length < e;) this.addCanvas();
        for (; this.canvases.length > e;) this.removeCanvas();
        this.canvases.forEach(function (t, e) {
          var i = this.maxCanvasWidth + 2 * Math.ceil(this.params.pixelRatio / 2);
          e == this.canvases.length - 1 && (i = this.width - this.maxCanvasWidth * (this.canvases.length - 1)), this.updateDimensions(t, i, this.height), this.clearWaveForEntry(t);
        }, this);
      },
      addCanvas: function () {
        var t = {},
          e = this.maxCanvasElementWidth * this.canvases.length;
        t.wave = this.wrapper.appendChild(this.style(document.createElement("canvas"), {
          position: "absolute",
          zIndex: 1,
          left: e + "px",
          top: 0,
          bottom: 0,
          height: "100%",
          pointerEvents: "none"
        })), t.waveCtx = t.wave.getContext("2d"), this.hasProgressCanvas && (t.progress = this.progressWave.appendChild(this.style(document.createElement("canvas"), {
          position: "absolute",
          left: e + "px",
          top: 0,
          bottom: 0,
          height: "100%"
        })), t.progressCtx = t.progress.getContext("2d")), this.canvases.push(t);
      },
      removeCanvas: function () {
        var t = this.canvases.pop();
        t.wave.parentElement.removeChild(t.wave), this.hasProgressCanvas && t.progress.parentElement.removeChild(t.progress);
      },
      updateDimensions: function (t, e, i) {
        var s = Math.round(e / this.params.pixelRatio),
          a = Math.round(this.width / this.params.pixelRatio);
        t.start = t.waveCtx.canvas.offsetLeft / a || 0, t.end = t.start + s / a, t.waveCtx.canvas.width = e, t.waveCtx.canvas.height = i, this.style(t.waveCtx.canvas, {
          width: s + "px"
        }), this.style(this.progressWave, {
          display: "block"
        }), this.hasProgressCanvas && (t.progressCtx.canvas.width = e, t.progressCtx.canvas.height = i, this.style(t.progressCtx.canvas, {
          width: s + "px"
        }));
      },
      clearWave: function () {
        this.canvases.forEach(function (t) {
          this.clearWaveForEntry(t);
        }, this);
      },
      clearWaveForEntry: function (t) {
        t.waveCtx.clearRect(0, 0, t.waveCtx.canvas.width, t.waveCtx.canvas.height), this.hasProgressCanvas && t.progressCtx.clearRect(0, 0, t.progressCtx.canvas.width, t.progressCtx.canvas.height);
      },
      drawBars: t.util.frame(function (e, i, s, a) {
        if (e[0] instanceof Array) {
          var r = e;
          if (this.params.splitChannels) return this.setHeight(r.length * this.params.height * this.params.pixelRatio), void r.forEach(function (t, e) {
            this.drawBars(t, e, s, a);
          }, this);
          e = r[0];
        }
        var n = 1;
        [].some.call(e, function (t) {
          return t < 0;
        }) && (n = 2);
        var o = this.width,
          h = this.params.height * this.params.pixelRatio,
          l = h * i || 0,
          c = h / 2,
          u = e.length / n,
          d = this.params.barWidth * this.params.pixelRatio,
          p = d + Math.max(this.params.pixelRatio, ~~(d / 2)),
          f = 1 / this.params.barHeight;
        if (this.params.normalize) {
          var m = t.util.max(e),
            v = t.util.min(e);
          f = -v > m ? -v : m;
        }
        for (var g = u / o, w = s / g; w < a / g; w += p) {
          var C = e[Math.floor(w * g * n)] || 0,
            y = Math.round(C / f * c);
          this.fillRect(w + this.halfPixel, c - y + l, d + this.halfPixel, 2 * y);
        }
      }),
      drawWave: t.util.frame(function (e, i, s, a) {
        if (e[0] instanceof Array) {
          var r = e;
          if (this.params.splitChannels) return this.setHeight(r.length * this.params.height * this.params.pixelRatio), void r.forEach(function (t, e) {
            this.drawWave(t, e, s, a);
          }, this);
          e = r[0];
        }
        if (![].some.call(e, function (t) {
          return t < 0;
        })) {
          for (var n = [], o = 0, h = e.length; o < h; o++) n[2 * o] = e[o], n[2 * o + 1] = -e[o];
          e = n;
        }
        var l = this.params.height * this.params.pixelRatio,
          c = l * i || 0,
          u = l / 2,
          d = 1 / this.params.barHeight;
        if (this.params.normalize) {
          var p = t.util.max(e),
            f = t.util.min(e);
          d = -f > p ? -f : p;
        }
        this.drawLine(e, d, u, c, s, a);
        var m = e.length > 0 ? 0 : this.params.fallbackProgressHeight;
        this.fillRect(0, u + c - this.halfPixel, this.width, this.halfPixel, m);
      }),
      drawLine: function (t, e, i, s, a, r) {
        this.canvases.forEach(function (n) {
          this.setFillStyles(n), this.drawLineToContext(n, n.waveCtx, t, e, i, s, a, r), this.drawLineToContext(n, n.progressCtx, t, e, i, s, a, r);
        }, this);
      },
      drawLineToContext: function (t, e, i, s, a, r, n, o) {
        if (e) {
          var h = i.length / 2,
            l = 1;
          this.params.fillParent && this.width != h && (l = this.width / h);
          var c = Math.round(h * t.start),
            u = Math.round(h * t.end);
          if (!(c > o || u < n)) {
            var d = Math.max(c, n),
              p = Math.min(u, o);
            e.beginPath(), e.moveTo((d - c) * l + this.halfPixel, a + r);
            for (v = d; v < p; v++) {
              var f = i[2 * v] || 0,
                m = Math.round(f / s * a);
              e.lineTo((v - c) * l + this.halfPixel, a - m + r);
            }
            for (var v = p - 1; v >= d; v--) {
              var f = i[2 * v + 1] || 0,
                m = Math.round(f / s * a);
              e.lineTo((v - c) * l + this.halfPixel, a - m + r);
            }
            e.closePath(), e.fill();
          }
        }
      },
      fillRect: function (t, e, i, s, a) {
        a = a || 0;
        for (var r = Math.floor(t / this.maxCanvasWidth), n = Math.min(Math.ceil((t + i) / this.maxCanvasWidth) + 1, this.canvases.length), o = r; o < n; o++) {
          var h = this.canvases[o],
            l = o * this.maxCanvasWidth,
            c = {
              x1: Math.max(t, o * this.maxCanvasWidth),
              y1: e,
              x2: Math.min(t + i, o * this.maxCanvasWidth + h.waveCtx.canvas.width),
              y2: e + s
            };
          c.x1 < c.x2 && (this.setFillStyles(h), this.fillRectToContext(h.waveCtx, c.x1 - l, c.y1, c.x2 - c.x1, c.y2 - c.y1), this.fillRectToContext(h.progressCtx, c.x1 - l, c.y1 - a / 2, c.x2 - c.x1, c.y2 - c.y1 + a));
        }
      },
      fillRectToContext: function (t, e, i, s, a) {
        t && t.fillRect(e, i, s, a);
      },
      setFillStyles: function (t) {
        t.waveCtx.fillStyle = this.params.waveColor, this.hasProgressCanvas && (t.progressCtx.fillStyle = this.params.progressColor);
      },
      updateProgress: function (t) {
        this.style(this.progressWave, {
          width: t + "px"
        });
      },
      getImage: function (t, e) {
        var i = [];
        return this.canvases.forEach(function (s) {
          i.push(s.wave.toDataURL(t, e));
        }), i.length > 1 ? i : i[0];
      }
    }), t.Drawer.SplitWavePointPlot = Object.create(t.Drawer.Canvas), t.util.extend(t.Drawer.SplitWavePointPlot, {
      defaultPlotParams: {
        plotNormalizeTo: "whole",
        plotTimeStart: 0,
        plotMin: 0,
        plotMax: 1,
        plotColor: "#f63",
        plotProgressColor: "#F00",
        plotPointHeight: 2,
        plotPointWidth: 2,
        plotSeparator: !0,
        plotSeparatorColor: "black",
        plotRangeDisplay: !1,
        plotRangeUnits: "",
        plotRangePrecision: 4,
        plotRangeIgnoreOutliers: !1,
        plotRangeFontSize: 12,
        plotRangeFontType: "Ariel",
        waveDrawMedianLine: !0,
        plotFileDelimiter: "\t"
      },
      plotTimeStart: 0,
      plotTimeEnd: -1,
      plotArrayLoaded: !1,
      plotArray: [],
      plotPoints: [],
      plotMin: 0,
      plotMax: 1,
      initDrawer: function (t) {
        var e = this;
        for (var i in this.defaultPlotParams) void 0 === this.params[i] && (this.params[i] = this.defaultPlotParams[i]);
        if (this.plotTimeStart = this.params.plotTimeStart, void 0 !== this.params.plotTimeEnd && (this.plotTimeEnd = this.params.plotTimeEnd), Array.isArray(t.plotArray)) this.plotArray = t.plotArray, this.plotArrayLoaded = !0;else {
          this.loadPlotArrayFromFile(t.plotFileUrl, function (t) {
            e.plotArray = t, e.plotArrayLoaded = !0, e.fireEvent("plot_array_loaded");
          }, this.params.plotFileDelimiter);
        }
      },
      drawPeaks: function (t, e, i, s) {
        if (1 == this.plotArrayLoaded) this.setWidth(e), this.splitChannels = !0, this.params.height = this.params.height / 2, t[0] instanceof Array && (t = t[0]), this.params.barWidth ? this.drawBars(t, 1, i, s) : this.drawWave(t, 1, i, s), this.params.height = 2 * this.params.height, this.calculatePlots(), this.drawPlots();else {
          var a = this;
          a.on("plot-array-loaded", function () {
            a.drawPeaks(t, e, i, s);
          });
        }
      },
      drawPlots: function () {
        var t = this.params.height * this.params.pixelRatio / 2,
          e = .5 / this.params.pixelRatio;
        this.waveCc.fillStyle = this.params.plotColor, this.progressCc && (this.progressCc.fillStyle = this.params.plotProgressColor);
        for (var i in this.plotPoints) {
          var s = parseInt(i),
            a = t - this.params.plotPointHeight - this.plotPoints[i] * (t - this.params.plotPointHeight),
            r = this.params.plotPointHeight;
          this.waveCc.fillRect(s, a, this.params.plotPointWidth, r), this.progressCc && this.progressCc.fillRect(s, a, this.params.plotPointWidth, r);
        }
        this.params.plotSeparator && (this.waveCc.fillStyle = this.params.plotSeparatorColor, this.waveCc.fillRect(0, t, this.width, e)), this.params.plotRangeDisplay && this.displayPlotRange();
      },
      displayPlotRange: function () {
        var t = this.params.plotRangeFontSize * this.params.pixelRatio,
          e = this.plotMax.toPrecision(this.params.plotRangePrecision) + " " + this.params.plotRangeUnits,
          i = this.plotMin.toPrecision(this.params.plotRangePrecision) + " " + this.params.plotRangeUnits;
        this.waveCc.font = t.toString() + "px " + this.params.plotRangeFontType, this.waveCc.fillText(e, 3, t), this.waveCc.fillText(i, 3, this.height / 2);
      },
      calculatePlots: function () {
        this.plotPoints = {}, this.calculatePlotTimeEnd();
        for (var t = [], e = -1, i = 0, s = 99999999999999, a = 0, r = 99999999999999, n = this.plotTimeEnd - this.plotTimeStart, o = 0; o < this.plotArray.length; o++) {
          var h = this.plotArray[o];
          if (h.value > i && (i = h.value), h.value < s && (s = h.value), h.time >= this.plotTimeStart && h.time <= this.plotTimeEnd) {
            var l = Math.round(this.width * (h.time - this.plotTimeStart) / n);
            if (t.push(h.value), l !== e && t.length > 0) {
              var c = this.avg(t);
              c > a && (a = c), c < r && (r = c), this.plotPoints[e] = c, t = [];
            }
            e = l;
          }
        }
        "whole" == this.params.plotNormalizeTo ? (this.plotMin = s, this.plotMax = i) : "values" == this.params.plotNormalizeTo ? (this.plotMin = this.params.plotMin, this.plotMax = this.params.plotMax) : (this.plotMin = r, this.plotMax = a), this.normalizeValues();
      },
      normalizeValues: function () {
        var t = {};
        if ("none" !== this.params.plotNormalizeTo) {
          for (var e in this.plotPoints) {
            var i = (this.plotPoints[e] - this.plotMin) / (this.plotMax - this.plotMin);
            i > 1 ? this.params.plotRangeIgnoreOutliers || (t[e] = 1) : i < 0 ? this.params.plotRangeIgnoreOutliers || (t[e] = 0) : t[e] = i;
          }
          this.plotPoints = t;
        }
      },
      loadPlotArrayFromFile: function (e, i, s) {
        void 0 === s && (s = "\t");
        var a = [],
          r = {
            url: e,
            responseType: "text"
          };
        t.util.ajax(r).on("load", function (t) {
          if (200 == t.currentTarget.status) {
            for (var e = t.currentTarget.responseText.split("\n"), r = 0; r < e.length; r++) {
              var n = e[r].split(s);
              2 == n.length && a.push({
                time: parseFloat(n[0]),
                value: parseFloat(n[1])
              });
            }
            i(a);
          }
        });
      },
      calculatePlotTimeEnd: function () {
        void 0 !== this.params.plotTimeEnd ? this.plotTimeEnd = this.params.plotTimeEnd : this.plotTimeEnd = this.plotArray[this.plotArray.length - 1].time;
      },
      avg: function (t) {
        return t.reduce(function (t, e) {
          return t + e;
        }) / t.length;
      }
    }), t.util.extend(t.Drawer.SplitWavePointPlot, t.Observer), t.PeakCache = {
      init: function () {
        this.clearPeakCache();
      },
      clearPeakCache: function () {
        this.peakCacheRanges = [], this.peakCacheLength = -1;
      },
      addRangeToPeakCache: function (t, e, i) {
        t != this.peakCacheLength && (this.clearPeakCache(), this.peakCacheLength = t);
        for (var s = [], a = 0; a < this.peakCacheRanges.length && this.peakCacheRanges[a] < e;) a++;
        for (a % 2 == 0 && s.push(e); a < this.peakCacheRanges.length && this.peakCacheRanges[a] <= i;) s.push(this.peakCacheRanges[a]), a++;
        a % 2 == 0 && s.push(i), s = s.filter(function (t, e, i) {
          return 0 == e ? t != i[e + 1] : e == i.length - 1 ? t != i[e - 1] : t != i[e - 1] && t != i[e + 1];
        }), this.peakCacheRanges = this.peakCacheRanges.concat(s), this.peakCacheRanges = this.peakCacheRanges.sort(function (t, e) {
          return t - e;
        }).filter(function (t, e, i) {
          return 0 == e ? t != i[e + 1] : e == i.length - 1 ? t != i[e - 1] : t != i[e - 1] && t != i[e + 1];
        });
        var r = [];
        for (a = 0; a < s.length; a += 2) r.push([s[a], s[a + 1]]);
        return r;
      },
      getCacheRanges: function () {
        for (var t = [], e = 0; e < this.peakCacheRanges.length; e += 2) t.push([this.peakCacheRanges[e], this.peakCacheRanges[e + 1]]);
        return t;
      }
    }, function () {
      var e = function () {
        var e = document.querySelectorAll("wavesurfer");
        Array.prototype.forEach.call(e, function (e) {
          var i = t.util.extend({
            container: e,
            backend: "MediaElement",
            mediaControls: !0
          }, e.dataset);
          e.style.display = "block";
          var s = t.create(i);
          if (e.dataset.peaks) var a = JSON.parse(e.dataset.peaks);
          s.load(e.dataset.url, a);
        });
      };
      "complete" === document.readyState ? e() : window.addEventListener("load", e);
    }(), t;
  });
  });

  var reactWavesurfer_min = createCommonjsModule(function (module, exports) {
  !function (e, o) {
     module.exports = o(reactMeasure, React$1__default, wavesurfer_min) ;
  }(commonjsGlobal, function (e, o, r) {
    return function (e) {
      function o(t) {
        if (r[t]) return r[t].exports;
        var n = r[t] = {
          exports: {},
          id: t,
          loaded: !1
        };
        return e[t].call(n.exports, n, n.exports, o), n.loaded = !0, n.exports;
      }
      var r = {};
      return o.m = e, o.c = r, o.p = "", o(0);
    }([function (e, o, r) {

      function t(e) {
        return e && e.__esModule ? e : {
          default: e
        };
      }
      function n(e, o) {
        if (!(e instanceof o)) throw new TypeError("Cannot call a class as a function");
      }
      function s(e, o) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !o || "object" != typeof o && "function" != typeof o ? e : o;
      }
      function i(e, o) {
        if ("function" != typeof o && null !== o) throw new TypeError("Super expression must either be null or a function, not " + typeof o);
        e.prototype = Object.create(o && o.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        }), o && (Object.setPrototypeOf ? Object.setPrototypeOf(e, o) : e.__proto__ = o);
      }
      function a(e) {
        return e.split("-").map(function (e) {
          return e.charAt(0).toUpperCase() + e.slice(1);
        }).join("");
      }
      function p(e, o, r) {
        var t = e[o];
        return void 0 !== t && ("number" != typeof t || t !== parseInt(t, 10) || t < 0) ? new Error("Invalid " + o + " supplied to " + r + ",\n      expected a positive integer") : null;
      }
      Object.defineProperty(o, "__esModule", {
        value: !0
      });
      var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
          return typeof e;
        } : function (e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        },
        l = function () {
          function e(e, o) {
            for (var r = 0; r < o.length; r++) {
              var t = o[r];
              t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0), Object.defineProperty(e, t.key, t);
            }
          }
          return function (o, r, t) {
            return r && e(o.prototype, r), t && e(o, t), o;
          };
        }(),
        f = r(4),
        d = t(f),
        c = r(1),
        y = t(c),
        h = r(5),
        v = r(3),
        m = ["audioprocess", "error", "finish", "loading", "mouseup", "pause", "play", "ready", "scroll", "seek", "zoom"],
        w = function (e) {
          function o(e) {
            n(this, o);
            var r = s(this, (o.__proto__ || Object.getPrototypeOf(o)).call(this, e));
            if (r.state = {
              isReady: !1
            }, void 0 === ("undefined" == typeof h ? "undefined" : u(h))) throw new Error("WaveSurfer is undefined!");
            return r._wavesurfer = Object.create(h), r._loadMediaElt = r._loadMediaElt.bind(r), r._loadAudio = r._loadAudio.bind(r), r._seekTo = r._seekTo.bind(r), r._handleResize = function () {
              r.state.isReady && r._wavesurfer.refresh();
            }, r;
          }
          return i(o, e), l(o, [{
            key: "componentDidMount",
            value: function () {
              var e = this,
                o = (0, y.default)({}, this.props.options, {
                  container: this.wavesurferEl
                });
              this.props.mediaElt && (o.backend = "MediaElement"), this._wavesurfer.init(o), this._wavesurfer.on("ready", function () {
                e.setState({
                  isReady: !0,
                  pos: e.props.pos
                }), e.props.pos && e._seekTo(e.props.pos), null != e.props.volume && e._wavesurfer.setVolume(e.props.volume), e.props.playing && e.wavesurfer.play(), e.props.zoom && e._wavesurfer.zoom(e.props.zoom);
              }), this._wavesurfer.on("audioprocess", function (o) {
                e.setState({
                  pos: o
                }), e.props.onPosChange({
                  wavesurfer: e._wavesurfer,
                  originalArgs: [o]
                });
              }), this._wavesurfer.on("seek", function (o) {
                var r = e._posToSec(o);
                e.setState({
                  formattedPos: r
                }), e.props.onPosChange({
                  wavesurfer: e._wavesurfer,
                  originalArgs: [r]
                });
              }), m.forEach(function (o) {
                var r = e.props["on" + a(o)],
                  t = e._wavesurfer;
                r && e._wavesurfer.on(o, function () {
                  for (var e = arguments.length, o = Array(e), n = 0; n < e; n++) o[n] = arguments[n];
                  r({
                    wavesurfer: t,
                    originalArgs: o
                  });
                });
              }), this.props.audioFile && this._loadAudio(this.props.audioFile, this.props.audioPeaks), this.props.mediaElt && this._loadMediaElt(this.props.mediaElt, this.props.audioPeaks);
            }
          }, {
            key: "componentWillReceiveProps",
            value: function (e) {
              this.props.audioFile !== e.audioFile && this._loadAudio(e.audioFile, e.audioPeaks), this.props.mediaElt !== e.mediaElt && this._loadMediaElt(e.mediaElt, e.audioPeaks), this.props.audioPeaks !== e.audioPeaks && (e.mediaElt ? this._loadMediaElt(e.mediaElt, e.audioPeaks) : this._loadAudio(e.audioFile, e.audioPeaks)), e.pos && this.state.isReady && e.pos !== this.props.pos && e.pos !== this.state.pos && this._seekTo(e.pos), this.props.playing !== e.playing && (e.playing ? this._wavesurfer.play() : this._wavesurfer.pause()), this.props.volume !== e.volume && this._wavesurfer.setVolume(e.volume), this.props.zoom !== e.zoom && this._wavesurfer.zoom(e.zoom), this.props.options.audioRate !== e.options.audioRate && this._wavesurfer.setPlaybackRate(e.options.audioRate), e.options.waveColor !== this.props.options.waveColor && this._wavesurfer.setWaveColor(e.options.waveColor), e.options.progressColor !== this.props.options.progressColor && this._wavesurfer.setProgressColor(e.options.progressColor), e.options.cursorColor !== this.props.options.cursorColor && this._wavesurfer.setCursorColor(e.options.cursorColor), e.options.height !== this.props.options.height && this._wavesurfer.setHeight(e.options.height);
            }
          }, {
            key: "shouldComponentUpdate",
            value: function () {
              return !1;
            }
          }, {
            key: "componentWillUnmount",
            value: function () {
              var e = this;
              m.forEach(function (o) {
                e._wavesurfer.un(o);
              }), this._wavesurfer.destroy();
            }
          }, {
            key: "_secToPos",
            value: function (e) {
              return 1 / this._wavesurfer.getDuration() * e;
            }
          }, {
            key: "_posToSec",
            value: function (e) {
              return e * this._wavesurfer.getDuration();
            }
          }, {
            key: "_seekTo",
            value: function (e) {
              var o = this._secToPos(e);
              this.props.options.autoCenter ? this._wavesurfer.seekAndCenter(o) : this._wavesurfer.seekTo(o);
            }
          }, {
            key: "_loadMediaElt",
            value: function (e, o) {
              if (e instanceof window.HTMLElement) this._loadAudio(e, o);else {
                if (!window.document.querySelector(e)) throw new Error("Media Element not found!");
                this._loadAudio(window.document.querySelector(e), o);
              }
            }
          }, {
            key: "_loadAudio",
            value: function (e, o) {
              if (e instanceof window.HTMLElement) this._wavesurfer.loadMediaElement(e, o);else if ("string" == typeof e) this._wavesurfer.load(e, o);else {
                if (!(e instanceof window.Blob || e instanceof window.File)) throw new Error("Wavesurfer._loadAudio expects prop audioFile\n        to be either HTMLElement, string or file/blob");
                this._wavesurfer.loadBlob(e, o);
              }
            }
          }, {
            key: "_measureIfResponsive",
            value: function (e) {
              return this.props.responsive ? d.default.createElement(v, {
                whitelist: ["width", "height"],
                onMeasure: this._handleResize
              }, e) : e;
            }
          }, {
            key: "render",
            value: function () {
              var e = this,
                o = !!this.props.children && d.default.Children.map(this.props.children, function (o) {
                  return d.default.cloneElement(o, {
                    wavesurfer: e._wavesurfer,
                    isReady: e.state.isReady
                  });
                });
              return this._measureIfResponsive(d.default.createElement("div", null, d.default.createElement("div", {
                ref: function (o) {
                  e.wavesurferEl = o;
                }
              }), o));
            }
          }]), o;
        }(f.Component);
      w.propTypes = {
        playing: f.PropTypes.bool,
        pos: f.PropTypes.number,
        audioFile: function (e, o, r) {
          var t = e[o];
          return !t || "string" == typeof t || t instanceof window.Blob || t instanceof window.File ? null : new Error("Invalid " + o + " supplied to " + r + "\n        expected either string or file/blob");
        },
        mediaElt: f.PropTypes.oneOfType([f.PropTypes.string, f.PropTypes.instanceOf(window.HTMLElement)]),
        audioPeaks: f.PropTypes.array,
        volume: f.PropTypes.number,
        zoom: f.PropTypes.number,
        responsive: f.PropTypes.bool,
        onPosChange: f.PropTypes.func,
        children: f.PropTypes.oneOfType([f.PropTypes.element, f.PropTypes.array]),
        options: f.PropTypes.shape({
          audioRate: f.PropTypes.number,
          backend: f.PropTypes.oneOf(["WebAudio", "MediaElement"]),
          barWidth: function (e, o, r) {
            var t = e[o];
            return void 0 !== t && "number" != typeof t ? new Error("Invalid " + o + " supplied to " + r + "\n          expected either undefined or number") : null;
          },
          cursorColor: f.PropTypes.string,
          cursorWidth: p,
          dragSelection: f.PropTypes.bool,
          fillParent: f.PropTypes.bool,
          height: p,
          hideScrollbar: f.PropTypes.bool,
          interact: f.PropTypes.bool,
          loopSelection: f.PropTypes.bool,
          mediaControls: f.PropTypes.bool,
          minPxPerSec: p,
          normalize: f.PropTypes.bool,
          pixelRatio: f.PropTypes.number,
          progressColor: f.PropTypes.string,
          scrollParent: f.PropTypes.bool,
          skipLength: f.PropTypes.number,
          waveColor: f.PropTypes.string,
          autoCenter: f.PropTypes.bool
        })
      }, w.defaultProps = {
        playing: !1,
        pos: 0,
        options: h.defaultParams,
        responsive: !0,
        onPosChange: function () {}
      }, o.default = w;
    }, function (e, o, r) {

      function t(e) {
        if (null === e || void 0 === e) throw new TypeError("Sources cannot be null or undefined");
        return Object(e);
      }
      function n(e, o, r) {
        var t = o[r];
        if (void 0 !== t && null !== t) {
          if (a.call(e, r) && (void 0 === e[r] || null === e[r])) throw new TypeError("Cannot convert undefined or null to object (" + r + ")");
          a.call(e, r) && i(t) ? e[r] = s(Object(e[r]), o[r]) : e[r] = t;
        }
      }
      function s(e, o) {
        if (e === o) return e;
        o = Object(o);
        for (var r in o) a.call(o, r) && n(e, o, r);
        if (Object.getOwnPropertySymbols) for (var t = Object.getOwnPropertySymbols(o), s = 0; s < t.length; s++) p.call(o, t[s]) && n(e, o, t[s]);
        return e;
      }
      var i = r(2),
        a = Object.prototype.hasOwnProperty,
        p = Object.prototype.propertyIsEnumerable;
      e.exports = function (e) {
        e = t(e);
        for (var o = 1; o < arguments.length; o++) s(e, arguments[o]);
        return e;
      };
    }, function (e, o) {

      var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      };
      e.exports = function (e) {
        var o = "undefined" == typeof e ? "undefined" : r(e);
        return null !== e && ("object" === o || "function" === o);
      };
    }, function (o, r) {
      o.exports = e;
    }, function (e, r) {
      e.exports = o;
    }, function (e, o) {
      e.exports = r;
    }]);
  });
  });

  var Wavesurfer = unwrapExports(reactWavesurfer_min);
  var reactWavesurfer_min_1 = reactWavesurfer_min.Wavesurfer;

  const waveColor = 'rgba(170, 170, 170, 1)';
  const waveColorForInvertedPage = 'rgba(0, 0, 0, 0.5)';
  const cursorColor = '#fff';
  const cursorColorForInvertedPage = '#888';
  function Waveform(props) {
    if (props.pageIsPrepared && props.mediaElementId) {
      return /*#__PURE__*/React.createElement(Measure, {
        whitelist: ['height']
      }, ({
        height
      }) => /*#__PURE__*/React.createElement("div", {
        className: "waveform_player_controls-wave"
      }, /*#__PURE__*/React.createElement("div", {
        className: "waveform_player_controls-wave_wrapper"
      }, /*#__PURE__*/React.createElement(Wavesurfer, {
        mediaElt: `#${props.mediaElementId}`,
        options: {
          normalize: true,
          removeMediaElementOnDestroy: false,
          hideScrollbar: true,
          progressColor: props.waveformColor || props.mainColor,
          waveColor: props.inverted ? waveColorForInvertedPage : waveColor,
          cursorColor: props.inverted ? cursorColorForInvertedPage : cursorColor,
          height
        }
      }), /*#__PURE__*/React.createElement(PlayButton$3, {
        isPlaying: props.isPlaying,
        title: props.playButtonTitle,
        inverted: props.inverted,
        onClick: props.onPlayButtonClick
      }))));
    } else {
      return null;
    }
  }
  var Waveform$1 = connectInPage(combine$1({
    pageIsPrepared: pageIsPrepared(),
    waveformColor: pageAttribute('waveformColor'),
    mainColor
  }))(Waveform);

  function TimesDisplay(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "waveform_player_controls-times_display"
    }, /*#__PURE__*/React.createElement(TimeDisplay, {
      value: props.currentTime,
      className: "waveform_player_controls-times_display-current_time"
    }), "/", /*#__PURE__*/React.createElement(TimeDisplay, {
      value: props.duration,
      className: "waveform_player_controls-times_display-duration"
    }));
  }

  function WaveformPlayerControls(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: className$9(props)
    }, /*#__PURE__*/React.createElement(Container$3, null, /*#__PURE__*/React.createElement(Waveform$1, {
      isPlaying: props.isPlaying,
      inverted: props.inverted,
      playButtonTitle: props.playButtonTitle,
      mediaElementId: props.mediaElementId,
      onPlayButtonClick: props.onPlayButtonClick
    }), /*#__PURE__*/React.createElement(TimesDisplay, {
      currentTime: props.currentTime,
      duration: props.duration
    }), /*#__PURE__*/React.createElement(InfoBox$1, props.infoBox)), /*#__PURE__*/React.createElement(MenuBar, {
      inverted: props.inverted,
      qualityMenuButtonTitle: props.qualityMenuButtonTitle,
      qualityMenuItems: props.qualityMenuItems,
      onQualityMenuItemClick: props.onQualityMenuItemClick,
      textTracksMenuButtonTitle: props.textTracksMenuButtonTitle,
      textTracksMenuItems: props.textTracksMenuItems,
      hiddenOnPhone: !props.isPlaying,
      onTextTracksMenuItemClick: props.onTextTracksMenuItemClick
    }));
  }
  var WaveformPlayerControls$1 = connectInPage(combine$1({
    inverted: pageAttribute('invert')
  }))(WaveformPlayerControls);
  function className$9(props) {
    return classnames('waveform_player_controls', {
      'waveform_player_controls-inverted': props.inverted
    });
  }

  const HOTKEY_SPACE = 'HOTKEY_SPACE';
  const HOTKEY_TAB = 'HOTKEY_TAB';
  function space({
    currentPageId
  }) {
    return pageAction(HOTKEY_SPACE, currentPageId);
  }
  function tab({
    currentPageId
  }) {
    return pageAction(HOTKEY_TAB, currentPageId);
  }

  function createReducer ({
    scope = 'default'
  } = {}) {
    return function reducer(state = {}, action) {
      if (action.meta && action.meta.mediaScope && action.meta.mediaScope !== scope) {
        return state;
      }
      switch (action.type) {
        case PAGE_WILL_ACTIVATE:
          return {
            ...state,
            hasPlayed: false,
            unplayed: true,
            infoBoxHiddenDuringPlayback: undefined,
            userIsIdle: false
          };
        case PAGE_WILL_DEACTIVATE:
          return {
            ...state,
            shouldPrebuffer: false
          };
        case PLAY:
          return {
            ...state,
            shouldPlay: true,
            playFailed: false,
            hasBeenPlayingJustNow: true,
            unplayed: false,
            fadeDuration: null,
            isLoading: true
          };
        case PLAYING:
          return {
            ...state,
            shouldPlay: true,
            isPlaying: true
          };
        case PLAY_FAILED:
          return {
            ...state,
            shouldPlay: false,
            playFailed: true,
            hasBeenPlayingJustNow: false,
            unplayed: true,
            fadeDuration: null,
            isLoading: false
          };
        case PLAY_AND_FADE_IN:
          return {
            ...state,
            shouldPlay: true,
            hasBeenPlayingJustNow: true,
            fadeDuration: action.payload.fadeDuration,
            isLoading: true
          };
        case PAUSE:
          return {
            ...state,
            shouldPlay: false,
            fadeDuration: null,
            isLoading: false
          };
        case PAUSED:
          if (state.bufferUnderrun) {
            return {
              ...state,
              isPlaying: false,
              hasPlayed: true
            };
          }
          return {
            ...state,
            shouldPlay: false,
            isPlaying: false,
            fadeDuration: null,
            isLoading: false
          };
        case FADE_OUT_AND_PAUSE:
          return {
            ...state,
            shouldPlay: false,
            fadeDuration: action.payload.fadeDuration,
            isLoading: false
          };
        case CHANGE_VOLUME_FACTOR:
          return {
            ...state,
            volumeFactor: action.payload.volumeFactor,
            volumeFactorFadeDuration: action.payload.fadeDuration
          };
        case PREBUFFER:
          return {
            ...state,
            shouldPrebuffer: true
          };
        case PREBUFFERED:
          return {
            ...state,
            shouldPrebuffer: false
          };
        case WAITING:
          return {
            ...state,
            isLoading: true
          };
        case BUFFER_UNDERRUN:
          return {
            ...state,
            bufferUnderrun: true
          };
        case BUFFER_UNDERRUN_CONTINUE:
          return {
            ...state,
            bufferUnderrun: false
          };
        case SCRUB_TO:
          return {
            ...state,
            scrubbingAt: action.payload.time
          };
        case SEEK_TO:
          return {
            ...state,
            shouldSeekTo: action.payload.time
          };
        case SEEKING:
          return {
            ...state,
            isLoading: true
          };
        case SEEKED:
          return {
            ...state,
            scrubbingAt: undefined,
            isLoading: false
          };
        case META_DATA_LOADED:
          return {
            ...state,
            currentTime: action.payload.currentTime,
            duration: action.payload.duration
          };
        case PROGRESS:
          return {
            ...state,
            bufferedEnd: action.payload.bufferedEnd
          };
        case TIME_UPDATE:
          return {
            ...state,
            currentTime: action.payload.currentTime,
            duration: action.payload.duration,
            isLoading: false
          };
        case ENDED:
          return {
            ...state,
            shouldPlay: false,
            isPlaying: false
          };
        case HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT:
          return {
            ...state,
            hasBeenPlayingJustNow: false
          };
        case HOTKEY_TAB:
        case USER_INTERACTION:
          return {
            ...state,
            userIsIdle: false,
            controlsHidden: false
          };
        case USER_IDLE:
          return {
            ...state,
            userIsIdle: true
          };
        case CONTROLS_ENTERED:
          return {
            ...state,
            userHoveringControls: true
          };
        case CONTROLS_LEFT:
          return {
            ...state,
            userHoveringControls: false
          };
        case FOCUS_ENTERED_CONTROLS:
          return {
            ...state,
            focusInsideControls: true
          };
        case FOCUS_LEFT_CONTROLS:
          return {
            ...state,
            focusInsideControls: false
          };
        case CONTROLS_HIDDEN:
          return {
            ...state,
            controlsHidden: true,
            infoBoxHiddenDuringPlayback: true
          };
        case HIDE_INFO_BOX_DURING_PLAYBACK:
          return {
            ...state,
            infoBoxHiddenDuringPlayback: true
          };
        case SHOW_INFO_BOX_DURING_PLAYBACK:
          return {
            ...state,
            infoBoxHiddenDuringPlayback: false
          };
        case TOGGLE_INFO_BOX_DURING_PLAYBACK:
          return {
            ...state,
            infoBoxHiddenDuringPlayback: !state.infoBoxHiddenDuringPlayback
          };
        case SAVE_MEDIA_ELEMENT_ID:
          return {
            ...state,
            mediaElementId: action.payload.id
          };
        case DISCARD_MEDIA_ELEMENT_ID:
          return {
            ...state,
            mediaElementId: null
          };
        default:
          return state;
      }
    };
  }

  function pageScrollerMarginReducer (state = {}, action) {
    switch (action.type) {
      case SET_BOTTOM:
        return {
          ...state,
          bottom: action.payload.value
        };
      default:
        return state;
    }
  }

  function* togglePlaying () {
    yield lib_7([HOTKEY_SPACE, TOGGLE_PLAYING], toggle, actionCreators());
  }
  function* toggle({
    play,
    pause
  }) {
    const state = yield select(playerState());
    if (state.shouldPlay) {
      yield put(pause());
    } else {
      yield call(() => pageflow.backgroundMedia.unmute());
      yield put(play());
    }
  }

  function* muteBackgroundMediaOnPlayFailed () {
    yield lib_7([PLAY_FAILED, PLAYING_MUTED], muteBackgoundAudio);
  }
  function* muteBackgoundAudio() {
    yield call(() => pageflow.backgroundMedia.mute());
  }

  const MUTE = 'BACKGROUND_MEDIA_MUTE';
  const UNMUTE = 'BACKGROUND_MEDIA_UNMUTE';
  function mute() {
    return {
      type: MUTE
    };
  }
  function unmute() {
    return {
      type: UNMUTE
    };
  }

  const {
    play,
    prebuffer,
    waiting
  } = actionCreators();
  function* handlePageDidActivate (options) {
    yield lib_7(PAGE_DID_ACTIVATE, function* (action) {
      yield [race({
        task: call(prebufferAndPlay, options),
        cancel: take(PAGE_WILL_DEACTIVATE)
      }), race({
        task: call(prebufferAndPlayOnUnmute, options),
        cancel: take(PAGE_WILL_DEACTIVATE)
      })];
    });
  }
  function* prebufferAndPlayOnUnmute(options) {
    if (options.retryOnUnmute && (yield select(pageHasAutoplayOption()))) {
      const {
        unmute
      } = yield race({
        unmute: take(UNMUTE),
        cancel: take(PAGE_WILL_DEACTIVATE)
      });
      if (unmute) {
        yield* prebufferAndPlay(options);
      }
    }
  }
  function* prebufferAndPlay(options) {
    const autoplay = yield* autoplayPage(options);
    if (autoplay) {
      yield put(waiting());
    }
    yield [take(PREBUFFERED), put(prebuffer())];
    if (autoplay) {
      yield call(lib_4$1, 1000);
      yield put(play());
    }
  }
  function* autoplayPage({
    canAutoplay,
    autoplayWhenBackgroundMediaMuted
  }) {
    const shouldAutoplay = yield select(pageShouldAutoplay({
      autoplayWhenBackgroundMediaMuted: () => autoplayWhenBackgroundMediaMuted
    }));
    return shouldAutoplay && canAutoplay;
  }

  function* disableScrollIndicatorDuringPlayback () {
    yield lib_7(PLAY, function* () {
      if (yield select(pageIsActive())) {
        yield call(disable);
      }
    });
    yield lib_7([PAUSE, ENDED], function* () {
      if (yield select(pageIsActive())) {
        yield call(enable);
      }
    });
  }
  function disable() {
    pageflow.events.trigger('scroll_indicator:disable');
  }
  function enable() {
    pageflow.events.trigger('scroll_indicator:enable');
  }

  function* hasNotBeenPlayingForAMoment () {
    const {
      hasNotBeenPlayingForAMoment
    } = actionCreators();
    yield lib_7([PAUSE, ENDED], function* () {
      yield race({
        task: call(function* (action) {
          yield call(lib_4$1, 700);
          yield put(hasNotBeenPlayingForAMoment(false));
        }),
        cancel: take(PLAYING)
      });
    });
  }

  function* idling () {
    const {
      userIdle
    } = actionCreators();
    yield lib_6([PLAY, USER_INTERACTION, HOTKEY_TAB], putAfterDelay, userIdle);
  }
  function* putAfterDelay(actionCreator) {
    yield call(lib_4$1, 3000);
    yield put(actionCreator());
  }

  function* fadeOutWhenPageWillDeactivate ({
    scope
  } = {}) {
    const {
      fadeOutAndPause
    } = actionCreators({
      scope
    });
    yield lib_7(PAGE_DID_DEACTIVATE, function* () {
      yield put(fadeOutAndPause({
        fadeDuration: 400
      }));
    });
  }

  function* goToNextPageOnEnd () {
    yield lib_7(ENDED, function* () {
      const autoChangePage = yield select(pageAttribute('autoChangePageOnEnded'));
      const pageIsStillActive = yield select(pageIsActive());
      if (autoChangePage && pageIsStillActive) {
        yield call(goToNextPage);
      }
    });
  }
  function goToNextPage() {
    pageflow.slides.next();
  }

  function* pageSaga (options = {}) {
    const sagas = [togglePlaying(), muteBackgroundMediaOnPlayFailed(), disableScrollIndicatorDuringPlayback()];
    if (!options.playsInNativePlayer || !options.playsInNativePlayer()) {
      sagas.push([goToNextPageOnEnd(), fadeOutWhenPageWillDeactivate(), hasNotBeenPlayingForAMoment()]);
    }
    if (!has$2('mobile platform')) {
      sagas.push([handlePageDidActivate({
        ...options,
        canAutoplay: has$2('autoplay support')
      })]);
    }
    if (options.hideControls) {
      sagas.push([idling()]);
    }
    yield sagas;
  }

  function* fadeInWhenPageWillActivate ({
    scope
  } = {}) {
    const actions = actionCreators({
      scope
    });
    yield lib_7(PAGE_WILL_ACTIVATE, function* (action) {
      yield [race({
        task: [put(actions.prebuffer()), call(playSilentlyWhenPrebuffered, actions), call(fadeInOnPageDidActivateAndPrebuffered, actions)],
        cancel: take(PAGE_WILL_DEACTIVATE)
      })];
    });
  }
  function* playSilentlyWhenPrebuffered({
    prebuffer,
    changeVolumeFactor,
    play
  }) {
    yield put(changeVolumeFactor(0, {
      fadeDuration: 0
    }));
    yield take(PREBUFFERED);
    yield put(play());
  }
  function* fadeInOnPageDidActivateAndPrebuffered({
    changeVolumeFactor
  }) {
    yield [take(PREBUFFERED), take(PAGE_DID_ACTIVATE)];
    yield put(changeVolumeFactor(1, {
      fadeDuration: 1000
    }));
  }

  function reduxModule(options) {
    return {
      reducers: {
        'media.default': createReducer({
          scope: 'default'
        }),
        'media.pageScrollerMargin': pageScrollerMarginReducer
      },
      saga: function* () {
        yield pageSaga(options);
      }
    };
  }
  const pageBackgroundReduxModule = {
    reducers: {
      'media.background': createReducer({
        scope: 'background'
      })
    },
    saga: function* () {
      yield [fadeInWhenPageWillActivate({
        scope: 'background'
      }), fadeOutWhenPageWillDeactivate({
        scope: 'background'
      }), muteBackgroundMediaOnPlayFailed()];
    }
  };

  function textIsHidden(state) {
    return state.hideText.isActive;
  }
  function textHasBeenHidden(state) {
    return state.hideText.hasBeenActive;
  }

  /**
   * @desc
   * Use to build pages that have a play button to hide the page's text
   * and allow interacting with elements placed in the {@link
   * pageflow.react.components.PageBackground|PageBackground}.
   *
   * @alias pageflow.react.components.PageWithInteractiveBackground
   * @class
   * @since 12.1
   */
  class PageWithInteractiveBackground extends React$1__default.Component {
    constructor(props, context) {
      super(props, context);
      this.onPlayButtonClick = () => {
        pageflow.hideText.activate();
        if (this.props.onEnterBackground) {
          this.props.onEnterBackground();
        }
      };
      this.onCloseButtonClick = () => {
        pageflow.hideText.deactivate();
        if (this.props.onLeaveBackground) {
          this.props.onLeaveBackground();
        }
      };
    }
    render() {
      const page = this.props.page;
      return /*#__PURE__*/React$1__default.createElement(PageWrapper, {
        className: classnames({
          unplayed: !this.props.textHasBeenHidden
        }, 'hide_content_with_text')
      }, /*#__PURE__*/React$1__default.createElement(CloseButton$1, {
        onClick: this.onCloseButtonClick
      }), /*#__PURE__*/React$1__default.createElement(MenuBar, {
        additionalButtons: this.props.additionalMenuBarButtons,
        onAdditionalButtonClick: this.props.onAdditionalButtonClick,
        qualityMenuButtonTitle: this.props.qualityMenuButtonTitle,
        qualityMenuItems: this.props.qualityMenuItems,
        onQualityMenuItemClick: this.props.onQualityMenuItemClick,
        hiddenOnPhone: this.props.textHasBeenHidden && !this.props.textIsHidden
      }), /*#__PURE__*/React$1__default.createElement(PageBackground, {
        pageHasPlayerControls: true
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "uncropped_media_wrapper"
      }, this.props.children), /*#__PURE__*/React$1__default.createElement(PageShadow, {
        page: page
      })), /*#__PURE__*/React$1__default.createElement(PageForeground, null, /*#__PURE__*/React$1__default.createElement(PlayerControls$1, {
        playButtonTitle: "Starten",
        playButtonIconName: this.props.playButtonIconName,
        controlBarText: page.controlBarText || this.props.defaultControlBarText,
        onPlayButtonClick: this.onPlayButtonClick,
        infoBox: {
          title: page.additionalTitle,
          description: page.additionalDescription
        }
      }), /*#__PURE__*/React$1__default.createElement(PageScroller$1, null, /*#__PURE__*/React$1__default.createElement(PageHeader, {
        page: page
      }), /*#__PURE__*/React$1__default.createElement(PageText, {
        page: page
      }))));
    }
  }
  var PageWithInteractiveBackground$1 = connectInPage(combine$1({
    textIsHidden,
    textHasBeenHidden
  }))(PageWithInteractiveBackground);

  const ACTIVATE = 'HIDE_TEXT_ACTIVATE';
  const DEACTIVATE = 'HIDE_TEXT_DEACTIVATE';
  function activate() {
    return {
      type: ACTIVATE
    };
  }
  function deactivate() {
    return {
      type: DEACTIVATE
    };
  }

  function* reenableScrollIndicator () {
    yield lib_7(DEACTIVATE, function* () {
      if (yield select(pageIsActive())) {
        yield call(enable$1);
      }
    });
  }
  function enable$1() {
    pageflow.events.trigger('scroll_indicator:enable');
  }

  const reduxModule$1 = {
    name: 'interactivePageBackground',
    saga: reenableScrollIndicator
  };

  function PageTypeRegistry() {
    const pageTypes = [];
    this.register = function (name, {
      component,
      reduxModules = [],
      ...options
    }) {
      if (!component) {
        fail('Requires component option to be present');
      }
      if (!Array.isArray(reduxModules)) {
        fail('Expected reduxModules option to be an array.');
      }
      const sagas = [];
      const reducers = reduxModules.reduce((result, module) => {
        if (typeof module !== 'object' || new Set(Object.keys(module).concat(['name', 'reducers', 'saga'])).size != 3) {
          fail('Expected redux module to be object with name, reducers and saga properties at most.');
        }
        if (module.reducers && typeof module.reducers !== 'object') {
          fail(`Expected reducers property of ${module.name} reduxModule to be object.`);
        }
        if (module.saga) {
          sagas.push(module.saga);
        }
        return {
          ...result,
          ...module.reducers
        };
      }, {});
      pageTypes.push({
        name,
        component,
        reducer: Object.keys(reducers).length ? combineReducers(reducers) : undefined,
        saga: function* () {
          yield sagas.map(saga => saga());
        },
        ...options
      });
      function fail(message) {
        throw new Error(`${message} Check registerPageType call of ${name} page type.`);
      }
    };
    this.forEach = function (...args) {
      return pageTypes.forEach(...args);
    };
    this.reduce = function (...args) {
      return pageTypes.reduce(...args);
    };
    this.findByName = function (pageTypeName) {
      return pageTypes.find(({
        name,
        component
      }) => name == pageTypeName);
    };
  }

  const registry = new PageTypeRegistry();
  var registerPageType = registry.register;

  function registerPageTypeWithDefaultBackground (name, customPageType) {
    registerPageType(name, {
      component: PageBackgroundAsset$1,
      selectTargetElement(pageElement) {
        return pageElement.find('.page_background_asset')[0];
      },
      mixin: {
        scroller: true,
        ...customPageType
      },
      reduxModules: [pageBackgroundReduxModule]
    });
  }

  function WidgetTypeRegistry() {
    var widgetTypes = [];
    this.register = function (name, {
      component
    }) {
      widgetTypes.push({
        name,
        component
      });
    };
    this.findByName = function (widgetTypeName) {
      const result = widgetTypes.find(({
        name
      }) => name == widgetTypeName);
      if (!result) {
        throw `Widget type with name "${widgetTypeName}" not found.`;
      }
      return result;
    };
    this.forEach = function (...args) {
      widgetTypes.forEach(...args);
    };
  }

  const registry$1 = new WidgetTypeRegistry();
  var registerWidgetType = registry$1.register;

  /*global process*/
  function createStore$1 (reduxModules, options) {
    const sagaMiddleware = createSagaMiddleware();
    let sagas = [];
    let middlewares = [];
    if (!options.isServerSide) {
      ({
        sagas,
        middlewares
      } = createSagasAndMiddlewares(reduxModules, options));
    }
    const store = createStore(createReducer$1(reduxModules, options), {}, devToolsInDevelopment(applyMiddleware(sagaMiddleware, ...middlewares)));
    sagaMiddleware.run(function* () {
      yield sagas;
    });
    init(reduxModules, {
      ...options,
      dispatch: store.dispatch,
      getState: store.getState
    });
    return store;
  }
  function createReducer$1(reduxModules, options) {
    const reducers = reduxModules.reduce((result, reduxModule) => {
      return reduxModule.createReducers ? {
        ...result,
        ...reduxModule.createReducers(options)
      } : result;
    }, {});
    return Object.keys(reducers).length ? combineReducers(reducers) : (state, action) => state;
  }
  function createSagasAndMiddlewares(reduxModules, options) {
    const sagas = [];
    const middlewares = [];
    reduxModules.forEach(reduxModule => {
      let middleware;
      if (reduxModule.createMiddleware) {
        middleware = reduxModule.createMiddleware(options);
        middlewares.push(middleware);
      }
      if (reduxModule.createSaga) {
        sagas.push(call(reduxModule.createSaga({
          ...options,
          middleware
        })));
      }
    });
    return {
      sagas,
      middlewares
    };
  }
  function init(reduxModules, options) {
    reduxModules.forEach(reduxModule => {
      if (reduxModule.init) {
        reduxModule.init(options);
      }
    });
  }
  function devToolsInDevelopment(enhancer) {
    if ((typeof process === 'undefined' || "production" !== 'production') && typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined') {
      return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer);
    } else {
      return enhancer;
    }
  }

  const initialState = {
    muted: false
  };
  function backgroundMedia (state = initialState, action) {
    switch (action.type) {
      case MUTE:
        return {
          muted: true
        };
      case UNMUTE:
        return {
          muted: false
        };
      default:
        return state;
    }
  }

  function UnmuteButton(props) {
    const {
      t,
      muted,
      unmute
    } = props;
    if (muted) {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "background_media_unmute_button"
      }, /*#__PURE__*/React$1__default.createElement("a", {
        title: t('pageflow.public.mute_off'),
        onClick: () => {
          playUnmuteSound();
          unmute();
        },
        href: "#"
      }));
    } else {
      return null;
    }
  }
  function playUnmuteSound() {
    new pageflow.AudioPlayer([{
      src: pageflow.assetUrls.unmuteSound,
      type: 'audio/mpeg'
    }], {
      codecs: ['mp3']
    }).play();
  }
  function register() {
    registerWidgetType('unmute_button', {
      component: connect(combine$1({
        t: t$1,
        muted
      }), {
        unmute
      })(UnmuteButton)
    });
  }

  var backgroundMedia$1 = {
    init({
      isServerSide,
      events,
      dispatch
    }) {
      if (!isServerSide) {
        events.on('background_media:mute', page => dispatch(mute()));
        events.on('background_media:unmute', page => dispatch(unmute()));
      }
    },
    createReducers() {
      return {
        backgroundMedia
      };
    },
    createSaga: function ({
      backgroundMedia
    }) {
      return function* () {
        yield lib_7(UNMUTE, function* () {
          yield call(() => backgroundMedia.unmute());
        });
      };
    }
  };
  function registerWidgetTypes() {
    register();
  }

  function isCookieNoticeVisible(state) {
    return state.cookieNotice.visible;
  }

  function privacyLinkUrl(state) {
    return state.site.privacy_link_url;
  }

  const REQUEST = 'COOKIE_NOTICE_REQUEST';
  const DISMISS = 'COOKIE_NOTICE_DISMISS';
  function request() {
    return {
      type: REQUEST
    };
  }
  function dismiss() {
    return {
      type: DISMISS
    };
  }

  function CookieNoticeBar(props) {
    const {
      isCookieNoticeVisible,
      editing,
      t,
      dismiss
    } = props;
    if (isCookieNoticeVisible || editing) {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "cookie_notice_bar"
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "cookie_notice_bar-content"
      }, renderText(props), /*#__PURE__*/React$1__default.createElement("a", {
        className: "cookie_notice_bar-dismiss",
        onClick: dismiss
      }, t('pageflow.public.dismiss_cookie_notice'))));
    } else {
      return /*#__PURE__*/React$1__default.createElement("noscript", null);
    }
  }
  function renderText({
    privacyLinkUrl,
    t,
    locale
  }) {
    const text = t('pageflow.public.cookie_notice_html', {
      privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}`
    });
    return /*#__PURE__*/React$1__default.createElement("span", {
      className: "cookie_notice_bar-text",
      dangerouslySetInnerHTML: {
        __html: text
      }
    });
  }
  function register$1() {
    registerWidgetType('cookie_notice_bar', {
      component: connect(combine$1({
        isCookieNoticeVisible,
        privacyLinkUrl,
        editing: editingWidget({
          role: 'cookie_notice'
        }),
        t: t$1,
        locale
      }), {
        dismiss
      })(CookieNoticeBar)
    });
  }

  function createReducer$2 ({
    hasBeenDismissed
  }) {
    const initialState = {
      dismissed: hasBeenDismissed,
      visible: false
    };
    return function (state = initialState, action) {
      switch (action.type) {
        case REQUEST:
          if (!state.dismissed) {
            return {
              ...state,
              visible: true
            };
          }
          return state;
        case DISMISS:
          return {
            dismissed: true,
            visible: false
          };
        default:
          return state;
      }
    };
  }

  const COOKIE_KEY = 'cookie_notice_dismissed';
  var cookieNotice = {
    init({
      isServerSide,
      events,
      dispatch
    }) {
      if (!isServerSide) {
        events.on('cookie_notice:request', () => dispatch(request()));
      }
    },
    createReducers({
      cookies
    }) {
      return {
        cookieNotice: createReducer$2({
          hasBeenDismissed: cookies && cookies.hasItem(COOKIE_KEY)
        })
      };
    },
    createSaga: function ({
      widgetsApi,
      cookies
    }) {
      return function* () {
        yield lib_7(REQUEST, function* () {
          if (yield select(isCookieNoticeVisible)) {
            const resetWidgetMargin = yield cps(ensureWidgetMarginBottom, widgetsApi);
            yield take(DISMISS);
            yield call(resetWidgetMargin);
          }
        });
        yield lib_7(DISMISS, function* () {
          yield call(function () {
            cookies.setItem(COOKIE_KEY, true);
          });
        });
      };
    }
  };
  function ensureWidgetMarginBottom(widgetsApi, callback) {
    widgetsApi.use({
      name: 'cookie_notice_bar_visible',
      insteadOf: 'cookie_notice_bar'
    }, reset => callback(null, reset));
  }
  function registerWidgetTypes$1() {
    register$1();
  }

  var featuresModule = {
    createReducers({
      enabledFeatureNames
    }) {
      return {
        features: () => enabledFeatureNames
      };
    }
  };

  const INIT = 'SITE_INIT';
  function init$1(site) {
    return {
      type: INIT,
      payload: {
        site
      }
    };
  }

  function reducer (state = {}, action) {
    switch (action.type) {
      case INIT:
        return action.payload.site;
      default:
        return state;
    }
  }

  var siteModule = {
    init({
      site,
      dispatch
    }) {
      dispatch(init$1(site));
    },
    createReducers() {
      return {
        site: reducer
      };
    }
  };

  var storylinesModule = {
    init({
      storylines,
      dispatch
    }) {
      watch({
        collection: storylines,
        collectionName: 'storylines',
        dispatch,
        attributes: ['id'],
        includeConfiguration: true
      });
    },
    createReducers() {
      return {
        storylines: createCollectionReducer('storylines')
      };
    }
  };

  var chaptersModule = {
    init({
      chapters,
      dispatch
    }) {
      watch({
        collection: chapters,
        collectionName: 'chapters',
        dispatch,
        attributes: ['id', 'title', 'position', 'storyline_id']
      });
    },
    createReducers() {
      return {
        chapters: createCollectionReducer('chapters')
      };
    }
  };

  const INIT$1 = 'PAGE_TYPES_INIT';
  function init$2({
    pageTypes
  }) {
    return {
      type: INIT$1,
      payload: {
        pageTypes
      }
    };
  }

  function reducer$1 (state = {}, action) {
    switch (action.type) {
      case INIT$1:
        return action.payload.pageTypes;
      default:
        return state;
    }
  }

  var pageTypesModule = {
    createReducers() {
      return {
        pageTypes: reducer$1
      };
    },
    init({
      pageTypesSeed,
      dispatch
    }) {
      dispatch(init$2({
        pageTypes: camelize.deep(pageTypesSeed)
      }));
    }
  };

  const PAGE_CHANGE = 'CURRENT_PAGE_CHANGE';
  function pageChange({
    id
  }) {
    return {
      type: PAGE_CHANGE,
      payload: {
        id
      }
    };
  }

  function currentPageId (state = null, action) {
    switch (action.type) {
      case PAGE_CHANGE:
        return action.payload.id;
      default:
        return state;
    }
  }

  function watch$1 (events, dispatch) {
    events.on('page:change', page => dispatch(pageChange({
      id: page.getPermaId()
    })));
  }

  var currentModule = {
    init({
      isServerSide,
      events,
      dispatch
    }) {
      if (!isServerSide) {
        watch$1(events, dispatch);
      }
    },
    createReducers() {
      return {
        currentPageId
      };
    }
  };

  var filesModule = {
    init({
      files,
      dispatch
    }) {
      Object.keys(files).forEach(collectionName => {
        watch({
          collection: files[collectionName],
          collectionName: camelize(collectionName),
          dispatch,
          idAttribute: 'perma_id',
          attributes: ['id', 'perma_id', 'basename', 'processed_extension', 'variants', 'is_ready', 'parent_file_id', 'parent_file_model_type', 'width', 'height', 'duration_in_ms', 'rights', 'created_at'],
          includeConfiguration: true
        });
      });
    },
    createReducers({
      files,
      fileUrlTemplates = {},
      modelTypes = {}
    }) {
      fileUrlTemplates = camelize.keys(fileUrlTemplates);
      modelTypes = camelize.keys(modelTypes);
      return {
        files: combineReducers(Object.keys(files).reduce((result, collectionName) => {
          collectionName = camelize(collectionName);
          result[collectionName] = createCollectionReducer(collectionName, {
            idAttribute: 'permaId'
          });
          return result;
        }, {})),
        fileUrlTemplates: state => fileUrlTemplates,
        modelTypes: state => modelTypes
      };
    }
  };

  function reducer$2 (state = {}, action) {
    switch (action.type) {
      case LOAD:
        return action.payload.settings;
      default:
        return state;
    }
  }

  var settingsModule = {
    init({
      isServerSide,
      settings,
      dispatch
    }) {
      if (!isServerSide) {
        dispatch(load({
          settings: settings.toJSON()
        }));
        settings.on('change', () => dispatch(load({
          settings: settings.toJSON()
        })));
      }
    },
    createReducers() {
      return {
        settings: reducer$2
      };
    },
    createSaga({
      settings
    }) {
      return function* () {
        yield lib_7(UPDATE, function* (action) {
          yield call([settings, settings.set], action.payload.property, action.payload.value);
        });
      };
    }
  };

  const INIT$2 = 'I18N_INIT';
  function init$3({
    locale
  }) {
    return {
      type: INIT$2,
      payload: {
        locale
      }
    };
  }

  function reducer$3 (state = {}, action) {
    switch (action.type) {
      case INIT$2:
        return {
          locale: action.payload.locale
        };
      default:
        return state;
    }
  }

  var i18nModule = {
    createReducers() {
      return {
        i18n: reducer$3
      };
    },
    init({
      locale,
      dispatch
    }) {
      dispatch(init$3({
        locale
      }));
    }
  };

  const UPDATE$1 = 'ENTRY_UPDATE';
  const READY = 'ENTRY_READY';
  function update$1({
    entry
  }) {
    return {
      type: UPDATE$1,
      payload: {
        entry
      }
    };
  }
  function ready() {
    return {
      type: READY
    };
  }

  function reducer$4 (state = {}, action) {
    switch (action.type) {
      case UPDATE$1:
        return {
          ...state,
          ...action.payload.entry
        };
      case READY:
        return {
          ...state,
          isReady: true
        };
      default:
        return state;
    }
  }

  var entryModule = {
    init({
      entry,
      dispatch,
      events,
      isServerSide
    }) {
      if (!isServerSide) {
        events.once('ready', () => dispatch(ready()));
      }
      if (Backbone.Model && entry instanceof Backbone.Model) {
        watchModel({
          entry,
          dispatch
        });
      } else {
        loadFromSeed$1({
          entry,
          dispatch
        });
      }
    },
    createReducers() {
      return {
        entry: reducer$4
      };
    }
  };
  function watchModel({
    entry,
    dispatch
  }) {
    updateFromModel({
      entry,
      dispatch
    });
    entry.metadata.on('change:title', () => {
      updateFromModel({
        entry,
        dispatch
      });
    });
  }
  function updateFromModel({
    entry,
    dispatch
  }) {
    dispatch(update$1({
      entry: {
        slug: entry.get('slug'),
        title: entry.metadata.get('title') || entry.get('entry_title'),
        publishedAt: null
      }
    }));
  }
  function loadFromSeed$1({
    entry,
    dispatch
  }) {
    dispatch(update$1({
      entry: {
        slug: entry.slug,
        title: entry.title,
        publishedAt: entry.published_at
      }
    }));
  }

  var hotkeysModule = {
    init({
      isServerSide,
      window,
      getState,
      dispatch
    }) {
      if (isServerSide) {
        return;
      }
      window.addEventListener('keydown', event => {
        const currentPageId = getState().currentPageId;
        if (event.keyCode == SPACE) {
          dispatch(space({
            currentPageId
          }));
        } else if (event.keyCode == TAB) {
          dispatch(tab({
            currentPageId
          }));
        }
      });
    }
  };

  function watch$2 (hideText, dispatch) {
    hideText.on('activate', page => dispatch(activate()));
    hideText.on('deactivate', page => dispatch(deactivate()));
  }

  const initialState$1 = {
    isActive: false,
    hasBeenActive: false
  };
  function hideText (state = initialState$1, action) {
    switch (action.type) {
      case ACTIVATE:
        return {
          isActive: true,
          hasBeenActive: true
        };
      case DEACTIVATE:
        return {
          ...state,
          isActive: false
        };
      case PAGE_CHANGE:
        return {
          ...state,
          hasBeenActive: false
        };
      default:
        return state;
    }
  }

  var hideTextModule = {
    init({
      isServerSide,
      hideText,
      dispatch
    }) {
      if (!isServerSide) {
        watch$2(hideText, dispatch);
      }
    },
    createReducers() {
      return {
        hideText
      };
    }
  };

  var widgetsModule = {
    init({
      widgets,
      dispatch
    }) {
      watch({
        collection: widgets,
        collectionName: 'widgets',
        dispatch,
        attributes: ['role', 'type_name', 'editing'],
        includeConfiguration: true
      });
    },
    createReducers() {
      return {
        widgets: createCollectionReducer('widgets', {
          idAttribute: 'role'
        })
      };
    }
  };
  function createWidgetType(Component, store) {
    return {
      enhance: function (element) {
        ReactDOM.render( /*#__PURE__*/React.createElement(Provider, {
          store: store
        }, /*#__PURE__*/React.createElement(Component, null)), element[0]);
      }
    };
  }

  const LOAD$1 = 'WIDGETS_LOAD';
  function load$1({
    widgets
  }) {
    return {
      type: LOAD$1,
      payload: {
        widgets
      }
    };
  }

  function reducer$5 (state = {}, action) {
    switch (action.type) {
      case LOAD$1:
        return action.payload.widgets;
      default:
        return state;
    }
  }

  var widgetPresenceModule = {
    init({
      isServerSide,
      events,
      widgetsApi,
      dispatch
    }) {
      function update() {
        dispatch(load$1({
          widgets: {
            classicPlayerControls: widgetsApi.isPresent('classic_player_controls'),
            slimPlayerControls: widgetsApi.isPresent('slim_player_controls')
          }
        }));
      }
      if (!isServerSide) {
        events.on('widgets:update', update);
        update();
      }
    },
    createReducers() {
      return {
        widgetPresence: reducer$5
      };
    }
  };

  const INIT$3 = 'THEME_INIT';
  function init$4(payload) {
    return {
      type: INIT$3,
      payload
    };
  }

  function reducer$6 (state = {}, action) {
    switch (action.type) {
      case INIT$3:
        return action.payload;
      default:
        return state;
    }
  }

  var themeModule = {
    createReducers() {
      return {
        theme: reducer$6
      };
    },
    init({
      dispatch,
      isServerSide
    }) {
      if (!isServerSide) {
        const probe = document.getElementById('theme_probe-main_color');
        dispatch(init$4({
          mainColor: window.getComputedStyle(probe)['background-color']
        }));
      }
    }
  };

  function isConsentUIVisible(state) {
    return state.consent.uiVisible;
  }
  function requestedVendors(state) {
    return state.consent.requestedVendors;
  }

  function ToggleOnIcon (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxLeft: 60,
      viewBoxTop: 170,
      viewBoxWidth: 90,
      viewBoxHeight: 157
    }), /*#__PURE__*/React.createElement("path", {
      fill: "currentColor",
      d: "m 150.00015,296.99993 a 50,50 0 0 0 50.00004,-50.00005 50,50 0 0 0 -50.00004,-50.00004 H 50.000048 A 50,50 0 0 0 0,246.99988 50,50 0 0 0 50.000048,296.99993 Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "-150.0002",
      cy: "-246.99979",
      fill: "#fff",
      r: "40",
      transform: "scale(-1)"
    }), /*#__PURE__*/React.createElement("path", {
      fillOpacity: "0",
      stroke: "#fff",
      strokeWidth: "6",
      d: "M 87,227 50,264 34,246"
    }));
  }

  function ToggleOffIcon (props) {
    return /*#__PURE__*/React.createElement(Container$1, Object.assign({}, props, {
      viewBoxLeft: 60,
      viewBoxTop: 170,
      viewBoxWidth: 90,
      viewBoxHeight: 157
    }), /*#__PURE__*/React.createElement("path", {
      fill: "currentColor",
      d: "M 188.97656 744.56641 A 188.97638 188.97638 0 0 0 0 933.54297 A 188.97638 188.97638 0 0 0 188.97656 1122.5195 L 566.92969 1122.5195 A 188.97638 188.97638 0 0 0 755.90625 933.54297 A 188.97638 188.97638 0 0 0 566.92969 744.56641 L 188.97656 744.56641 z ",
      transform: "scale(0.26458333)"
    }), /*#__PURE__*/React.createElement("circle", {
      id: "path3721-7",
      cx: "50",
      cy: "247",
      fill: "#ffffff",
      r: "40"
    }), /*#__PURE__*/React.createElement("path", {
      fillOpacity: "0",
      stroke: "#fff",
      strokeWidth: "6",
      d: "m 110.10252,271.89748 49.79539,-49.79494"
    }), /*#__PURE__*/React.createElement("path", {
      fillOpacity: "0",
      stroke: "#fff",
      strokeWidth: "6",
      d: "M 159.89746,271.89748 110.10252,222.10209"
    }));
  }

  class Toggle extends React$1__default.Component {
    constructor(props) {
      super(props);
      this.state = {
        checked: props.defaultChecked
      };
      this.handleClick = this.onClick.bind(this);
    }
    onClick() {
      const checked = !this.state.checked;
      this.setState({
        checked
      });
      this.props.onChange({
        target: {
          checked
        }
      });
    }
    render() {
      const checked = this.state.checked;
      const Icon = checked ? ToggleOnIcon : ToggleOffIcon;
      return /*#__PURE__*/React$1__default.createElement("button", {
        id: this.props.id,
        className: this.props.className,
        role: "switch",
        "aria-checked": checked,
        onClick: this.handleClick
      }, /*#__PURE__*/React$1__default.createElement(Icon, {
        width: 50,
        height: 35
      }));
    }
  }

  class VendorList extends React$1__default.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.handleVendorInfoClick = this.onVendorInfoClick.bind(this);
    }
    onVendorInfoClick(vendorName) {
      this.setState({
        [vendorName]: !this.state[vendorName]
      });
    }
    render() {
      return /*#__PURE__*/React$1__default.createElement("div", {
        className: "consent_vendor_list"
      }, this.renderVendors());
    }
    renderVendors() {
      if (!this.props.vendors.length) {
        return /*#__PURE__*/React$1__default.createElement("div", {
          className: "consent_vendor_list-blank"
        }, this.props.t('pageflow.public.consent_no_vendors'));
      }
      return this.props.vendors.map(vendor => {
        const id = `consent_vendor_list-vendor_${vendor.name}`;
        return /*#__PURE__*/React$1__default.createElement("div", {
          key: id,
          className: "consent_vendor_list-vendor"
        }, /*#__PURE__*/React$1__default.createElement("label", {
          htmlFor: id
        }, vendor.displayName), /*#__PURE__*/React$1__default.createElement(Toggle, {
          id: id,
          className: "consent_vendor_list-toggle",
          defaultChecked: vendor.state === 'accepted',
          onChange: event => this.props.onVendorInputChange(vendor.name, event)
        }), /*#__PURE__*/React$1__default.createElement("button", {
          className: "consent_vendor_list-expand_vendor",
          title: this.props.t('pageflow.public.consent_expand_vendor'),
          onClick: () => this.handleVendorInfoClick(vendor.name)
        }, /*#__PURE__*/React$1__default.createElement(InfoIcon, {
          width: 20,
          height: 20
        })), this.renderVendorDescription(vendor));
      });
    }
    renderVendorDescription(vendor) {
      if (this.state[vendor.name]) {
        return /*#__PURE__*/React$1__default.createElement("p", {
          dangerouslySetInnerHTML: {
            __html: vendor.description
          }
        });
      } else {
        return null;
      }
    }
  }

  const REQUEST$1 = 'CONSENT_REQUEST';
  const DENY_ALL = 'CONSENT_DENY_ALL';
  const ACCEPT_ALL = 'CONSENT_ACCEPT_ALL';
  const SAVE = 'CONSENT_SAVE';
  function request$1({
    vendors
  }) {
    return {
      type: REQUEST$1,
      payload: {
        vendors
      }
    };
  }
  function denyAll() {
    return {
      type: DENY_ALL
    };
  }
  function acceptAll() {
    return {
      type: ACCEPT_ALL
    };
  }
  function save(vendors) {
    return {
      type: SAVE,
      payload: vendors
    };
  }

  class ConsentBar extends React$1__default.Component {
    constructor(props) {
      super(props);
      this.state = {
        checked: {}
      };
      this.handleSaveButtonClick = this.onSaveButtonClick.bind(this);
      this.handleAcceptAllButtonClick = this.onAcceptAllButtonClick.bind(this);
      this.handleDenyAllAllButtonClick = this.onDenyAllButtonClick.bind(this);
      this.handleVendorInputChange = this.onVendorInputChange.bind(this);
    }
    onSaveButtonClick() {
      if (this.props.editing) {
        return;
      }
      const signal = this.props.requestedVendors.reduce((result, {
        name
      }) => ({
        ...result,
        [name]: this.state.checked[name] || false
      }), {});
      this.props.save(signal);
    }
    onAcceptAllButtonClick() {
      if (!this.props.editing) {
        this.props.acceptAll();
      }
    }
    onDenyAllButtonClick() {
      if (!this.props.editing) {
        this.props.denyAll();
      }
    }
    onVendorInputChange(vendorName, event) {
      this.setState({
        checked: {
          ...this.state.checked,
          [vendorName]: event.target.checked
        }
      });
    }
    render() {
      const {
        editing,
        t,
        requestedVendors,
        visible
      } = this.props;
      if (visible || editing) {
        return /*#__PURE__*/React$1__default.createElement("div", {
          className: classnames('consent_bar', {
            'consent_bar-expanded': this.state.showVendorBox
          })
        }, /*#__PURE__*/React$1__default.createElement("div", {
          className: "consent_bar-content"
        }, renderText$1(this.props), /*#__PURE__*/React$1__default.createElement("div", {
          className: "consent_bar-vendor_box"
        }, /*#__PURE__*/React$1__default.createElement("h3", null, t('pageflow.public.consent_settings')), /*#__PURE__*/React$1__default.createElement(VendorList, {
          vendors: requestedVendors,
          t: t,
          onVendorInputChange: this.handleVendorInputChange
        }), /*#__PURE__*/React$1__default.createElement("button", {
          className: "consent_bar-save",
          onClick: this.handleSaveButtonClick
        }, t('pageflow.public.consent_save'))), /*#__PURE__*/React$1__default.createElement("div", {
          className: "consent_bar-buttons"
        }, /*#__PURE__*/React$1__default.createElement("button", {
          className: "consent_bar-configure",
          onClick: () => this.setState({
            showVendorBox: !this.state.showVendorBox
          })
        }, /*#__PURE__*/React$1__default.createElement(GearIcon, {
          width: 10,
          height: 10
        }), t('pageflow.public.consent_configure')), /*#__PURE__*/React$1__default.createElement("div", {
          className: "consent_bar-decision_buttons"
        }, /*#__PURE__*/React$1__default.createElement("button", {
          className: "consent_bar-deny_all",
          onClick: this.handleDenyAllAllButtonClick
        }, t('pageflow.public.consent_deny_all')), /*#__PURE__*/React$1__default.createElement("button", {
          className: "consent_bar-accept_all",
          onClick: this.handleAcceptAllButtonClick
        }, t('pageflow.public.consent_accept_all'))))));
      } else {
        return /*#__PURE__*/React$1__default.createElement("noscript", null);
      }
    }
  }
  function renderText$1({
    privacyLinkUrl,
    t,
    locale,
    requestedVendors
  }) {
    const vendorNames = requestedVendors.map(vendor => vendor.name).join(',');
    const text = t('pageflow.public.consent_prompt_html', {
      privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}&vendors=${vendorNames}#consent`
    });
    return /*#__PURE__*/React$1__default.createElement("span", {
      className: "consent_bar-text",
      dangerouslySetInnerHTML: {
        __html: text
      }
    });
  }
  function register$2() {
    registerWidgetType('consent_bar', {
      component: connect(combine$1({
        privacyLinkUrl,
        editing: editingWidget({
          role: 'cookie_notice'
        }),
        t: t$1,
        locale,
        requestedVendors,
        visible: isConsentUIVisible
      }), {
        acceptAll,
        denyAll,
        save
      })(ConsentBar)
    });
  }

  function Settings({
    consent,
    t,
    queryString
  }) {
    const vendors = consent.relevantVendors({
      include: vendorsFromQueryString(queryString)
    });
    return /*#__PURE__*/React$1__default.createElement("div", null, /*#__PURE__*/React$1__default.createElement(VendorList, {
      vendors: vendors,
      t: t,
      onVendorInputChange: handleInputChange
    }));
    function handleInputChange(vendorName, event) {
      event.target.checked ? consent.accept(vendorName) : consent.deny(vendorName);
    }
  }
  function vendorsFromQueryString(queryString) {
    const match = queryString && queryString.match(/vendors=([^&]+)/);
    if (match) {
      return match[1].split(',');
    }
    return [];
  }

  function createReducer$3 () {
    const initialState = {
      uiVisible: false,
      requestedVendors: []
    };
    return function (state = initialState, action) {
      switch (action.type) {
        case REQUEST$1:
          return {
            requestedVendors: action.payload.vendors,
            uiVisible: true
          };
        case ACCEPT_ALL:
          return {
            uiVisible: false
          };
        case DENY_ALL:
          return {
            uiVisible: false
          };
        case SAVE:
          return {
            uiVisible: false
          };
        default:
          return state;
      }
    };
  }

  var consentModule = {
    createReducers() {
      return {
        consent: createReducer$3()
      };
    },
    createSaga: function ({
      widgetsApi,
      consent
    }) {
      return function* () {
        const {
          acceptAll,
          denyAll,
          save,
          vendors
        } = yield call(() => consent.requested());
        yield put(request$1({
          vendors
        }));
        yield lib_7(ACCEPT_ALL, function () {
          acceptAll();
        });
        yield lib_7(DENY_ALL, function () {
          denyAll();
        });
        yield lib_7(SAVE, function (action) {
          save(action.payload);
        });
      };
    }
  };
  function registerWidgetTypes$2() {
    register$2();
  }

  function boot (pageflow) {
    const isEditor = !!pageflow.storylines;
    const isServerSide = !pageflow.settings;
    const seed = pageflow.seed;
    const collections = isEditor ? pageflow : seed;
    const options = {
      isServerSide,
      locale: seed.locale,
      entry: collections.entry,
      enabledFeatureNames: seed['enabled_feature_names'],
      fileUrlTemplates: seed['file_url_templates'],
      modelTypes: seed['file_model_types'],
      pageTypesSeed: seed['page_types'],
      pageTypes: registry,
      site: seed.site,
      files: collections.files || {},
      storylines: collections.storylines,
      chapters: collections.chapters,
      pages: collections.pages,
      widgets: isEditor ? pageflow.entry.widgets : seed.widgets,
      cookies: pageflow.cookies,
      hideText: pageflow.hideText,
      events: pageflow.events,
      settings: pageflow.settings,
      widgetsApi: pageflow.widgets,
      backgroundMedia: pageflow.backgroundMedia,
      consent: pageflow.consent,
      window: isServerSide ? null : window
    };
    const store = createStore$1([backgroundMedia$1, cookieNotice, featuresModule, i18nModule, siteModule, entryModule, currentModule, storylinesModule, chaptersModule, pagesModule, filesModule, settingsModule, hideTextModule, widgetsModule, widgetPresenceModule, pageTypesModule, hotkeysModule, themeModule, consentModule], options);
    if (!isServerSide) {
      registry.forEach(options => pageflow.pageType.register(options.name, createPageType({
        ...options,
        Component: options.component,
        store
      })));
      registry$1.forEach(({
        name,
        component
      }) => pageflow.widgetTypes.register(name, createWidgetType(component, store)));
    }
    return store;
  }

  const PageProvider$1 = createItemScopeProvider('pages');
  class ServerSidePage extends React$1__default.Component {
    componentWillMount() {
      this.store = boot({
        seed: this.props.resolverSeed
      });
      this.pageComponent = registry.findByName(this.props.pageType).component;
    }
    render(props) {
      const PageComponent = this.pageComponent;
      return /*#__PURE__*/React$1__default.createElement(Provider, {
        store: this.store
      }, /*#__PURE__*/React$1__default.createElement(PageProvider$1, {
        itemId: this.props.pageId
      }, /*#__PURE__*/React$1__default.createElement(PageComponent, null)));
    }
  }

  class ServerSideWidget extends React$1__default.Component {
    componentWillMount() {
      this.store = boot({
        seed: this.props.resolverSeed
      });
      this.widgetComponent = registry$1.findByName(this.props.widgetTypeName).component;
    }
    render(props) {
      const WidgetComponent = this.widgetComponent;
      return /*#__PURE__*/React$1__default.createElement(Provider, {
        store: this.store
      }, /*#__PURE__*/React$1__default.createElement(WidgetComponent, null));
    }
  }

  const PageProvider$2 = createItemScopeProvider('pages');
  class ServerSidePageBackgroundAsset extends React$1__default.Component {
    componentWillMount() {
      this.store = boot({
        seed: this.props.resolverSeed
      });
    }
    render(props) {
      return /*#__PURE__*/React$1__default.createElement(Provider, {
        store: this.store
      }, /*#__PURE__*/React$1__default.createElement(PageProvider$2, {
        itemId: this.props.pageId
      }, /*#__PURE__*/React$1__default.createElement(PageBackgroundAsset$1, null)));
    }
  }

  function AudioPage(props) {
    const playerControlsVariant = props.page.audioPlayerControlsVariant;
    return /*#__PURE__*/React.createElement(MediaPage$1, {
      className: "audio_page supports_text_position_center",
      page: props.page,
      file: props.audioFile,
      playerState: props.playerState,
      playerActions: props.playerActions,
      controlBarText: props.t('pageflow.public.start_audio'),
      playerControlsComponent: playerControlsComponent(playerControlsVariant),
      dynamicPageScrollerMargin: playerControlsVariant == 'waveform',
      autoplayWhenBackgroundMediaMuted: false
    }, /*#__PURE__*/React.createElement(PageBackgroundAsset$1, null), /*#__PURE__*/React.createElement(PlayerMediaContextProvider, {
      playbackMode: props.page.autoplay === false ? 'manual' : 'autoplay',
      playerDescription: "Audio Page Player"
    }, /*#__PURE__*/React.createElement(PageAudioFilePlayer, {
      file: props.audioFile,
      playerState: props.playerState,
      playerActions: props.playerActions,
      textTrackPosition: textTrackPosition$1(playerControlsVariant)
    })));
  }
  function playerControlsComponent(variant) {
    if (variant == 'waveform') {
      return WaveformPlayerControls$1;
    } else {
      return PlayerControls$1;
    }
  }
  function textTrackPosition$1(variant) {
    if (variant == 'waveform') {
      return 'top';
    }
  }
  function register$3() {
    registerPageType('audio', {
      component: connectInPage(combine$1({
        page: pageAttributes(),
        audioFile: file('audioFiles', {
          id: pageAttribute('audioFileId')
        }),
        playerState: playerState(),
        t: t$1
      }), combine({
        playerActions: playerActions()
      }))(AudioPage),
      reduxModules: [reduxModule({
        retryOnUnmute: true
      }), pageBackgroundReduxModule]
    });
  }

  function PlainPage(props) {
    const page = props.page;
    return /*#__PURE__*/React.createElement(PageWrapper, {
      className: "supports_text_position_center"
    }, /*#__PURE__*/React.createElement(MediaPageBackground, {
      page: page
    }), /*#__PURE__*/React.createElement(PageForeground, null, /*#__PURE__*/React.createElement(PageScroller$1, null, /*#__PURE__*/React.createElement(PageHeader, {
      page: page
    }), /*#__PURE__*/React.createElement(PagePrintImage$1, {
      page: page
    }), /*#__PURE__*/React.createElement(PageText, {
      page: page
    }))));
  }
  function register$4() {
    registerPageType('background_image', {
      component: connectInPage(combine$1({
        page: pageAttributes()
      }))(PlainPage),
      reduxModules: [pageBackgroundReduxModule]
    });
  }

  const qualities = ['auto', '4k', 'fullhd', 'medium'];
  function VideoPage(props) {
    return /*#__PURE__*/React.createElement(MediaPage$1, {
      className: "video_page supports_text_position_center",
      page: props.page,
      file: props.videoFile,
      qualities: qualities,
      playerState: props.playerState,
      playerActions: props.playerActions,
      controlBarText: props.t('pageflow.public.start_video'),
      autoplayWhenBackgroundMediaMuted: true
    }, /*#__PURE__*/React.createElement(PlayerMediaContextProvider, {
      playbackMode: props.page.autoplay === false ? 'manual' : 'autoplay',
      playerDescription: "Video Page Player"
    }, /*#__PURE__*/React.createElement(PageVideoPlayer, {
      page: props.page,
      playerState: props.playerState,
      playerActions: props.playerActions,
      fit: props.page.contain ? 'contain' : 'smart_contain'
    })), /*#__PURE__*/React.createElement(MobilePageVideoPoster$1, {
      page: props.page
    }));
  }
  function register$5() {
    registerPageType('video', {
      component: connectInPage(combine$1({
        page: pageAttributes(),
        videoFile: file('videoFiles', {
          id: pageAttribute('videoFileId')
        }),
        playerState: playerState(),
        t: t$1
      }), combine({
        playerActions: playerActions()
      }))(VideoPage),
      reduxModules: [reduxModule({
        hideControls: true,
        autoplayWhenBackgroundMediaMuted: true,
        playsInNativePlayer: has$3('native video player')
      })]
    });
  }

  function register$6() {
    register$4();
    register$5();
    register$3();
  }

  const inlineStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#3b5159'
  };
  class ClassicLoadingSpinner extends React$1__default.Component {
    constructor(props) {
      super(props);
      this.state = {
        fading: false,
        hidden: false
      };
    }
    componentDidMount() {
      if (PAGEFLOW_EDITOR) {
        this.setState({
          hidden: true
        });
        return;
      }
      this.fadeTimeout = setTimeout(() => {
        pageflow.ready.then(() => {
          this.setState({
            fading: true
          });
          this.hiddenTimeout = setTimeout(() => {
            this.setState({
              hidden: true
            });
          }, 1000);
        });
      }, 1000);
    }
    componentWillUnmount() {
      clearTimeout(this.fadeTimeout);
      clearTimeout(this.hiddenTimeout);
    }
    render() {
      const {
        editing
      } = this.props;
      const {
        hidden,
        fading
      } = this.state;
      if (editing || !hidden) {
        return /*#__PURE__*/React$1__default.createElement("div", {
          className: classnames('loading_spinner', {
            fade: !editing && fading
          }),
          onTouchMove: preventScrollBouncing,
          style: inlineStyle
        }, /*#__PURE__*/React$1__default.createElement("div", {
          className: "loading_inner"
        }, /*#__PURE__*/React$1__default.createElement("div", {
          className: "left_circle"
        }), /*#__PURE__*/React$1__default.createElement("div", {
          className: "right_circle"
        }), /*#__PURE__*/React$1__default.createElement("div", {
          className: "loading_spinner_inner"
        }, /*#__PURE__*/React$1__default.createElement("div", null))));
      } else {
        return /*#__PURE__*/React$1__default.createElement("noscript", null);
      }
    }
  }
  function preventScrollBouncing(e) {
    e.preventDefault();
  }
  function register$7() {
    registerWidgetType('classic_loading_spinner', {
      component: connect(combine$1({
        editing: editingWidget({
          role: 'loading_spinner'
        })
      }))(ClassicLoadingSpinner)
    });
  }

  class MediaLoadingSpinnerComponent extends React$1__default.Component {
    constructor(props) {
      super(props);
      this.state = {
        hidden: false,
        animating: false
      };
    }
    componentDidMount() {
      if (PAGEFLOW_EDITOR) {
        this.setState({
          hidden: true,
          animating: true
        });
      } else {
        this.setState({
          animating: true
        });
        pageflow.delayedStart.waitFor(resolve => {
          this.resolveDelayedStart = resolve;
        });
      }
    }
    hideOrLoop(el) {
      if (el.target === el.currentTarget) {
        if (PAGEFLOW_EDITOR) {
          this.setState({
            animating: false
          });
          setTimeout(() => {
            this.setState({
              animating: true
            });
          }, 1000);
        } else {
          this.setState({
            hidden: true
          });
          this.resolveDelayedStart();
        }
      }
    }
    componentWillUnmount() {
      clearTimeout(this.hiddenTimeout);
    }
    render() {
      const {
        editing
      } = this.props;
      const {
        hidden,
        animating
      } = this.state;
      var invert = getInvert(this.props);
      var logoElement = /*#__PURE__*/React$1__default.createElement("div", {
        className: classnames("media_loading_spinner-logo", {
          'media_loading_spinner-logo-invert': invert
        })
      });
      if (this.props.removeLogo) {
        logoElement = '';
      }
      if (editing || !hidden) {
        return /*#__PURE__*/React$1__default.createElement("div", {
          className: classnames('media_loading_spinner', {
            'media_loading_spinner-fade': animating
          }, {
            'media_loading_spinner-invert': invert
          }),
          onAnimationEnd: event => this.hideOrLoop(event),
          onTouchMove: preventScrollBouncing$1,
          style: inlineStyle$1(this.props)
        }, logoElement, /*#__PURE__*/React$1__default.createElement("div", {
          className: "media_loading_spinner-image",
          style: backgroundImageInlineStyles(this.props)
        }), this.props.children);
      } else {
        return /*#__PURE__*/React$1__default.createElement("noscript", null);
      }
    }
  }
  function preventScrollBouncing$1(e) {
    e.preventDefault();
  }
  function backgroundImageInlineStyles({
    firstPageBackgroundImageUrlMedium,
    firstPageBackgroundImageUrlLarge,
    backgroundImage,
    blurStrength,
    backgroundImageX,
    backgroundImageY
  }) {
    var backgroundPosition = {
      x: backgroundImageX != undefined ? backgroundImageX : 50,
      y: backgroundImageY != undefined ? backgroundImageY : 50
    };
    const url = blurStrength === 0 ? backgroundImage ? backgroundImage.urls.large : firstPageBackgroundImageUrlLarge : backgroundImage ? backgroundImage.urls.medium : firstPageBackgroundImageUrlMedium;
    if (url) {
      var style = {
        backgroundImage: `url("${url}")`,
        filter: 'blur(' + blurStrength + 'px)'
      };
      if (backgroundImage) {
        style.backgroundPosition = `${backgroundPosition.x}% ${backgroundPosition.y}%`;
      }
      return style;
    }
  }
  function getInvert(props) {
    if (!props.backgroundImage && props.invert == undefined) {
      return props.firstPageInvert;
    }
    return props.invert;
  }
  function inlineStyle$1(props) {
    const invert = getInvert(props);
    const animationDelay = props.animationDuration !== undefined ? props.animationDuration + 's' : undefined;
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100,
      backgroundColor: invert ? '#fff' : '#000',
      animationDelay
    };
  }
  const MediaLoadingSpinner = connect(combine$1({
    editing: editingWidget({
      role: 'loading_spinner'
    }),
    firstPageInvert: firstPageAttribute('invert'),
    firstPageBackgroundImageUrlMedium: pageBackgroundImageUrl({
      variant: 'medium',
      page: firstPageAttribures()
    }),
    firstPageBackgroundImageUrlLarge: pageBackgroundImageUrl({
      variant: 'large',
      page: firstPageAttribures()
    }),
    backgroundImage: file('imageFiles', {
      id: widgetAttribute('customBackgroundImageId', {
        role: 'loading_spinner'
      })
    }),
    backgroundImageX: widgetAttribute('customBackgroundImageX', {
      role: 'loading_spinner'
    }),
    backgroundImageY: widgetAttribute('customBackgroundImageY', {
      role: 'loading_spinner'
    }),
    invert: widgetAttribute('invert', {
      role: 'loading_spinner'
    }),
    removeLogo: widgetAttribute('removeLogo', {
      role: 'loading_spinner'
    }),
    blurStrength: widgetAttribute('blurStrength', {
      role: 'loading_spinner'
    }),
    animationDuration: widgetAttribute('animationDuration', {
      role: 'loading_spinner'
    })
  }))(MediaLoadingSpinnerComponent);
  function register$8() {
    registerWidgetType('media_loading_spinner', {
      component: MediaLoadingSpinner
    });
  }

  class TitleLoadingSpinner extends React$1__default.Component {
    render() {
      const {
        title,
        subtitle,
        entryTitle
      } = this.props;
      const invert = getInvert(this.props);
      const animationDuration = this.props.animationDuration !== undefined ? this.props.animationDuration + 's' : undefined;
      return /*#__PURE__*/React$1__default.createElement(MediaLoadingSpinner, null, /*#__PURE__*/React$1__default.createElement("div", {
        className: classnames('media_loading_spinner-titles', {
          'media_loading_spinner-invert': invert
        }),
        style: {
          animationDuration
        }
      }, /*#__PURE__*/React$1__default.createElement("div", {
        className: "media_loading_spinner-title"
      }, title || entryTitle), /*#__PURE__*/React$1__default.createElement("div", {
        className: "media_loading_spinner-subtitle"
      }, subtitle)));
    }
  }
  function register$9() {
    registerWidgetType('title_loading_spinner', {
      component: connect(combine$1({
        firstPageInvert: firstPageAttribute('invert'),
        backgroundImage: file('imageFiles', {
          id: widgetAttribute('customBackgroundImageId', {
            role: 'loading_spinner'
          })
        }),
        entryTitle: entryAttribute('title'),
        title: widgetAttribute('title', {
          role: 'loading_spinner'
        }),
        subtitle: widgetAttribute('subtitle', {
          role: 'loading_spinner'
        }),
        removeLogo: widgetAttribute('removeLogo', {
          role: 'loading_spinner'
        }),
        invert: widgetAttribute('invert', {
          role: 'loading_spinner'
        }),
        animationDuration: widgetAttribute('animationDuration', {
          role: 'loading_spinner'
        })
      }))(TitleLoadingSpinner)
    });
  }

  function registerWidgetTypes$3() {
    register$7();
    register$9();
    register$8();
  }

  register$6();
  registerWidgetTypes$1();
  registerWidgetTypes$2();
  registerWidgetTypes();
  registerWidgetTypes$3();
  if (pageflow$1.events) {
    pageflow$1.events.on('seed:loaded', () => boot(pageflow$1));
  }
  var index$1 = {
    components: {
      ConsentSettings: Settings,
      MediaPageBackground,
      PageWithInteractiveBackground: PageWithInteractiveBackground$1,
      ...components
    },
    actions,
    selectors,
    registerPageType,
    registerPageTypeWithDefaultBackground,
    registerWidgetType,
    mediaReduxModule: reduxModule,
    mediaPageBackgroundReduxModule: pageBackgroundReduxModule,
    pageWithInteractiveBackgroundReduxModule: reduxModule$1,
    iconMapping,
    SvgIcon: Container$1,
    classNames: classnames,
    connect,
    connectInPage,
    combineReducers,
    combine,
    ServerSidePage,
    ServerSideWidget,
    ServerSidePageBackgroundAsset
  };

  return index$1;

}(React, Backbone, ReactDOM, pageflow));
