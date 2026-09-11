this.pageflow_paged = this.pageflow_paged || {};
this.pageflow_paged.frontend = (function (exports, jqueryUi, $, Backbone, _, VideoJS, IScroll) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  VideoJS = VideoJS && VideoJS.hasOwnProperty('default') ? VideoJS['default'] : VideoJS;
  IScroll = IScroll && IScroll.hasOwnProperty('default') ? IScroll['default'] : IScroll;

  $.fn.updateTitle = function () {
    if (!this.data('title')) {
      this.data('title', this.attr('title'));
    }
    if (this.hasClass('active')) {
      this.attr('title', this.data('activeTitle'));
    } else {
      this.attr('title', this.data('title'));
    }
  };
  $.fn.loadLazyImages = function () {
    this.find('img[data-src]').each(function () {
      var img = $(this);
      if (!img.attr('src')) {
        img.attr('src', img.data('src'));
      }
    });
  };

  // Class-y constructor by github.com/opensas
  // https://github.com/jashkenas/backbone/issues/2601

  function BaseObject(options) {
    this.initialize.apply(this, arguments);
  }
  _.extend(BaseObject.prototype, Backbone.Events, {
    initialize: function (options) {}
  });

  // The self-propagating extend function that Backbone classes use.
  BaseObject.extend = Backbone.Model.extend;

  const EntryData = BaseObject.extend({
    getSiteOption: function (name) {
      throw 'Not implemented';
    },
    getFile: function (collectionName, id) {
      throw 'Not implemented';
    },
    getPageConfiguration: function (permaId) {
      throw 'Not implemented';
    },
    getPagePosition: function (permaId) {
      throw 'Not implemented';
    },
    getChapterConfiguration: function (id) {
      throw 'Not implemented';
    },
    getChapterPosition: function (id) {
      throw 'Not implemented';
    },
    getStorylineConfiguration: function (id) {
      throw 'Not implemented';
    },
    getChapterIdByPagePermaId: function (permaId) {
      throw 'Not implemented';
    },
    getStorylineIdByChapterId: function (permaId) {
      throw 'Not implemented';
    },
    getChapterPagePermaIds: function (id) {
      throw 'Not implemented';
    },
    getParentPagePermaIdByPagePermaId: function (permaId) {
      var storylineId = this.getStorylineIdByPagePermaId(permaId);
      return this.getParentPagePermaId(storylineId);
    },
    getStorylineIdByPagePermaId: function (permaId) {
      var chapterId = this.getChapterIdByPagePermaId(permaId);
      return this.getStorylineIdByChapterId(chapterId);
    },
    getParentStorylineId: function (storylineId) {
      var parentPagePermaId = this.getParentPagePermaId(storylineId);
      return parentPagePermaId && this.getStorylineIdByPagePermaId(parentPagePermaId);
    },
    getParentChapterId: function (chapterId) {
      var storylineId = this.getStorylineIdByChapterId(chapterId);
      var pagePermaId = this.getParentPagePermaId(storylineId);
      return pagePermaId && this.getChapterIdByPagePermaId(pagePermaId);
    },
    getParentPagePermaId: function (storylineId) {
      return this.getStorylineConfiguration(storylineId).parent_page_perma_id;
    },
    getStorylineLevel: function (storylineId) {
      var parentStorylineId = this.getParentStorylineId(storylineId);
      if (parentStorylineId) {
        return this.getStorylineLevel(parentStorylineId) + 1;
      } else {
        return 0;
      }
    },
    getPageAnalyticsData(permaId) {
      var chapterId = this.getChapterIdByPagePermaId(permaId);
      return {
        chapterIndex: this.getChapterPosition(chapterId),
        chapterTitle: this.getChapterConfiguration(chapterId)['title'],
        title: this.getPageConfiguration(permaId)['title'],
        index: this.getPagePosition(permaId)
      };
    }
  });

  const SeedEntryData = EntryData.extend({
    initialize: function (options) {
      this.theme = options.theme;
      this.files = _(_.keys(options.files || {})).reduce(function (memo, collectionName) {
        memo[collectionName] = _(options.files[collectionName]).reduce(function (result, file) {
          result[file.perma_id] = file;
          return result;
        }, {});
        return memo;
      }, {});
      this.storylineConfigurations = _(options.storylines).reduce(function (memo, storyline) {
        memo[storyline.id] = storyline.configuration;
        return memo;
      }, {});
      this.storylineIdsByChapterIds = _(options.chapters).reduce(function (memo, chapter) {
        memo[chapter.id] = chapter.storyline_id;
        return memo;
      }, {});
      this.chapterConfigurations = _.reduce(options.chapters, function (memo, chapter) {
        memo[chapter.id] = chapter.configuration;
        return memo;
      }, {});
      this.chapterPositions = _.reduce(options.chapters, function (memo, chapter, index) {
        memo[chapter.id] = index;
        return memo;
      }, {});
      this.chapterPagePermaIds = _(options.pages).reduce(function (memo, page) {
        memo[page.chapter_id] = memo[page.chapter_id] || [];
        memo[page.chapter_id].push(page.perma_id);
        return memo;
      }, {});
      this.chapterIdsByPagePermaIds = _(options.pages).reduce(function (memo, page) {
        memo[page.perma_id] = page.chapter_id;
        return memo;
      }, {});
      this.pageConfigurations = _.reduce(options.pages, function (memo, page) {
        memo[page.perma_id] = page.configuration;
        return memo;
      }, {});
      this.pagePositions = _.reduce(options.pages, function (memo, page, index) {
        memo[page.perma_id] = index;
        return memo;
      }, {});
    },
    getSiteOption: function (name) {
      return this.theme[name];
    },
    getFile: function (collectionName, permaId) {
      return this.files[collectionName][permaId];
    },
    getChapterConfiguration: function (id) {
      return this.chapterConfigurations[id] || {};
    },
    getChapterPosition: function (id) {
      return this.chapterPositions[id];
    },
    getChapterPagePermaIds: function (id) {
      return this.chapterPagePermaIds[id];
    },
    getPageConfiguration: function (permaId) {
      return this.pageConfigurations[permaId] || {};
    },
    getPagePosition: function (permaId) {
      return this.pagePositions[permaId];
    },
    getChapterIdByPagePermaId: function (permaId) {
      return this.chapterIdsByPagePermaIds[permaId];
    },
    getStorylineConfiguration: function (id) {
      return this.storylineConfigurations[id] || {};
    },
    getStorylineIdByChapterId: function (id) {
      return this.storylineIdsByChapterIds[id];
    }
  });

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var backboneEventsStandalone = createCommonjsModule(function (module, exports) {
  /**
   * Standalone extraction of Backbone.Events, no external dependency required.
   * Degrades nicely when Backone/underscore are already available in the current
   * global context.
   *
   * Note that docs suggest to use underscore's `_.extend()` method to add Events
   * support to some given object. A `mixin()` method has been added to the Events
   * prototype to avoid using underscore for that sole purpose:
   *
   *     var myEventEmitter = BackboneEvents.mixin({});
   *
   * Or for a function constructor:
   *
   *     function MyConstructor(){}
   *     MyConstructor.prototype.foo = function(){}
   *     BackboneEvents.mixin(MyConstructor.prototype);
   *
   * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
   * (c) 2013 Nicolas Perriault
   */
  /* global exports:true, define, module */
  (function() {
    var nativeForEach = Array.prototype.forEach,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        idCounter = 0;

    // Returns a partial implementation matching the minimal API subset required
    // by Backbone.Events
    function miniscore() {
      return {
        keys: Object.keys || function (obj) {
          if (typeof obj !== "object" && typeof obj !== "function" || obj === null) {
            throw new TypeError("keys() called on a non-object");
          }
          var key, keys = [];
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              keys[keys.length] = key;
            }
          }
          return keys;
        },

        uniqueId: function(prefix) {
          var id = ++idCounter + '';
          return prefix ? prefix + id : id;
        },

        has: function(obj, key) {
          return hasOwnProperty.call(obj, key);
        },

        each: function(obj, iterator, context) {
          if (obj == null) return;
          if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
          } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
              iterator.call(context, obj[i], i, obj);
            }
          } else {
            for (var key in obj) {
              if (this.has(obj, key)) {
                iterator.call(context, obj[key], key, obj);
              }
            }
          }
        },

        once: function(func) {
          var ran = false, memo;
          return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
          };
        }
      };
    }

    var _ = miniscore(), Events;

    // Backbone.Events
    // ---------------

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    Events = {

      // Bind an event to a `callback` function. Passing `"all"` will bind
      // the callback to all events fired.
      on: function(name, callback, context) {
        if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
      },

      // Bind an event to only be triggered a single time. After the first time
      // the callback is invoked, it will be removed.
      once: function(name, callback, context) {
        if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        var once = _.once(function() {
          self.off(name, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
      },

      // Remove one or many callbacks. If `context` is null, removes all
      // callbacks with that function. If `callback` is null, removes all
      // callbacks for the event. If `name` is null, removes all bound
      // callbacks for all events.
      off: function(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
        if (!name && !callback && !context) {
          this._events = {};
          return this;
        }

        names = name ? [name] : _.keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
          name = names[i];
          if (events = this._events[name]) {
            this._events[name] = retain = [];
            if (callback || context) {
              for (j = 0, k = events.length; j < k; j++) {
                ev = events[j];
                if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                    (context && context !== ev.context)) {
                  retain.push(ev);
                }
              }
            }
            if (!retain.length) delete this._events[name];
          }
        }

        return this;
      },

      // Trigger one or many events, firing all bound callbacks. Callbacks are
      // passed the same arguments as `trigger` is, apart from the event name
      // (unless you're listening on `"all"`, which will cause your callback to
      // receive the true name of the event as the first argument).
      trigger: function(name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, arguments);
        return this;
      },

      // Tell this object to stop listening to either specific events ... or
      // to every object it's currently listening to.
      stopListening: function(obj, name, callback) {
        var listeners = this._listeners;
        if (!listeners) return this;
        var deleteListener = !name && !callback;
        if (typeof name === 'object') callback = this;
        if (obj) (listeners = {})[obj._listenerId] = obj;
        for (var id in listeners) {
          listeners[id].off(name, callback, this);
          if (deleteListener) delete this._listeners[id];
        }
        return this;
      }

    };

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function(obj, action, name, rest) {
      if (!name) return true;

      // Handle event maps.
      if (typeof name === 'object') {
        for (var key in name) {
          obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
      }

      // Handle space separated event names.
      if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
          obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
      }

      return true;
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function(events, args) {
      var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
      switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
      }
    };

    var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to.
    _.each(listenMethods, function(implementation, method) {
      Events[method] = function(obj, name, callback) {
        var listeners = this._listeners || (this._listeners = {});
        var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
        listeners[id] = obj;
        if (typeof name === 'object') callback = this;
        obj[implementation](name, callback, this);
        return this;
      };
    });

    // Aliases for backwards compatibility.
    Events.bind   = Events.on;
    Events.unbind = Events.off;

    // Mixin utility
    Events.mixin = function(proto) {
      var exports = ['on', 'once', 'off', 'trigger', 'stopListening', 'listenTo',
                     'listenToOnce', 'bind', 'unbind'];
      _.each(exports, function(name) {
        proto[name] = this[name];
      }, this);
      return proto;
    };

    // Export Events as BackboneEvents depending on current context
    {
      if ( module.exports) {
        exports = module.exports = Events;
      }
      exports.BackboneEvents = Events;
    }
  })();
  });
  var backboneEventsStandalone_1 = backboneEventsStandalone.BackboneEvents;

  var backboneEventsStandalone$1 = backboneEventsStandalone;

  class Persistence {
    constructor({
      cookies
    }) {
      this.cookies = cookies;
    }
    store(vendors, signal) {
      const vendorsByCookieName = vendors.reduce((sorted, vendor) => {
        const cookieName = vendor.cookieName;
        sorted[cookieName] = sorted[cookieName] || [];
        sorted[cookieName].push(vendor);
        return sorted;
      }, {});
      Object.entries(vendorsByCookieName).forEach(([cookieName, vendors]) => {
        const cookieDomain = vendors[0].cookieDomain;
        this.setCookie(cookieName, JSON.stringify(vendors.reduce((result, vendor) => {
          result[vendor.cookieKey || vendor.name] = signal === 'accepted' ? true : signal === 'denied' ? false : signal[vendor.name];
          return result;
        }, {})), cookieDomain);
      });
    }
    update(vendor, signal) {
      const content = this.cookies.getItem(vendor.cookieName);
      const flags = content ? JSON.parse(content) : {};
      this.setCookie(vendor.cookieName, JSON.stringify({
        ...flags,
        [vendor.cookieKey || vendor.name]: signal
      }), vendor.cookieDomain);
    }
    read(vendor) {
      const content = this.cookies.getItem(vendor.cookieName);
      const flags = content ? JSON.parse(content) : {};
      const flag = flags[vendor.cookieKey || vendor.name];
      return flag === true ? 'accepted' : flag === false ? 'denied' : 'undecided';
    }
    setCookie(name, value, domain) {
      if (domain && !window.location.hostname.match(new RegExp(`${domain}$`))) {
        domain = null;
      }
      this.cookies.setItem(name, value, {
        path: '/',
        domain,
        expires: Infinity,
        // Ensure cookie can be read iframe embed
        sameSite: 'None',
        secure: true
      });
    }
  }

  //  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
  const cookies = {
    getItem: function (sKey) {
      if (!sKey) {
        return null;
      }
      // eslint-disable-next-line no-useless-escape
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem(...args) {
      document.cookie = setItemCookieString(...args);
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey) {
        return false;
      }
      // eslint-disable-next-line no-useless-escape
      return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
    },
    keys: function () {
      // eslint-disable-next-line no-useless-escape
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };
  function setItemCookieString(key, value, expiresOrOptions, path, domain, secure) {
    if (expiresOrOptions && typeof expiresOrOptions === 'object' && expiresOrOptions.constructor !== Date) {
      return setItemCookieStringWithOptions(key, value, expiresOrOptions);
    } else {
      return setItemCookieStringWithOptions(key, value, {
        expires: expiresOrOptions,
        path,
        domain,
        secure
      });
    }
  }
  function setItemCookieStringWithOptions(key, value, {
    expires,
    path,
    domain,
    secure,
    sameSite
  }) {
    let expiresPart = "";
    if (expires) {
      switch (expires.constructor) {
        case Number:
          expiresPart = expires === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + expires;
          break;
        case String:
          expiresPart = "; expires=" + expires;
          break;
        case Date:
          expiresPart = "; expires=" + expires.toUTCString();
          break;
      }
    }
    return encodeURIComponent(key) + "=" + encodeURIComponent(value) + expiresPart + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (sameSite ? "; SameSite=" + sameSite : "") + (secure ? "; Secure" : "");
  }
  const supportedParadigms = ['external opt-out', 'opt-in', 'lazy opt-in', 'skip'];
  class Consent {
    constructor({
      cookies,
      inEditor
    }) {
      this.requestedPromise = new Promise(resolve => {
        this.requestedPromiseResolve = resolve;
      });
      this.vendors = [];
      this.persistence = new Persistence({
        cookies
      });
      this.emitter = {
        ...backboneEventsStandalone$1
      };
      this.inEditor = inEditor;
    }
    registerVendor(name, {
      displayName,
      description,
      paradigm,
      cookieName,
      cookieKey,
      cookieDomain
    }) {
      if (this.vendorRegistrationClosed) {
        throw new Error(`Vendor ${name} has been registered after ` + 'registration has been closed.');
      }
      if (!name.match(/^[a-z0-9-_]+$/i)) {
        throw new Error(`Invalid vendor name '${name}'. ` + 'Only letters, numbers, hyphens and underscores are allowed.');
      }
      if (supportedParadigms.indexOf(paradigm) < 0) {
        throw new Error(`unknown paradigm ${paradigm}`);
      }
      this.vendors.push({
        displayName,
        description,
        name,
        paradigm,
        cookieName: cookieName || 'pageflow_consent',
        cookieKey,
        cookieDomain
      });
    }
    closeVendorRegistration() {
      this.vendorRegistrationClosed = true;
      if (!this.getUndecidedOptInVendors().length) {
        this.triggerDecisionEvents();
        return;
      }
      const vendors = this.getRequestedVendors();
      this.requestedPromiseResolve({
        vendors: this.withState(vendors),
        acceptAll: () => {
          this.persistence.store(vendors, 'accepted');
          this.triggerDecisionEvents();
        },
        denyAll: () => {
          this.persistence.store(vendors, 'denied');
          this.triggerDecisionEvents();
        },
        save: vendorConsent => {
          this.persistence.store(vendors, vendorConsent);
          this.triggerDecisionEvents();
        }
      });
    }
    relevantVendors({
      include: additionalVendorNames
    } = {}) {
      return this.withState(this.vendors.filter(vendor => {
        return (additionalVendorNames === null || additionalVendorNames === void 0 ? void 0 : additionalVendorNames.includes(vendor.name)) || vendor.paradigm === 'opt-in' || vendor.paradigm === 'external opt-out' || vendor.paradigm === 'lazy opt-in' && this.persistence.read(vendor) !== 'undecided';
      }), {
        applyDefaults: true
      });
    }
    require(vendorName) {
      if (this.inEditor) {
        return Promise.resolve('fulfilled');
      }
      const vendor = this.findVendor(vendorName, 'require consent for');
      switch (vendor.paradigm) {
        case 'opt-in':
        case 'lazy opt-in':
          if (this.getUndecidedOptInVendors().length) {
            return new Promise(resolve => {
              this.emitter.once(`${vendor.name}:accepted`, () => resolve('fulfilled'));
              this.emitter.once(`${vendor.name}:denied`, () => resolve('failed'));
            });
          }
          if (this.persistence.read(vendor) === 'accepted') {
            return Promise.resolve('fulfilled');
          } else {
            return Promise.resolve('failed');
          }
        case 'external opt-out':
          if (this.persistence.read(vendor) === 'denied') {
            return Promise.resolve('failed');
          }
          return Promise.resolve('fulfilled');
        case 'skip':
          return Promise.resolve('fulfilled');
        default:
          // should not be used
          return null;
      }
    }
    requireAccepted(vendorName) {
      if (this.inEditor) {
        return Promise.resolve('fulfilled');
      }
      const vendor = this.findVendor(vendorName, 'require consent for');
      if (vendor.paradigm === 'opt-in' || vendor.paradigm === 'lazy opt-in') {
        if (this.getUndecidedOptInVendors().length || this.persistence.read(vendor) !== 'accepted') {
          return new Promise(resolve => {
            this.emitter.once(`${vendor.name}:accepted`, () => resolve('fulfilled'));
          });
        }
        return Promise.resolve('fulfilled');
      } else {
        return this.require(vendorName);
      }
    }
    requested() {
      return this.requestedPromise;
    }
    accept(vendorName) {
      const vendor = this.findVendor(vendorName, 'accept');
      this.persistence.update(vendor, true);
      this.emitter.trigger(`${vendor.name}:accepted`);
    }
    deny(vendorName) {
      const vendor = this.findVendor(vendorName, 'deny');
      this.persistence.update(vendor, false);
    }
    getRequestedVendors() {
      return this.vendors.filter(vendor => {
        return vendor.paradigm !== 'skip';
      });
    }
    getUndecidedOptInVendors() {
      return this.vendors.filter(vendor => {
        return vendor.paradigm === 'opt-in' && this.persistence.read(vendor) === 'undecided';
      });
    }
    triggerDecisionEvents() {
      this.vendors.filter(vendor => {
        return vendor.paradigm !== 'skip';
      }).forEach(vendor => {
        this.emitter.trigger(`${vendor.name}:${this.persistence.read(vendor)}`);
      });
    }
    findVendor(vendorName, actionForErrorMessage) {
      const vendor = this.vendors.find(vendor => vendor.name === vendorName);
      if (!vendor) {
        throw new Error(`Cannot ${actionForErrorMessage} unknown vendor "${vendorName}". ` + 'Consider using consent.registerVendor.');
      }
      return vendor;
    }
    withState(vendors, {
      applyDefaults
    } = {}) {
      return vendors.map(vendor => {
        const state = this.persistence.read(vendor);
        return {
          ...vendor,
          state: state === 'undecided' && applyDefaults ? this.getDefaultState(vendor) : state
        };
      });
    }
    getDefaultState(vendor) {
      if (vendor.paradigm === 'external opt-out') {
        return 'accepted';
      }
      return 'undecided';
    }
  }
  Consent.create = function () {
    const inEditor = typeof PAGEFLOW_EDITOR !== 'undefined' && PAGEFLOW_EDITOR;
    return new Consent({
      cookies,
      inEditor
    });
  };
  const log = function (text, options) {
    if (window.console && (debugMode() || options && options.force)) {
      window.console.log(text);
    }
  };
  const debugMode = function () {
    return window.location.href.indexOf('debug=true') >= 0;
  };
  const state = typeof window !== 'undefined' && window.pageflow || {};
  const assetUrls = state.assetUrls || {};
  const events = Object.assign({}, backboneEventsStandalone$1);

  /**
   * Detect browser via user agent. Use only if feature detection is not
   * an option.
   */
  const Agent = function (userAgent) {
    return {
      matchesSilk: function () {
        return matches(/\bSilk\b/);
      },
      matchesDesktopSafari: function (options) {
        if (options) {
          return this.matchesSafari() && !this.matchesMobilePlatform() && matchesMinVersion(/Version\/(\d+)/i, options.minVersion);
        } else {
          return this.matchesSafari() && !this.matchesMobilePlatform();
        }
      },
      matchesDesktopSafari9: function () {
        return this.matchesSafari9() && !this.matchesMobilePlatform();
      },
      matchesDesktopSafari10: function () {
        return this.matchesSafari10() && !this.matchesMobilePlatform();
      },
      matchesSafari9: function () {
        return this.matchesSafari() && matches(/Version\/9/i);
      },
      matchesSafari10: function () {
        return this.matchesSafari() && matches(/Version\/10/i);
      },
      matchesSafari11: function () {
        return this.matchesSafari() && matches(/Version\/11/i);
      },
      matchesSafari11AndAbove: function () {
        return this.matchesSafari() && matchesMinVersion(/Version\/(\d+)/i, 11);
      },
      matchesSafari: function () {
        // - Chrome also reports to be a Safari
        // - Safari does not report to be a Chrome
        // - Edge also reports to be a Safari, but also reports to be Chrome
        return matches(/Safari\//i) && !matches(/Chrome/i);
      },
      /**
       * Returns true on iOS Safari.
       * @return {boolean}
       */
      matchesMobileSafari: function ({
        osVersions
      } = {}) {
        var deviceMatchers = [/iPod/i, /iPad/i, /iPhone/i];
        if (osVersions) {
          return deviceMatchers.some(matcher => userAgent.match(matcher)) && osVersions.some(osVersion => userAgent.includes(osVersion.replace('.', '_')));
        } else {
          return matchesiPadSafari13AndAbove() || deviceMatchers.some(matcher => userAgent.match(matcher)) && !window.MSStream // IE exclusion from being detected as an iOS device;
          ;
        }
      },
      /**
       * Returns true on Android.
       * @return {boolean}
       */
      matchesAndroid: function () {
        return matches(/Android/i);
      },
      /**
       * Returns true on iOS or Android.
       * @return {boolean}
       */
      matchesMobilePlatform: function () {
        var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];
        return matchers.some(function (matcher) {
          return userAgent.match(matcher);
        }) || matchesiPadSafari13AndAbove();
      },
      /**
       * Returns true on Internet Explorser version 9, 10 and 11.
       * @return {boolean}
       */
      matchesIEUpTo11: function () {
        return userAgent.match(/Trident\//);
      },
      /**
       * Returns true in InApp browser of Facebook app.
       * @return {boolean}
       */
      matchesFacebookInAppBrowser: function () {
        return userAgent.match(/FBAN/) && userAgent.match(/FBAV/);
      },
      matchesDesktopChrome: function (options) {
        if (options) {
          return this.matchesChrome() && !this.matchesMobilePlatform() && matchesMinVersion(/Chrome\/(\d+)/i, options.minVersion);
        } else {
          return this.matchesChrome() && !this.matchesMobilePlatform();
        }
      },
      matchesDesktopFirefox: function (options) {
        if (options) {
          return this.matchesFirefox() && !this.matchesMobilePlatform() && matchesMinVersion(/Firefox\/(\d+)/i, options.minVersion);
        } else {
          return this.matchesFirefox() && !this.matchesMobilePlatform();
        }
      },
      matchesDesktopEdge: function (options) {
        if (options) {
          return this.matchesEdge() && !this.matchesMobilePlatform() && matchesMinVersion(/Edg\/(\d+)/i, options.minVersion);
        } else {
          return this.matchesEdge() && !this.matchesMobilePlatform();
        }
      },
      /**
      * Returns true on Google Chrome.
      * @return {boolean}
      */
      matchesChrome: function () {
        // - Edge also reports to be a Chrome
        return matches(/Chrome\//i) && !matches(/Edg/i);
      },
      /**
      * Returns true on Firefox.
      * @return {boolean}
      */
      matchesFirefox: function () {
        return matches(/Firefox\//i) && !matches(/Seamonkey/i);
      },
      /**
      * Returns true on Microsoft Edge.
      * @return {boolean}
      */
      matchesEdge: function () {
        return matches(/Edg\//i);
      }
    };
    function matches(exp) {
      return !!userAgent.match(exp);
    }
    function matchesMinVersion(exp, version) {
      var match = userAgent.match(exp);
      return match && match[1] && parseInt(match[1], 10) >= version;
    }

    //After ios13 update, iPad reports the same user string
    //as Safari on Dekstop MacOS.
    //At the time of this writing there are no other devices
    //with multi-touch support other than IOS/iPadOS
    //See: https://stackoverflow.com/a/58064481
    function matchesiPadSafari13AndAbove() {
      return agent.matchesSafari() && navigator.maxTouchPoints > 1 && navigator.platform === 'MacIntel';
    }
  };
  const agent = new Agent(typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr');

  /**
   * Browser feature detection.
   *
   * @since 0.9
   */
  const browser = function () {
    var tests = {},
      results = {},
      featureDetectionComplete = false;
    let readyPromiseResolve;
    let readyPromise = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
    });
    return {
      off: {},
      on: {},
      unset: {},
      /**
       * Add a feature test.
       *
       * @param name [String] Name of the feature. Can contain whitespace.
       * @param test [Function] A function that either returns `true` or
       *   `false` or a promise that resolves to `true` or `false`.
       * @memberof pageflow.browser
       */
      feature: function (name, test) {
        var s = name.replace(/ /g, '_');
        this.off[s] = function () {
          window.localStorage['override ' + name] = 'off';
          log('Feature off: ' + name, {
            force: true
          });
        };
        this.on[s] = function () {
          window.localStorage['override ' + name] = 'on';
          log('Feature on: ' + name, {
            force: true
          });
        };
        this.unset[s] = function () {
          window.localStorage.removeItem('override ' + name);
          log('Feature unset: ' + name, {
            force: true
          });
        };
        tests[name] = test;
      },
      /**
       * Check whether the browser has a specific feature. This method
       * may only be called after the `#ready` promise is resolved.
       *
       * @param name [String] Name of the feature.
       * @return [Boolean]
       * @memberof pageflow.browser
       */
      has: function (name) {
        if (!featureDetectionComplete) {
          throw 'Feature detection has not finished yet.';
        }
        if (results[name] === undefined) {
          throw 'Unknown feature "' + name + '".';
        }
        return results[name];
      },
      /**
       * A promise that is resolved once feature detection has finished.
       *
       * @return Promise
       * @memberof pageflow.browser
       */
      ready: function () {
        return readyPromise;
      },
      /** @api private */
      detectFeatures: function () {
        var promises = {};
        var asyncHas = function (name) {
          var runTest = function () {
            var value,
              underscoredName = name.replace(/ /g, '_');
            if (debugMode() && location.href.indexOf('&has=' + underscoredName) >= 0) {
              value = location.href.indexOf('&has=' + underscoredName + '_on') >= 0;
              log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
                force: true
              });
              return value;
            } else if ((debugMode() || window.PAGEFLOW_ALLOW_FEATURE_OVERRIDES) && window.localStorage && typeof window.localStorage['override ' + name] !== 'undefined') {
              value = window.localStorage['override ' + name] === 'on';
              log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
                force: true
              });
              return value;
            } else {
              return tests[name](asyncHas);
            }
          };
          promises[name] = promises[name] || Promise.all([runTest()]).then(a => {
            return a[0];
          });
          return promises[name];
        };
        asyncHas.not = function (name) {
          return asyncHas(name).then(function (result) {
            return !result;
          });
        };
        asyncHas.all = function /* arguments */
        () {
          return Promise.all(arguments).then(function (results) {
            return results.every(result => result);
          });
        };
        Promise.all(Object.keys(tests).map(function (name) {
          return asyncHas(name).then(function (result) {
            var cssClassName = name.replace(/ /g, '_');
            document.body.classList.toggle('has_' + cssClassName, !!result);
            document.body.classList.toggle('has_no_' + cssClassName, !result);
            results[name] = !!result;
          });
        })).then(() => {
          featureDetectionComplete = true;
          readyPromiseResolve();
        });
        return this.ready();
      }
    };
  }();
  browser.feature('broken ogg support', function () {
    // ogg is not supported on iOS < 18.4 and broken on iOS 18.4
    return agent.matchesMobileSafari();
  });
  browser.feature('autoplay support', function (has) {
    return !agent.matchesSafari11AndAbove() && !agent.matchesMobilePlatform();
  });

  // See https://developer.mozilla.org/de/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support

  browser.feature('css animations', function () {
    var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
      elm = document.createElement('div');
    if (elm.style.animationName !== undefined) {
      return true;
    }
    for (var i = 0; i < prefixes.length; i++) {
      if (elm.style[prefixes[i] + 'AnimationName'] !== undefined) {
        return true;
      }
    }
    return false;
  });

  // Facebook app displays a toolbar at the bottom of the screen on iOS
  // phone which hides parts of the browser viewport. Normally this is
  // hidden once the user scrolls, but since there is no native
  // scrolling in Pageflow, the bar stays and hides page elements like
  // the slim player controls.
  browser.feature('facebook toolbar', function (has) {
    return has.all(has('iphone platform'), agent.matchesFacebookInAppBrowser());
  });
  browser.feature('ie', function () {
    if (navigator.appName == 'Microsoft Internet Explorer') {
      return true;
    } else {
      return false;
    }
  });
  browser.feature('ios platform', function () {
    return agent.matchesMobileSafari();
  });
  browser.feature('iphone platform', function (has) {
    return has.all(has('ios platform'), has('phone platform'));
  });
  browser.feature('mobile platform', function () {
    return agent.matchesMobilePlatform();
  });
  browser.feature('phone platform', function () {
    var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /IEMobile/i];
    return matchers.some(function (matcher) {
      return navigator.userAgent.match(matcher) && window.innerWidth < 700;
    });
  });
  browser.feature('pushstate support', function () {
    return window.history && 'pushState' in window.history;
  });
  browser.feature('request animation frame support', function () {
    return 'requestAnimationFrame' in window || 'web';
  });
  browser.feature('touch support', function () {
    return 'ontouchstart' in window || /* Firefox on android */
    window.DocumentTouch && document instanceof window.DocumentTouch || /* > 0 on IE touch devices */
    navigator.maxTouchPoints;
  });
  browser.feature('rewrite video sources support', function () {
    // set from conditionally included script file
    return !state.ie9;
  });
  browser.feature('stop buffering support', function (has) {
    return has.not('mobile platform');
  });
  browser.feature('buffer underrun waiting support', function (has) {
    return has.not('mobile platform');
  });
  browser.feature('prebuffering support', function (has) {
    return has.not('mobile platform');
  });
  browser.feature('mp4 support only', function (has) {
    // - Silk does not play videos with hls source
    // - Desktop Safari 9.1 does not loop hls videos
    // - Desktop Safari 10 does not loop hls videos on El
    //   Capitan. Appears to be fixed on Sierra
    return agent.matchesSilk() || agent.matchesDesktopSafari9() || agent.matchesDesktopSafari10();
  });
  browser.feature('mse and native hls support', function (has) {
    return agent.matchesSafari() && !agent.matchesMobilePlatform();
  });
  browser.feature('native video player', function (has) {
    return has('iphone platform');
  });
  browser.feature('video scaling bug fixed by load', function (has) {
    // When reusing video elements for videos with different
    // resolutions, Safari gets confused and scales videos incorrectly -
    // drawing them to only cover a part of the element. This appears to
    // not happen when the video is loaded or played immediately after
    // changing the source. No longer reproducible in iOS 17.4.
    return agent.matchesMobileSafari({
      osVersions: ['17.0', '17.1', '17.2', '17.3']
    });
  });
  browser.feature('volume control support', function (has) {
    return has.not('ios platform');
  });
  browser.feature('audio context volume fading support', function () {
    return !agent.matchesDesktopSafari();
  });
  browser.agent = agent;
  browser.Agent = Agent;

  /**
   * Let plugins register functions which extend the editor or
   * slideshow with certain functionality when a named feature is
   * enabled.
   *
   * @alias pageflow.features
   * @since 0.9
   */
  class Features {
    /** @lends pageflow.features */

    /** @api private */
    constructor() {
      this.registry = {};
      this.enabledFeatureNames = [];
    }

    /**
     * `pageflow.features` has been renamed to `pageflow.browser`.
     * @deprecated
     */
    has( /* arguments */
    ) {
      return browser.has.apply(browser, arguments);
    }

    /**
     * Register a function to configure a feature when it is active.
     *
     * @param {String} scope - Name of the scope the passed function
     *   shall be called in.
     * @param name [String] Name of the feature
     * @param fn [Function] Function to call when the given feature
     *   is activate.
     */
    register(scope, name, fn) {
      this.registry[scope] = this.registry[scope] || {};
      this.registry[scope][name] = this.registry[scope][name] || [];
      this.registry[scope][name].push(fn);
    }

    /**
     * Check if a feature as been enabled.
     *
     * @param name [String]
     * @return [Boolean]
     */
    isEnabled(name) {
      return this.enabledFeatureNames.includes(name);
    }

    /** @api private */
    enable(scope, names) {
      var fns = this.registry[scope] || {};
      this.enabledFeatureNames = this.enabledFeatureNames.concat(names);
      names.forEach(function (name) {
        (fns[name] || []).forEach(function (fn) {
          fn();
        });
      });
    }
  }
  const features = new Features();
  const handleFailedPlay = function (player, options) {
    var originalPlay = player.play;
    player.play = function /* arguments */
    () {
      var result = originalPlay.apply(player, arguments);
      if (result && typeof result.catch !== 'undefined') {
        return result.catch(function (e) {
          if (e.name === 'NotAllowedError' && options.hasAutoplaySupport) {
            if (options.fallbackToMutedAutoplay) {
              player.muted(true);
              return originalPlay.apply(player, arguments).then(function () {
                player.trigger('playmuted');
              }, function () {
                player.trigger('playfailed');
              });
            } else {
              player.trigger('playfailed');
            }
          } else {
            log('Caught play exception for video.');
          }
        });
      }
      return result;
    };
  };
  const asyncPlay = function (player) {
    var originalPlay = player.play;
    var originalPause = player.pause;
    var intendingToPlay = false;
    var intendingToPause = false;
    player.play = function /* arguments */
    () {
      player.intendToPlay();
      return originalPlay.apply(player, arguments);
    };
    player.pause = function /* arguments */
    () {
      player.intendToPause();
      return originalPause.apply(player, arguments);
    };
    player.intendToPlay = function () {
      intendingToPlay = true;
      intendingToPause = false;
    };
    player.intendToPause = function () {
      intendingToPause = true;
      intendingToPlay = false;
    };
    player.intendingToPlay = function () {
      return intendingToPlay;
    };
    player.intendingToPause = function () {
      return intendingToPause;
    };
    player.ifIntendingToPause = function () {
      return promiseFromBoolean(intendingToPause);
    };
    player.ifIntendingToPlay = function () {
      return promiseFromBoolean(intendingToPlay);
    };
    function promiseFromBoolean(value) {
      return new Promise(function (resolve, reject) {
        if (value) {
          resolve();
        } else {
          reject('aborted');
        }
      });
    }
  };
  const hooks = function (player, hooks) {
    var originalPlay = player.play;
    player.updateHooks = newHooks => {
      hooks = newHooks;
    };
    player.play = function /* args */
    () {
      var args = arguments;
      player.trigger('beforeplay');
      player.intendToPlay();
      if (hooks.before) {
        return Promise.all([hooks.before()]).then(function () {
          return player.ifIntendingToPlay().then(function () {
            return originalPlay.apply(player, args);
          });
        });
      } else {
        return originalPlay.apply(player, args);
      }
    };
    if (player.afterHookListener) {
      player.off('pause', player.afterHookListener);
      player.off('ended', player.afterHookListener);
    }
    player.afterHookListener = () => {
      if (hooks.after) {
        hooks.after();
      }
    };
    player.on('pause', player.afterHookListener);
    player.on('ended', player.afterHookListener);
  };
  const volumeBinding = function (player, settings, options) {
    options = options || {};
    var originalPlay = player.play;
    var originalPause = player.pause;
    var volumeFactor = 'volumeFactor' in options ? options.volumeFactor : 1;
    player.play = function () {
      player.intendToPlay();
      player.volume(player.targetVolume());
      listenToVolumeSetting();
      return originalPlay.call(player);
    };
    player.playAndFadeIn = function (duration) {
      if (!player.paused() && !player.intendingToPause()) {
        return Promise.resolve();
      }
      player.intendToPlay();
      player.volume(0);
      return Promise.all([originalPlay.call(player)]).then(function () {
        listenToVolumeSetting();
        return player.ifIntendingToPlay().then(function () {
          return player.fadeVolume(player.targetVolume(), duration).then(null, function () {
            return Promise.resolve();
          });
        });
      });
    };
    player.pause = function () {
      stopListeningToVolumeSetting();
      originalPause.call(player);
    };
    player.fadeOutAndPause = function (duration) {
      if (player.paused() && !player.intendingToPlay()) {
        return Promise.resolve();
      }
      player.intendToPause();
      stopListeningToVolumeSetting();
      return player.fadeVolume(0, duration).then(function () {
        return player.ifIntendingToPause().then(function () {
          originalPause.call(player);
        });
      });
    };
    player.changeVolumeFactor = function (factor, duration) {
      volumeFactor = factor;
      return player.fadeVolume(player.targetVolume(), duration);
    };
    player.targetVolume = function () {
      return (options.ignoreVolumeSetting ? 1 : settings.get('volume')) * volumeFactor;
    };
    function listenToVolumeSetting() {
      player.on('dispose', stopListeningToVolumeSetting);
      settings.on('change:volume', onVolumeChange);
    }
    function stopListeningToVolumeSetting() {
      player.off('dispose', stopListeningToVolumeSetting);
      settings.off('change:volume', onVolumeChange);
    }
    function onVolumeChange(model, value) {
      player.fadeVolume(player.targetVolume(), 40);
    }
  };

  /**
   * Obtain the globally shared audio context. There can only be a
   * limited number of `AudioContext` objects in one page.
   *
   * @since 12.1
   */
  const audioContext = {
    /**
     * @returns [AudioContext]
     *   Returns `null` if web audio API is not supported or creating
     *   the context fails.
     */
    get: function () {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (typeof this._audioContext === 'undefined') {
        try {
          this._audioContext = AudioContext && new AudioContext();
        } catch (e) {
          this._audioContext = null;
          log('Failed to create AudioContext.', {
            force: true
          });
        }
      }
      return this._audioContext;
    }
  };
  const webAudio = function (player, audioContext) {
    var gainNode;
    var currentResolve;
    var currentTimeout;
    var currentValue = 1;
    var lastStartTime;
    var lastDuration;
    var lastStartValue;
    var allowedMinValue = 0.000001;
    if (audioContext.state === 'suspended') {
      events.on('background_media:unmute', function () {
        player.volume(currentValue);
      });
    }
    function tryResumeIfSuspended() {
      return new Promise(function (resolve, reject) {
        if (audioContext.state === 'suspended') {
          var maybePromise = audioContext.resume();
          if (maybePromise && maybePromise.then) {
            maybePromise.then(handlePromise);
          } else {
            setTimeout(handlePromise, 0);
          }
        } else {
          resolve();
        }
        function handlePromise() {
          if (audioContext.state === 'suspended') {
            reject();
          } else {
            resolve();
          }
        }
      });
    }
    player.volume = function (value) {
      if (typeof value !== 'undefined') {
        tryResumeIfSuspended().then(function () {
          ensureGainNode();
          cancel();
          currentValue = ensureInAllowedRange(value);
          gainNode.gain.setValueAtTime(currentValue, audioContext.currentTime);
        }, function () {
          currentValue = ensureInAllowedRange(value);
        });
      }
      return Math.round(currentValue * 100) / 100;
    };
    player.fadeVolume = function (value, duration) {
      return tryResumeIfSuspended().then(function () {
        ensureGainNode();
        cancel();
        recordFadeStart(duration);
        currentValue = ensureInAllowedRange(value);
        gainNode.gain.setValueAtTime(lastStartValue, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(currentValue, audioContext.currentTime + duration / 1000);
        return new Promise(function (resolve, reject) {
          currentResolve = resolve;
          currentTimeout = setTimeout(resolveCurrent, duration);
        });
      }, function () {
        currentValue = ensureInAllowedRange(value);
        return Promise.resolve();
      });
    };
    player.one('dispose', cancel);
    function ensureGainNode() {
      if (!gainNode) {
        gainNode = audioContext.createGain();
        var source = audioContext.createMediaElementSource(player.getMediaElement());
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
      }
    }
    function resolveCurrent() {
      clearTimeout(currentTimeout);
      currentResolve('done');
      currentTimeout = null;
      currentResolve = null;
    }
    function cancel() {
      if (currentResolve) {
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        clearTimeout(currentTimeout);
        currentResolve('cancelled');
        currentTimeout = null;
        currentResolve = null;
        updateCurrentValueFromComputedValue();
      }
    }
    function recordFadeStart(duration) {
      lastStartTime = audioContext.currentTime;
      lastStartValue = currentValue;
      lastDuration = duration;
    }
    function updateCurrentValueFromComputedValue() {
      // Firefox 54 on Ubuntu does not provide computed values when gain
      // was changed via one of the scheduling methods. Instead
      // gain.value always reports 1. Interpolate manually do determine
      // how far the fade was performed before cancel was called.
      if (gainNode.gain.value == 1) {
        var performedDuration = (audioContext.currentTime - lastStartTime) * 1000;
        var lastDelta = currentValue - lastStartValue;
        var performedFraction = lastDelta > 0 ? performedDuration / lastDuration : 1;
        currentValue = ensureInAllowedRange(lastStartValue + performedFraction * lastDelta);
      } else {
        currentValue = gainNode.gain.value;
      }
    }
    function ensureInAllowedRange(value) {
      return value < allowedMinValue ? allowedMinValue : value;
    }
  };
  const noop = function (player) {
    player.fadeVolume = function (value, duration) {
      return Promise.resolve();
    };
  };
  const interval = function (player) {
    const originalVolume = player.volume;
    let fadeVolumeResolve;
    let fadeVolumeInterval;
    player.volume = function (value) {
      if (typeof value !== 'undefined') {
        cancelFadeVolume();
      }
      return originalVolume.apply(player, arguments);
    };
    player.fadeVolume = function (value, duration) {
      cancelFadeVolume();
      return new Promise(function (resolve, reject) {
        const resolution = 10;
        const startValue = volume();
        const steps = duration / resolution;
        const leap = (value - startValue) / steps;
        if (value === startValue) {
          resolve();
        } else {
          fadeVolumeResolve = resolve;
          fadeVolumeInterval = setInterval(function () {
            volume(volume() + leap);
            if (volume() >= value && value >= startValue || volume() <= value && value <= startValue) {
              resolveFadeVolume();
            }
          }, resolution);
        }
      });
    };
    player.one('dispose', cancelFadeVolume);
    function volume( /* arguments */
    ) {
      return originalVolume.apply(player, arguments);
    }
    function resolveFadeVolume() {
      clearInterval(fadeVolumeInterval);
      fadeVolumeResolve('done');
      fadeVolumeInterval = null;
      fadeVolumeResolve = null;
    }
    function cancelFadeVolume() {
      if (fadeVolumeResolve) {
        fadeVolumeResolve('cancelled');
        fadeVolumeResolve = null;
      }
      if (fadeVolumeInterval) {
        clearInterval(fadeVolumeInterval);
        fadeVolumeInterval = null;
      }
    }
  };
  const volumeFading = function (player) {
    if (!browser.has('volume control support')) {
      return noop(player);
    } else if (browser.has('audio context volume fading support') && audioContext.get() && player.getMediaElement) {
      return webAudio(player, audioContext.get());
    } else {
      return interval(player);
    }
  };
  volumeFading.interval = interval;
  volumeFading.noop = noop;
  volumeFading.webAudio = webAudio;
  const loadWaiting = function (player) {
    var originalFadeVolume = player.fadeVolume;
    player.fadeVolume = function /* args */
    () {
      var args = arguments;
      return Promise.all([this.loadedPromise]).then(function () {
        return originalFadeVolume.apply(player, args);
      });
    };
  };
  class Settings {
    constructor() {
      this.attributes = {
        volume: 1
      };
      this.initialize();
    }
    get(attributeName) {
      return this.attributes[attributeName];
    }
    set(key, value) {
      let attrs;
      if (typeof key === 'object') {
        attrs = key;
      } else {
        (attrs = {})[key] = value;
      }
      for (const attr in attrs) {
        this.attributes[attr] = attrs[attr];
        this.trigger('change:' + attr);
      }
      this.trigger('change');
    }
    toJSON() {
      return {
        ...this.attributes
      };
    }
    initialize() {
      const storage = this.getLocalStorage();
      if (storage) {
        if (storage['pageflow.settings']) {
          try {
            this.set(JSON.parse(storage['pageflow.settings']));
          } catch (e) {
            log(e);
          }
        }
        this.on('change', function () {
          storage['pageflow.settings'] = JSON.stringify(this.attributes);
        });
      }
    }
    getLocalStorage() {
      try {
        return window.localStorage;
      } catch (e) {
        // Safari throws SecurityError when accessing window.localStorage
        // if cookies/website data are disabled.
        return null;
      }
    }
  }
  Object.assign(Settings.prototype, backboneEventsStandalone$1);
  const settings = new Settings();
  const mediaPlayer = {
    enhance: function (player, options) {
      handleFailedPlay(player, {
        hasAutoplaySupport: browser.has('autoplay support'),
        ...options
      });
      asyncPlay(player);
      if (options.hooks) {
        hooks(player, options.hooks);
      }
      if (options.volumeFading) {
        volumeFading(player);
        volumeBinding(player, settings, options);
      }
      if (options.loadWaiting) {
        loadWaiting(player);
      }
    }
  };
  mediaPlayer.handleFailedPlay = handleFailedPlay;
  mediaPlayer.volumeBinding = volumeBinding;
  mediaPlayer.volumeFading = volumeFading;
  mediaPlayer.loadWaiting = loadWaiting;
  mediaPlayer.hooks = hooks;
  mediaPlayer.asyncPlay = asyncPlay;

  // Replacement for Underscore's throttle, because scrolled entries
  // don't have Underscore anymore

  function throttle(func, timeFrame) {
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
  const mediaEvents = function (player, context) {
    function triggerMediaEvent(name) {
      events.trigger('media:' + name, {
        fileName: player.currentSrc,
        context: context,
        currentTime: player.position,
        duration: player.duration,
        volume: player.volume(),
        bitrate: 128000
      });
    }
    player.on('play', function () {
      triggerMediaEvent('play');
    });
    player.on('seeking', function () {
      triggerMediaEvent('seeking');
    });
    player.on('seeked', function () {
      triggerMediaEvent('seeked');
    });
    player.on('timeupdate', function () {
      triggerMediaEvent('timeupdate');
    });
    player.on('timeupdate', throttle(function () {
      triggerMediaEvent('timeupdate_throttled');
    }, 5000));
    player.on('pause', function () {
      triggerMediaEvent('pause');
    });
    player.on('ended', function () {
      triggerMediaEvent('ended');
    });
  };

  // Prevent audio play back when browser enters background on mobile
  // device. Use the face that timeupdate events continue to fire while
  // intervals no longer executed when the browser is in the background.
  const pauseInBackground = function (player) {
    var interval;
    var lastInterval;
    var resolution = 100;
    function startProbeInterval() {
      interval = setInterval(function () {
        lastInterval = new Date().getTime();
      }, resolution);
    }
    function stopProbeInterval() {
      clearInterval(interval);
      interval = null;
    }
    function pauseIfProbeIntervalHalted() {
      if (intervalHalted()) {
        player.pause();
      }
    }
    function intervalHalted() {
      return interval && lastInterval < new Date().getTime() - resolution * 5;
    }
    player.on('play', startProbeInterval);
    player.on('pause', stopProbeInterval);
    player.on('ended', stopProbeInterval);
    player.on('timeupdate', pauseIfProbeIntervalHalted);
  };

  /**
   * Calling seek before the media tag is ready causes InvalidState
   * exeption. If this happens, we wait for the next progress event and
   * retry. We resolve a promise once seeking succeeded.
   *
   * @api private
   */
  const seekWithInvalidStateHandling = function (player) {
    var originalSeek = player.seek;
    player.seek = function (time) {
      return retryOnProgress(function () {
        originalSeek.call(player, time);
      });
    };
    function retryOnProgress(fn) {
      var tries = 0;
      return new Promise(function (resolve, reject) {
        function tryOrWaitForProgress() {
          tries += 1;
          if (tries >= 50) {
            reject();
            return;
          }
          try {
            fn();
            resolve();
          } catch (e) {
            player.one('progress', tryOrWaitForProgress);
          }
        }
        tryOrWaitForProgress();
      });
    }
  };
  const rewindMethod = function (player) {
    /**
     * Seek to beginning of file. If already at the beginning do
     * nothing.
     *
     * @alias pageflow.AudioPlayer#rewind
     */
    player.rewind = function () {
      if (player.position > 0) {
        var result = player.seek(0);
        player.trigger('timeupdate', player.position, player.duration);
        return result;
      } else {
        return Promise.resolve();
      }
    };
  };
  const getMediaElementMethod = function (player) {
    player.getMediaElement = function () {
      return player.audio.audio;
    };
  };

  /**
   * Playing audio sources
   *
   * @param {Object[]} sources
   * List of sources for audio element.
   *
   * @param {string} sources[].type
   * Mime type of the audio.
   *
   * @param {string} sources[].src
   * Url of the audio.
   *
   * @class
   */
  const AudioPlayer = function (sources, options) {
    options = options || {};
    var codecMapping = {
      vorbis: 'audio/ogg',
      mp4: 'audio/mp4',
      mp3: 'audio/mpeg'
    };
    let readyResolve;
    let readyPromise = new Promise(function (resolve) {
      readyResolve = resolve;
    });
    let loadedResolve;
    let loadedPromise = new Promise(function (resolve) {
      loadedResolve = resolve;
    });
    var audio = new Audio5js({
      reusedTag: options.tag,
      swf_path: assetUrls.audioSwf,
      throw_errors: false,
      format_time: false,
      codecs: options.codecs || ['vorbis', 'mp4', 'mp3'],
      ready: readyResolve,
      loop: options.loop
    });
    audio.readyPromise = readyPromise;
    audio.loadedPromise = loadedPromise;
    audio.on('load', loadedResolve);
    if (options.mediaEvents) {
      mediaEvents(audio, options.context);
    }
    if (options.pauseInBackground && browser.has('mobile platform')) {
      pauseInBackground(audio);
    }
    mediaPlayer.enhance(audio, {
      loadWaiting: true,
      ...options
    });
    seekWithInvalidStateHandling(audio);
    rewindMethod(audio);
    getMediaElementMethod(audio);
    audio.src = function (sources) {
      readyPromise.then(function () {
        var source = (sources || []).find(function (source) {
          return codecMapping[audio.settings.player.codec] === source.type;
        });
        audio.load(source ? source.src : '');
      });
    };
    var originalLoad = audio.load;
    audio.load = function (src) {
      if (!src) {
        this.duration = 0;
      }
      this.currentSrc = src;
      this.position = 0;
      this.trigger('timeupdate', this.position, this.duration);
      originalLoad.apply(this, arguments);
    };
    var originalSeek = audio.seek;
    audio.seek = function () {
      if (this.currentSrc) {
        return originalSeek.apply(this, arguments);
      }
    };
    var originalPlay = audio.play;
    audio.play = function () {
      if (this.currentSrc) {
        originalPlay.apply(this, arguments);
      }
    };
    audio.paused = function () {
      return !audio.playing;
    };
    audio.src(sources);
    return audio;
  };
  AudioPlayer.fromAudioTag = function (element, options) {
    return new AudioPlayer(element.find('source').map(function () {
      return {
        src: this.getAttribute('src'),
        type: this.getAttribute('type')
      };
    }).get(), {
      tag: element[0],
      ...options
    });
  };
  AudioPlayer.fromScriptTag = function (element, options) {
    var sources = element.length ? JSON.parse(element.text()) : [];
    return new AudioPlayer(sources, options);
  };
  const Null = function () {
    this.playAndFadeIn = function () {
      return Promise.resolve();
    };
    this.fadeOutAndPause = function () {
      return Promise.resolve();
    };
    this.changeVolumeFactor = function () {
      return Promise.resolve();
    };
    this.play = function () {};
    this.pause = function () {};
    this.paused = function () {
      return true;
    };
    this.seek = function () {
      return Promise.resolve();
    };
    this.rewind = function () {
      return Promise.resolve();
    };
    this.formatTime = function () {};
    this.one = function (event, handler) {
      handler();
    };
  };
  Object.assign(Null.prototype, backboneEventsStandalone$1);
  AudioPlayer.mediaEvents = mediaEvents;
  AudioPlayer.Null = Null;
  AudioPlayer.seekWithInvalidStateHandling = seekWithInvalidStateHandling;
  AudioPlayer.rewindMethod = rewindMethod;
  AudioPlayer.pauseInBackground = pauseInBackground;
  if (typeof window !== 'undefined') {
    window.VIDEOJS_NO_DYNAMIC_STYLE = true;
  }
  const filterSources = function (playerElement) {
    if (playerElement.tagName.toLowerCase() !== 'video') {
      return playerElement;
    }
    var changed = false;
    if (browser.has('mp4 support only')) {
      // keep only mp4 source
      playerElement.querySelectorAll('source').forEach(source => {
        if (source.type !== 'video/mp4') {
          playerElement.removeChild(source);
        }
      });
      changed = true;
    } else if (browser.has('mse and native hls support')) {
      // remove dash source to ensure hls is used
      const dashSource = playerElement.querySelector('source[type="application/dash+xml"]');
      if (dashSource) {
        playerElement.removeChild(dashSource);
        changed = true;
      }
    }
    if (changed) {
      // the video tags initially in the dom are broken since they "saw"
      // the other sources. replace with clone
      var clone = playerElement.cloneNode(true);
      playerElement.replaceWith(clone);
      return clone;
    } else {
      return playerElement;
    }
  };
  const useSlimPlayerControlsDuringPhonePlayback = function (player) {
    var originalPlay = player.play;
    player.play = function () {
      if (browser.has('phone platform') && !browser.has('native video player')) {
        state.widgets.use({
          name: 'slim_player_controls',
          insteadOf: 'classic_player_controls'
        }, function (restoreWidgets) {
          player.one('pause', restoreWidgets);
        });
      }
      return originalPlay.apply(this, arguments);
    };
  };
  const prebuffering = function (player) {
    let prebufferPromiseReject;
    player.isBufferedAhead = function (delta, silent) {
      // video.js only gives us one time range starting from 0 here. We
      // still ask for the last time range to be on the safe side.
      var timeRanges = player.buffered();
      var currentBufferTime = timeRanges.end(timeRanges.length - 1);
      var desiredBufferTime = player.currentTime() + delta;
      if (player.duration()) {
        desiredBufferTime = Math.min(desiredBufferTime, Math.floor(player.duration()));
      }
      var result = currentBufferTime >= desiredBufferTime;
      if (!silent) {
        log('buffered ahead ' + delta + ': ' + result + ' (' + currentBufferTime + '/' + desiredBufferTime + ')');
      }
      return result;
    };
    player.prebuffer = function (options) {
      options = options || {};
      const delta = options.secondsToBuffer || 10;
      const secondsToWait = options.secondsToWait || 3;
      const interval = 200;
      const maxCount = secondsToWait * 1000 / interval;
      let count = 0;
      if (browser.has('prebuffering support')) {
        if (!player.isBufferedAhead(delta) && !player.prebufferPromise) {
          log('prebuffering video ' + player.src());
          player.prebufferPromise = new Promise((resolve, reject) => {
            prebufferPromiseReject = reject;
            wait();
            function wait() {
              setTimeout(function () {
                if (!player.prebufferPromise) {
                  return;
                }
                count++;
                if (player.isBufferedAhead(delta) || count > maxCount) {
                  log('finished prebuffering video ' + player.src());
                  resolve();
                  player.prebufferPromise = null;
                } else {
                  wait();
                }
              }, interval);
            }
          });
        }
      }
      return player.prebufferPromise ? player.prebufferPromise : Promise.resolve();
    };
    player.abortPrebuffering = function () {
      if (player.prebufferPromise) {
        log('ABORT prebuffering');
        prebufferPromiseReject('prebuffering aborted');
        player.prebufferPromise = null;
      }
    };
    var originalPause = player.pause;
    player.pause = function () {
      player.abortPrebuffering();
      return originalPause.apply(this, arguments);
    };
    player.one('dispose', function () {
      player.abortPrebuffering();
    });
  };
  const cueSettingsMethods = function (player) {
    /**
     * Specify the display position of text tracks. This method can also
     * be used to make VideoJS reposition the text tracks after the
     * margins of the text track display have been changed (e.g. to
     * translate text tracks when player controls are displayed).
     *
     * To force such an update, the passed string has to differ from the
     * previously passed string. You can append a dot and an arbitrary
     * string (e.g. `"auto.translated"`), to keep the current setting but
     * still force repositioning.
     *
     * On the other hand, it is possible to change the positioning but
     * have VideoJS apply the change only when the next cue is
     * displayed. This way we can prevent moving a cue that the user
     * might just be reading. Simply append the string `".lazy"`
     * (e.g. `"auto.lazy"`).
     *
     * @param {string} line
     *   Either `"top"` to move text tracks to the first line or
     *   `"auto"` to stick with automatic positioning, followed by a tag
     *   to either force or prevent immediate update.
     */
    player.updateCueLineSettings = function (line) {
      var components = line.split('.');
      var value = components[0];
      var command = components[1];
      value = value == 'top' ? 1 : value;
      var changed = false;
      Array.from(player.textTracks()).forEach(function (textTrack) {
        if (textTrack.mode == 'showing' && textTrack.cues) {
          for (var i = 0; i < textTrack.cues.length; i++) {
            if (textTrack.cues[i].line != value) {
              textTrack.cues[i].line = value;
              changed = true;
            }
          }
        }
      });

      // Setting `line` does not update display directly, but only when
      // the next cue is displayed. This is problematic, when we
      // reposition text tracks to prevent overlap with player
      // controls. Triggering the event makes VideoJS update positions.
      // Ensure display is also updated when the current showing text
      // track changed since the last call, i.e. `line` has been changed
      // for a cue even though the previous call had the same
      // parameters.
      if ((this.prevLine !== line || changed) && command != 'lazy') {
        var tech = player.tech({
          IWillNotUseThisInPlugins: true
        });
        tech && tech.trigger('texttrackchange');
      }
      this.prevLine = line;
    };
  };
  const getMediaElementMethod$1 = function (player) {
    player.getMediaElement = function () {
      var tech = player.tech({
        IWillNotUseThisInPlugins: true
      });
      return tech && tech.el();
    };
  };
  const mediaEvents$1 = function (player, context) {
    player.updateMediaEventsContext = function (newContext) {
      context = newContext;
    };
    player.triggerMediaAllocate = function () {
      if (context) {
        events.trigger('media:allocate', {
          ...mediaEventPayload(),
          element: player.getMediaElement()
        });
      }
    };
    player.triggerMediaRelease = function () {
      if (context) {
        events.trigger('media:release', {
          ...mediaEventPayload(),
          element: player.getMediaElement()
        });
      }
    };
    player.on('play', function () {
      triggerMediaEvent('play');
    });
    player.on('seeking', function () {
      triggerMediaEvent('seeking');
    });
    player.on('seeked', function () {
      triggerMediaEvent('seeked');
    });
    player.on('timeupdate', function () {
      triggerMediaEvent('timeupdate');
    });
    player.on('timeupdate', throttle(function () {
      triggerMediaEvent('timeupdate_throttled');
    }, 5000));
    player.on('pause', function () {
      triggerMediaEvent('pause');
    });
    player.on('ended', function () {
      triggerMediaEvent('ended');
    });
    function triggerMediaEvent(name) {
      if (context) {
        events.trigger('media:' + name, mediaEventPayload());
      }
    }
    function mediaEventPayload() {
      return {
        fileName: player.previousSrc || player.currentSrc(),
        context: context,
        currentTime: player.currentTime(),
        duration: player.duration(),
        volume: player.volume(),
        altText: player.getMediaElement().getAttribute('alt'),
        bitrate: 3500000
      };
    }
  };
  const bufferUnderrunWaiting = function (player) {
    var originalPause = player.pause;
    player.pause = function () {
      cancelWaiting();
      originalPause.apply(this, arguments);
    };
    function pauseAndPreloadOnUnderrun() {
      if (bufferUnderrun()) {
        pauseAndPreload();
      }
    }
    function bufferUnderrun() {
      return !player.isBufferedAhead(0.1, true) && !player.waitingOnUnderrun && !ignoringUnderruns();
    }
    function pauseAndPreload() {
      log('Buffer underrun');
      player.trigger('bufferunderrun');
      player.pause();
      player.waitingOnUnderrun = true;
      player.prebuffer({
        secondsToBuffer: 5,
        secondsToWait: 5
      }).then(function () {
        // do nothing if user aborted waiting by clicking pause
        if (player.waitingOnUnderrun) {
          player.waitingOnUnderrun = false;
          player.trigger('bufferunderruncontinue');
          player.play();
        }
      }, () => {});
    }
    function cancelWaiting() {
      if (player.waitingOnUnderrun) {
        player.ignoreUnderrunsUntil = new Date().getTime() + 5 * 1000;
        player.waitingOnUnderrun = false;
        player.trigger('bufferunderruncontinue');
      }
    }
    function ignoringUnderruns() {
      var r = player.ignoreUnderrunsUntil && new Date().getTime() < player.ignoreUnderrunsUntil;
      if (r) {
        log('ignoring underrun');
      }
      return r;
    }
    function stopListeningForProgress() {
      player.off('progress', pauseAndPreloadOnUnderrun);
    }
    if (browser.has('buffer underrun waiting support')) {
      player.on('play', function () {
        player.on('progress', pauseAndPreloadOnUnderrun);
      });
      player.on('pause', stopListeningForProgress);
      player.on('ended', stopListeningForProgress);
    }
  };
  const rewindMethod$1 = function (player) {
    /**
     * Seek to beginning of file. If already at the beginning do
     * nothing.
     *
     * @alias pageflow.VideoPlayer#rewind
     */
    player.rewind = function () {
      if (player.currentTime() > 0) {
        player.currentTime(0);
        player.trigger('timeupdate', player.currentTime(), player.duration());
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    };
  };
  const VideoPlayer = function (element, options) {
    options = options || {};
    element = filterSources(element);
    var player = VideoJS(element, options);
    if (options.useSlimPlayerControlsDuringPhonePlayback) {
      useSlimPlayerControlsDuringPhonePlayback(player);
    }
    prebuffering(player);
    cueSettingsMethods(player);
    getMediaElementMethod$1(player);
    rewindMethod$1(player);
    if (options.mediaEvents) {
      mediaEvents$1(player, options.context);
    }
    if (options.bufferUnderrunWaiting) {
      bufferUnderrunWaiting(player);
    }
    mediaPlayer.enhance(player, options);
    return player;
  };
  VideoPlayer.useSlimPlayerControlsDuringPhonePlayback = useSlimPlayerControlsDuringPhonePlayback;
  VideoPlayer.prebuffering = prebuffering;
  VideoPlayer.filterSources = filterSources;
  VideoPlayer.mediaEvents = mediaEvents$1;
  VideoPlayer.cueSettingsMethods = cueSettingsMethods;
  VideoPlayer.bufferUnderrunWaiting = bufferUnderrunWaiting;
  const createMediaPlayer = function (options) {
    let isAudio = options.tagName == 'AUDIO';
    const player = new VideoPlayer(options.mediaElement, {
      controlBar: false,
      loadingSpinner: false,
      bigPlayButton: false,
      errorDisplay: false,
      textTrackSettings: false,
      poster: options.poster,
      loop: options.loop,
      controls: options.controls,
      html5: {
        nativeCaptions: !isAudio && browser.has('iphone platform'),
        // Only used by pageflow-scrolled
        vhs: {
          useBandwidthFromLocalStorage: true,
          usePlayerObjectFit: true
        }
      },
      bufferUnderrunWaiting: true,
      fallbackToMutedAutoplay: !isAudio,
      ignoreVolumeSetting: true,
      volumeFading: true,
      hooks: {},
      mediaEvents: true,
      context: null
    });
    player.textTrackSettings = {
      getValues() {
        return {};
      }
    };
    player.playOrPlayOnLoad = function () {
      if (this.readyState() > 0) {
        player.play();
      } else {
        player.on('loadedmetadata', player.play);
      }
    };
    player.addClass('video-js');
    player.addClass('player');
    return player;
  };

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const BLANK_AUDIO_SRC = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBA' + 'AAAABAAEAIlYAAESsAAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAA==';
  const BLANK_VIDEO_SRC = 'data:video/mp4;base64,AAAAHGZ0eXBNNFYgAAACAG' + 'lzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARw' + 'AAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIE' + 'guMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3' + 'd3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYm' + 'xvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3' + 'JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbG' + 'lzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV' + '9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3Rocm' + 'VhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb2' + '5zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbn' + 'RfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcm' + 'M9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcH' + 'N0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYW' + 'xfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8m' + 'KAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4G' + 'SAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC' + '/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC' + '/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgC' + 'vAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAh' + 'kAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQ' + 'AAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAA' + 'AAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAA' + 'BAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobW' + 'RpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZG' + 'UAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAA' + 'AAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAA' + 'AAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAA' + 'ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFW' + 'dCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAA' + 'AAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2' + 'MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAA' + 'AACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAA' + 'oAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAA' + 'AAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABC' + 'UAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAA' + 'AFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAA' + 'AAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAA' + 'AAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAA' + 'AAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAA' + 'AAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAA' + 'AAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZA' + 'AAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAA' + 'AAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAA' + 'AAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAA' + 'IAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAA' + 'AACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAA' + 'EAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAA' + 'AAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAA' + 'IAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAA' + 'AAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAAD' + 'MAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAA' + 'AACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAA' + 'kAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAA' + 'AACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAA' + 'AAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAA' + 'AEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ' + '0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAA' + 'AAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYX' + 'ZmNTUuMzMuMTAw';
  const blankSources = {
    audio: {
      src: BLANK_AUDIO_SRC,
      type: 'audio/wav'
    },
    video: {
      src: BLANK_VIDEO_SRC,
      type: 'video/mp4'
    }
  };

  /** @const @enum {string} */
  const MediaType = {
    AUDIO: 'audio',
    VIDEO: 'video'
  };
  let elId = 0;

  /**
   * Media pool class handles the pool of Videojs media players
   */
  class MediaPool {
    constructor(options = {
      playerCount: 4
    }) {
      this.playerCount = options.playerCount;
      this.allocatedPlayers = {};
      this.unAllocatedPlayers = {};
      this.mediaFactory_ = {
        [MediaType.AUDIO]: () => {
          const audioEl = document.createElement('audio');
          audioEl.setAttribute('crossorigin', 'anonymous');
          return audioEl;
        },
        [MediaType.VIDEO]: () => {
          const videoEl = document.createElement('video');
          videoEl.setAttribute('crossorigin', 'anonymous');
          return videoEl;
        }
      };
    }
    allocatePlayer({
      playerType,
      playerId,
      playsInline,
      mediaEventsContextData,
      hooks,
      poster,
      loop = false,
      controls = false,
      altText,
      onRelease
    }) {
      let player = undefined;
      if (!this.unAllocatedPlayers[playerType]) {
        this.populateMediaPool_();
      }
      if (this.unAllocatedPlayers[playerType].length == 0) {
        this.freeOnePlayer(playerType);
      }
      player = this.unAllocatedPlayers[playerType].pop();
      if (player) {
        player.pause();
        player.getMediaElement().loop = loop;
        player.getMediaElement().setAttribute('alt', altText);
        player.poster(poster);
        player.controls(controls);
        if (playsInline) {
          player.playsinline(true);
        }
        player.updateHooks(hooks || {});
        player.updateMediaEventsContext(mediaEventsContextData);
        this.allocatedPlayers[playerType].push(player);
        player.playerId = playerId || this.allocatedPlayers[playerType].length;
        player.releaseCallback = onRelease;
        player.previousSrc = null;
        player.triggerMediaAllocate();
        return player;
      } else {
        console.log('no player found for allocation');
      }
    }
    freeOnePlayer(type) {
      this.unAllocatePlayer(this.allocatedPlayers[type][0]); // free up the first allocated player
    }
    unAllocatePlayer(player) {
      if (player) {
        player.triggerMediaRelease();
        let type = this.getMediaTypeFromEl(player.el());
        this.allocatedPlayers[type] = this.allocatedPlayers[type].filter(p => p != player);
        player.previousSrc = player.currentSrc();
        player.controls(false);
        player.getMediaElement().loop = false;
        player.playsinline(false);
        player.src(blankSources[type]);
        player.poster('');
        clearTextTracks(player);
        this.unAllocatedPlayers[type].push(player);
        if (player.releaseCallback) {
          player.releaseCallback();
          player.releaseCallback = null;
        }
        player.pause();
      }
    }
    blessAll(value) {
      if (this.unAllocatedPlayers[MediaType.AUDIO] == undefined || this.unAllocatedPlayers[MediaType.VIDEO] == undefined) {
        this.populateMediaPool_();
      }
      this.forEachMediaType(key => {
        this.allPlayersForType(MediaType[key]).forEach(player => {
          player.muted(value);
        });
      });
    }
    allPlayersForType(type) {
      if (this.unAllocatedPlayers[type]) {
        return [...this.unAllocatedPlayers[type], ...this.allocatedPlayers[type]];
      }
      return [];
    }
    getMediaTypeFromEl(mediaElement) {
      let tagName = mediaElement.tagName.toLowerCase();
      if (tagName == 'div') {
        tagName = mediaElement.children[0].tagName.toLowerCase();
      }
      return this.getMediaType(tagName);
    }
    getMediaType(tagName) {
      switch (tagName) {
        case 'audio':
          return MediaType.AUDIO;
        case 'video':
          return MediaType.VIDEO;
      }
    }
    forEachMediaType(callbackFn) {
      Object.keys(MediaType).forEach(callbackFn.bind(this));
    }
    createPlayer_(type, mediaEl) {
      mediaEl.setAttribute('pool-element', elId++);
      if (!this.unAllocatedPlayers[type]) {
        this.unAllocatedPlayers[type] = [];
        this.allocatedPlayers[type] = [];
      }
      let player = createMediaPlayer({
        mediaElement: mediaEl,
        tagName: type
      });
      mediaEl.setAttribute('src', blankSources[type].src);
      player.muted(true);
      this.unAllocatedPlayers[type].push(player);
      return player;
    }
    initializeMediaPool_(type, mediaElSeed) {
      const playerCount = typeof this.playerCount === 'function' ? this.playerCount(type) : this.playerCount;
      while (this.allPlayersForType(type).length < playerCount) {
        this.createPlayer_(type, mediaElSeed.cloneNode(true));
      }
    }
    populateMediaPool_() {
      this.forEachMediaType(key => {
        let type = MediaType[key];
        let mediaEl = this.mediaFactory_[type].call(this);
        this.initializeMediaPool_(type, mediaEl);
      });
    }
  }
  function clearTextTracks(player) {
    const tracks = player.textTracks();
    let i = tracks.length;
    while (i--) {
      player.removeRemoteTextTrack(tracks[i]);
    }
  }
  const media = {
    playerPool: new MediaPool({
      playerCount: () => features.isEnabled('large_player_pool') ? 10 : 4
    }),
    muteState: true,
    get muted() {
      return this.muteState;
    },
    mute: function (value) {
      this.muteState = value;
      this.playerPool.blessAll(value);
      this.trigger('change:muted', value);
    },
    getPlayer: function (fileSource, options) {
      options.playerType = options.tagName || MediaType.VIDEO;
      let player = this.playerPool.allocatePlayer(options);
      if (player) {
        player.muted(this.muteState);
        player.src(fileSource);
        if (options.textTrackSources) {
          options.textTrackSources.forEach(track => player.addRemoteTextTrack(track, true));
        }
        if (browser.has('video scaling bug fixed by load')) {
          player.load();
        }
        return player;
      }
    },
    releasePlayer: function (player) {
      if (player) {
        this.playerPool.unAllocatePlayer(player);
      }
    }
  };
  Object.assign(media, backboneEventsStandalone$1);

  /**
   * Play and fade between multiple audio files.
   *
   * @class
   */
  const MultiPlayer = function (pool, options) {
    if (options.crossFade && options.playFromBeginning) {
      throw 'pageflow.Audio.MultiPlayer: The options crossFade and playFromBeginning can not be used together at the moment.';
    }
    var current = new AudioPlayer.Null();
    var currentId = null;
    var that = this;

    /**
     * Continue playback.
     */
    this.resume = function () {
      return current.play();
    };

    /**
     * Continue playback with fade in.
     */
    this.resumeAndFadeIn = function () {
      return current.playAndFadeIn(options.fadeDuration);
    };
    this.seek = function (position) {
      return current.seek(position);
    };
    this.pause = function () {
      return current.pause();
    };
    this.paused = function () {
      return current.paused();
    };
    this.fadeOutAndPause = function () {
      return current.fadeOutAndPause(options.fadeDuration);
    };
    this.fadeOutIfPlaying = function () {
      if (current.paused()) {
        return Promise.resolve();
      } else {
        return current.fadeOutAndPause(options.fadeDuration);
      }
    };
    this.position = function () {
      return current.position;
    };
    this.duration = function () {
      return current.duration;
    };
    this.fadeTo = function (id) {
      return changeCurrent(id, function (player) {
        return player.playAndFadeIn(options.fadeDuration);
      });
    };
    this.play = function (id) {
      return changeCurrent(id, function (player) {
        return player.play();
      });
    };
    this.changeVolumeFactor = function (factor) {
      return current.changeVolumeFactor(factor, options.fadeDuration);
    };
    this.formatTime = function (time) {
      return current.formatTime(time);
    };
    function changeCurrent(id, callback) {
      if (!options.playFromBeginning && id === currentId && !current.paused()) {
        return Promise.resolve();
      }
      var player = pool.get(id);
      currentId = id;
      var fadeOutPromise = current.fadeOutAndPause(options.fadeDuration);
      if (current._stopMultiPlayerEventPropagation && current.paused()) {
        current._stopMultiPlayerEventPropagation();
      }
      return handleCrossFade(fadeOutPromise).then(function () {
        current = player;
        startEventPropagation(current, id);
        return handlePlayFromBeginning(player).then(function () {
          return callback(player);
        });
      });
    }
    function handleCrossFade(fadePomise) {
      if (options.crossFade) {
        return Promise.resolve();
      } else {
        return fadePomise;
      }
    }
    function handlePlayFromBeginning(player) {
      if (options.playFromBeginning || options.rewindOnChange) {
        return player.rewind();
      } else {
        return Promise.resolve();
      }
    }
    function startEventPropagation(player, id) {
      let playCallback = function () {
        that.trigger('play', {
          audioFileId: id
        });
      };
      let pauseCallback = function () {
        that.trigger('pause', {
          audioFileId: id
        });
        if (currentId !== id) {
          player._stopMultiPlayerEventPropagation();
        }
      };
      let timeUpdateCallback = function () {
        that.trigger('timeupdate', {
          audioFileId: id
        });
      };
      let endedCallback = function () {
        that.trigger('ended', {
          audioFileId: id
        });
      };
      let playFailedCallback = function () {
        that.trigger('playfailed', {
          audioFileId: id
        });
      };
      player.on('play', playCallback);
      player.on('pause', pauseCallback);
      player.on('timeupdate', timeUpdateCallback);
      player.on('ended', endedCallback);
      player.on('playfailed', playFailedCallback);
      player._stopMultiPlayerEventPropagation = function () {
        player.off('play', playCallback);
        player.off('pause', pauseCallback);
        player.off('timeupdate', timeUpdateCallback);
        player.off('ended', endedCallback);
        player.off('playfailed', playFailedCallback);
      };
    }
  };
  Object.assign(MultiPlayer.prototype, backboneEventsStandalone$1);
  const PlayerSourceIDMap = function (media, {
    playerOptions
  } = {}) {
    return {
      current: undefined,
      previous: undefined,
      mapSources: function (id, sources) {
        this[id] = sources;
      },
      get: function (sourceID) {
        if (!this[sourceID]) {
          return new AudioPlayer.Null();
        }
        if (this.current && this.current.playerId === sourceID) {
          return this.current;
        }
        if (this.previous && this.previous.playerId === sourceID) {
          let holder = this.current;
          this.current = this.previous;
          this.previous = holder;
        } else {
          if (this.previous) {
            media.releasePlayer(this.previous);
          }
          this.previous = this.current;
          this.current = media.getPlayer(this[sourceID], {
            filePermaId: sourceID,
            playerId: sourceID,
            ...playerOptions
          });
        }
        return this.current;
      }
    };
  };
  const PlayerPool = function (audio, options) {
    this.players = {};
    this.get = function (audioFileId) {
      this.players[audioFileId] = this.players[audioFileId] || audio.createPlayer(audioFileId, options);
      return this.players[audioFileId];
    };
    this.dispose = function () {
      this.players = {};
    };
  };

  /**
   * Playing audio files.
   * @alias pageflow.audio
   * @member
   */
  const Audio = function (options) {
    this.getSources = options.getSources || function (audioFileId) {
      return options.audioFiles[audioFileId] || '';
    };

    /**
     * Creates a player for the given audio file.
     *
     * @param {string|number} audioFileId
     *   Id of the audio file to play. The id can be of the form
     *   `"5.suffix"` to distinguish multiple occurences of the same
     *   audio file for example inside a pageflow.Audio.PlayerPool;
     *
     * @param {Object} [options]
     *   Options to pass on player creation
     *
     * @static
     */
    this.createPlayer = function (audioFileId, options) {
      var sources = this.getSources(removeSuffix(audioFileId));
      if (sources) {
        return new AudioPlayer(sources, {
          volumeFading: true,
          ...options
        });
      } else {
        return new AudioPlayer.Null();
      }
    };

    /**
     * Create a `MultiPlayer` to play and fade between multiple audio
     * files.
     *
     * @param {Object} [options]
     *   All options supported by pageflow.AudioPlayer can be passed.
     *
     * @param {number} [options.fadeDuration]
     *   Time in milliseconds to fade audios in and out.
     *
     * @param {boolean} [options.playFromBeginning=false]
     *   Always restart audio files from the beginning.
     *
     * @param {boolean} [options.rewindOnChange=false]
     *   Play from beginning when changing audio files.
     *
     * @return {pageflow.Audio.MultiPlayer}
     */
    this.createMultiPlayer = function (options) {
      return new MultiPlayer(new PlayerPool(this, options), options);
    };
    function removeSuffix(id) {
      if (!id) {
        return id;
      }
      return parseInt(id.toString().split('.')[0], 10);
    }
  };
  Audio.setup = function (options) {
    state.audio = new Audio(options);
  };
  Audio.PlayerPool = PlayerPool;
  let isEventAdded = false;
  let callbacks = [];
  let muteInBackground = () => {
    callbacks.forEach(cb => {
      cb(document.visibilityState);
    });
  };
  function documentHiddenState(callback) {
    callbacks.push(callback);
    if (!isEventAdded) {
      isEventAdded = true;
      document.addEventListener('visibilitychange', muteInBackground, false);
    }
    return {
      removeCallback: () => {
        callbacks = callbacks.filter(c => c !== callback);
      }
    };
  }
  const consent = Consent.create();

  /**
   * Mute feature settings for background media (ATMO and background videos)
   *
   * @since 13.0
   */
  const backgroundMedia = {
    muted: false,
    unmute: function () {
      if (this.muted) {
        this.muted = false;
        events.trigger('background_media:unmute');
      }
    },
    mute: function () {
      if (!this.muted) {
        this.muted = true;
        events.trigger('background_media:mute');
      }
    }
  };

  const bandwidth = function () {
    var maxLoadTime = 5000;
    bandwidth.promise = bandwidth.promise || new $.Deferred(function (deferred) {
      var smallFileUrl = assetUrls.smallBandwidthProbe + "?" + new Date().getTime(),
        largeFileUrl = assetUrls.largeBandwidthProbe + "?" + new Date().getTime(),
        smallFileSize = 165,
        largeFileSize = 1081010;
      $.when(timeFile(smallFileUrl), timeFile(largeFileUrl)).done(function (timeToLoadSmallFile, timeToLoadLargeFile) {
        var timeDelta = (timeToLoadLargeFile - timeToLoadSmallFile) / 1000;
        var bitsDelta = (largeFileSize - smallFileSize) * 8;
        timeDelta = Math.max(timeDelta, 0.01);
        deferred.resolve({
          durationInSeconds: timeDelta,
          speedInBps: (bitsDelta / timeDelta).toFixed(2)
        });
      }).fail(function () {
        deferred.resolve({
          durationInSeconds: Infinity,
          speedInBps: 0
        });
      });
    }).promise();
    return bandwidth.promise;
    function timeFile(url) {
      var startTime = new Date().getTime();
      return withTimeout(loadFile(url), maxLoadTime).pipe(function () {
        return new Date().getTime() - startTime;
      });
    }
    function loadFile(url, options) {
      return new $.Deferred(function (deferred) {
        var image = new Image();
        image.onload = deferred.resolve;
        image.onerror = deferred.reject;
        image.src = url;
      }).promise();
    }
    function withTimeout(promise, milliseconds) {
      return new $.Deferred(function (deferred) {
        var timeout = setTimeout(function () {
          deferred.reject();
        }, milliseconds);
        promise.always(function () {
          clearTimeout(timeout);
        }).then(deferred.resolve, deferred.reject);
      }).promise();
    }
  };

  browser.feature('high bandwidth', function () {
    return bandwidth().pipe(function (result) {
      var isHigh = result.speedInBps > 8000 * 1024;
      if (window.console) {
        window.console.log('Detected bandwidth ' + result.speedInBps / 8 / 1024 + 'KB/s. High: ' + (isHigh ? 'Yes' : 'No'));
      }
      return isHigh;
    });
  });

  const preload = {
    image: function (url) {
      return $.Deferred(function (deferred) {
        var image = new Image();
        image.onload = deferred.resolve;
        image.onerror = deferred.resolve;
        image.src = url;
      }).promise();
    },
    backgroundImage: function (element) {
      var that = this;
      var promises = [];
      $(element).addClass('load_image');
      $(element).each(function () {
        var propertyValue = window.getComputedStyle(this).getPropertyValue('background-image');
        if (propertyValue.match(/^url/)) {
          promises.push(that.image(propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')));
        }
      });
      return $.when.apply(null, promises);
    }
  };

  const state$1 = window.pageflow || {};

  const ChapterFilter = BaseObject.extend({
    initialize: function (entryData) {
      this.entry = entryData;
    },
    strategies: {
      non: function () {
        return false;
      },
      current_storyline: function (currentChapterId, otherChapterId) {
        return this.entry.getStorylineIdByChapterId(currentChapterId) === this.entry.getStorylineIdByChapterId(otherChapterId);
      },
      inherit_from_parent: function (currentChapterId, otherChapterId) {
        return this.chapterVisibleFromChapter(this.entry.getParentChapterId(currentChapterId), otherChapterId);
      }
    },
    chapterVisibleFromPage: function (currentPagePermaId, chapterId) {
      var currentChapterId = this.entry.getChapterIdByPagePermaId(currentPagePermaId);
      return this.chapterVisibleFromChapter(currentChapterId, chapterId);
    },
    chapterVisibleFromChapter: function (currentChapterId, otherChapterId) {
      return this.getStrategy(currentChapterId).call(this, currentChapterId, otherChapterId);
    },
    getStrategy: function (chapterId) {
      return this.strategies[this.getNavigationBarMode(chapterId)] || this.strategies.current_storyline;
    },
    getNavigationBarMode: function (chapterId) {
      var storylineId = this.entry.getStorylineIdByChapterId(chapterId);
      return this.entry.getStorylineConfiguration(storylineId).navigation_bar_mode;
    }
  });
  ChapterFilter.strategies = _(ChapterFilter.prototype.strategies).keys();
  ChapterFilter.create = function () {
    return new ChapterFilter(state$1.entryData);
  };

  const readyDeferred = new $.Deferred();
  const ready = readyDeferred.promise();

  const cookieNotice = {
    request: function () {
      ready.then(function () {
        events.trigger('cookie_notice:request');
      });
    }
  };

  const DelayedStart = function ($) {
    return function () {
      var waitDeferred = new $.Deferred();
      var promises = [];
      var performed = false;
      return {
        promise: function () {
          return waitDeferred.promise();
        },
        wait: function (callback) {
          var cancelled = false;
          waitDeferred.then(function () {
            if (!cancelled) {
              callback();
            }
          });
          return {
            cancel: function () {
              cancelled = true;
            }
          };
        },
        waitFor: function (callbackOrPromise) {
          if (!performed) {
            if (typeof callbackOrPromise === 'function') {
              callbackOrPromise = new $.Deferred(function (deferred) {
                callbackOrPromise(deferred.resolve);
              }).promise();
            }
            promises.push(callbackOrPromise);
          }
        },
        perform: function () {
          if (!performed) {
            performed = true;
            $.when.apply(null, promises).then(waitDeferred.resolve);
          }
        }
      };
    };
  }($);
  const delayedStart = new DelayedStart();

  const manualStart = function ($) {
    var requiredDeferred = $.Deferred();
    var waitDeferred = $.Deferred();
    $(function () {
      if (manualStart.enabled) {
        delayedStart.waitFor(waitDeferred);
        requiredDeferred.resolve(waitDeferred.resolve);
      }
    });
    return {
      required: function () {
        return requiredDeferred.promise();
      }
    };
  }($);

  var KEY_TAB = 9;
  const FocusOutline = BaseObject.extend({
    initialize: function (element) {
      this.element = element;
    },
    showOnlyAfterKeyboardInteraction: function () {
      var focusOutline = this;
      this.disable();
      this.element.on('keydown', function (event) {
        if (event.which === KEY_TAB) {
          focusOutline.enable();
        }
      });
      this.element.on('mousedown', function () {
        focusOutline.disable();
      });
    },
    disable: function () {
      if (!this.disabled) {
        this.disabled = true;
        this.element.addClass('disable_focus_outline');
        this.element.removeClass('enable_focus_outline');
      }
    },
    enable: function () {
      if (this.disabled) {
        this.disabled = false;
        this.element.removeClass('disable_focus_outline');
        this.element.addClass('enable_focus_outline');
      }
    }
  });
  FocusOutline.setup = function (element) {
    state$1.focusOutline = new FocusOutline(element);
    state$1.focusOutline.showOnlyAfterKeyboardInteraction();
  };

  var Fullscreen = BaseObject.extend({
    toggle: function () {
      var fullscreen = this;
      if ($.support.fullscreen) {
        $('#outer_wrapper').fullScreen({
          callback: function (active) {
            fullscreen._active = active;
            fullscreen.trigger('change');
          }
        });
      }
    },
    isSupported: function () {
      return $.support.fullscreen;
    },
    isActive: function () {
      return this._active;
    }
  });
  const fullscreen = new Fullscreen();

  const HighlightedPage = BaseObject.extend({
    initialize: function (entryData, options) {
      this.customNavigationBarMode = options && options.customNavigationBarMode;
      this.entry = entryData;
    },
    getPagePermaId: function (currentPagePermaId) {
      var storylineId = this.entry.getStorylineIdByPagePermaId(currentPagePermaId);
      if (this.getNavigationBarMode(storylineId) === 'inherit_from_parent') {
        var parentPagePermaId = this.entry.getParentPagePermaId(storylineId);
        return parentPagePermaId && this.getPagePermaId(parentPagePermaId);
      } else {
        return this.getDisplayedPageInChapter(currentPagePermaId);
      }
    },
    getDisplayedPageInChapter: function (pagePermaId) {
      return _(this.getChapterPagesUntil(pagePermaId).reverse()).find(function (permaId) {
        return this.pageIsDisplayedInNavigation(permaId);
      }, this);
    },
    pageIsDisplayedInNavigation: function (permaId) {
      return this.entry.getPageConfiguration(permaId).display_in_navigation !== false;
    },
    getNavigationBarMode: function (storylineId) {
      if (this.customNavigationBarMode) {
        return this.customNavigationBarMode(storylineId, this.entry);
      } else {
        return this.entry.getStorylineConfiguration(storylineId).navigation_bar_mode;
      }
    },
    getChapterPagesUntil: function (pagePermaId) {
      var found = false;
      var chapterId = this.entry.getChapterIdByPagePermaId(pagePermaId);
      return _.filter(this.entry.getChapterPagePermaIds(chapterId), function (other) {
        var result = !found;
        found = found || pagePermaId === other;
        return result;
      });
    }
  });
  HighlightedPage.create = function (options) {
    return new HighlightedPage(state$1.entryData, options);
  };

  const links = {
    setup: function () {
      this.ensureClickOnEnterKeyPress();
      this.setupContentSkipLinks();
    },
    ensureClickOnEnterKeyPress: function () {
      $('body').on('keypress', 'a, [tabindex]', function (e) {
        if (e.which == 13) {
          $(this).click();
        }
      });
      $('body').on('keyup', 'a, [tabindex]', function (e) {
        e.stopPropagation();
      });
    },
    setupContentSkipLinks: function () {
      $('.content_link').attr('href', '#firstContent');
      $('.content_link').click(function (e) {
        $('#firstContent').focus();
        e.preventDefault();
        return false;
      });
    }
  };

  /**
   * Manual interaction with the multimedia alert.
   *
   * @since 0.9
   */
  const multimediaAlert = {
    /**
     * Display the multimedia alert.
     */
    show: function () {
      events.trigger('request:multimedia_alert');
    }
  };

  const nativeScrolling = {
    preventScrollBouncing: function (slideshow) {
      slideshow.on('touchmove', function (e) {
        e.preventDefault();
      });
    },
    preventScrollingOnEmbed: function (slideshow) {
      slideshow.on('wheel mousewheel DOMMouseScroll', function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    }
  };

  const theme = {
    mainColor: function () {
      var probe = document.getElementById('theme_probe-main_color');
      return window.getComputedStyle(probe)['background-color'];
    }
  };

  const Visited = function (entryId, pages, events, cookies) {
    var cookieName = '_pageflow_visited';
    var unvisitedPages = [];
    function init() {
      cookieNotice.request();
      if (!cookies.hasItem(cookieName)) {
        storeVisitedPageIds(getAllIds());
      } else {
        var visitedIds = getVisitedPageIds();
        unvisitedPages = _.difference(getAllIds(), visitedIds);
      }
      events.on('page:change', function (page) {
        var id = page.getPermaId();
        var ids = getVisitedPageIds();
        if (ids.indexOf(id) < 0) {
          ids.push(id);
        }
        storeVisitedPageIds(ids);
      });
    }
    function migrateLegacyCookie() {
      var legacyCookieName = '_pageflow_' + entryId + '_visited';
      if (cookies.hasItem(legacyCookieName)) {
        var ids = getCookieIds(legacyCookieName);
        storeVisitedPageIds(_.uniq(ids));
        cookies.removeItem(legacyCookieName);
      }
    }
    function getAllIds() {
      return pages.map(function (page) {
        return page.perma_id;
      });
    }
    function storeVisitedPageIds(ids) {
      cookies.setItem(cookieName, ids, Infinity, location.pathname);
    }
    function getVisitedPageIds() {
      return getCookieIds(cookieName);
    }
    function getCookieIds(name) {
      if (cookies.hasItem(name) && !!cookies.getItem(name)) {
        return cookies.getItem(name).split(',').map(function (id) {
          return parseInt(id, 10);
        });
      }
      return [];
    }
    return {
      init: function () {
        migrateLegacyCookie();
        init();
      },
      getUnvisitedPages: function () {
        return unvisitedPages;
      }
    };
  };
  Visited.setup = function () {
    state$1.visited = new Visited(state$1.entryId, state$1.pages, state$1.events, state$1.cookies);
    if (Visited.enabled) {
      state$1.visited.init();
    }
  };

  const commonPageCssClasses = {
    updateCommonPageCssClasses: function (pageElement, configuration) {
      pageElement.toggleClass('invert', configuration.get('invert'));
      pageElement.toggleClass('hide_title', configuration.get('hide_title'));
      pageElement.toggleClass('hide_logo', !!configuration.get('hide_logo'));
      toggleModeClass(state$1.Page.textPositions, 'text_position');
      toggleModeClass(state$1.Page.delayedTextFadeIn, 'delayed_text_fade_in');
      toggleModeClass(state$1.Page.scrollIndicatorModes, 'scroll_indicator_mode');
      toggleModeClass(state$1.Page.scrollIndicatorOrientations, 'scroll_indicator_orientation');
      function toggleModeClass(modes, name) {
        var value = configuration.get(name);
        _.each(modes, function (mode) {
          pageElement.removeClass(name + '_' + mode);
        });
        if (value) {
          pageElement.addClass(name + '_' + value);
        }
      }
      pageElement.toggleClass('no_text_content', !hasContent());
      function hasContent() {
        var hasTitle = _(['title', 'subtitle', 'tagline']).some(function (attribute) {
          return !!$.trim(configuration.get(attribute));
        });
        var text = $('<div />').html(configuration.get('text')).text();
        var hasText = !!$.trim(text);
        return hasTitle && !configuration.get('hide_title') || hasText;
      }
    }
  };

  const defaultPageContent = {
    updateDefaultPageContent: function (pageElement, configuration) {
      pageElement.find('.page_header-tagline').text(configuration.get('tagline') || '');
      pageElement.find('.page_header-title').text(configuration.get('title') || '');
      pageElement.find('.page_header-subtitle').text(configuration.get('subtitle') || '');
      pageElement.find('.page_text .paragraph').html(configuration.get('text') || '');
    }
  };

  const infoBox = {
    updateInfoBox: function (pageElement, configuration) {
      var infoBox = pageElement.find('.add_info_box');
      if (!infoBox.find('h3').length) {
        infoBox.prepend($('<h3 />'));
      }
      infoBox.find('h3').html(configuration.get('additional_title') || '');
      infoBox.find('p').html(configuration.get('additional_description') || '');
      infoBox.toggleClass('empty', !configuration.get('additional_description') && !configuration.get('additional_title'));
      infoBox.toggleClass('title_empty', !configuration.get('additional_title'));
      infoBox.toggleClass('description_empty', !configuration.get('additional_description'));
    }
  };

  const videoHelpers = {
    updateVideoPoster: function (pageElement, imageUrl) {
      pageElement.find('.vjs-poster').css('background-image', 'url(' + imageUrl + ')');
    },
    updateBackgroundVideoPosters: function (pageElement, imageUrl, x, y) {
      pageElement.find('.vjs-poster, .background-image').css({
        'background-image': 'url(' + imageUrl + ');',
        'background-position': x + '% ' + y + '%;'
      });
    }
  };

  const volumeFade = {
    fadeSound: function (media, endVolume, fadeTime) {
      var fadeResolution = 10;
      var startVolume = media.volume();
      var steps = fadeTime / fadeResolution;
      var leap = (endVolume - startVolume) / steps;
      clearInterval(this.fadeInterval);
      if (endVolume != startVolume) {
        var fade = this.fadeInterval = setInterval(_.bind(function () {
          media.volume(media.volume() + leap);
          if (media.volume() >= endVolume && endVolume >= startVolume || media.volume() <= endVolume && endVolume <= startVolume) {
            clearInterval(fade);
          }
        }, this), fadeResolution);
      }
    }
  };

  const pageType = function () {
    var base = {
      enhance: function (pageElement, configuarion) {},
      prepare: function (pageElement, configuarion) {},
      unprepare: function (pageElement, configuarion) {},
      preload: function (pageElement, configuarion) {},
      resize: function (pageElement, configuarion) {},
      activating: function (pageElement, configuarion) {},
      activated: function (pageElement, configuarion) {},
      deactivating: function (pageElement, configuarion) {},
      deactivated: function (pageElement, configuarion) {},
      update: function (pageElement, configuarion) {},
      cleanup: function (pageElement, configuarion) {},
      embeddedEditorViews: function () {},
      linkedPages: function () {
        return [];
      },
      isPageChangeAllowed: function (pageElement, configuarion, options) {
        return true;
      },
      prepareNextPageTimeout: 200
    };
    return {
      repository: [],
      initializers: {},
      registerInitializer(name, fn) {
        this.initializers[name] = fn;
      },
      invokeInitializers(pages) {
        _.each(pages, page => {
          if (this.initializers[page.template]) {
            this.initializers[page.template](page.configuration);
          }
        });
      },
      register: function (name, pageType) {
        var constructor = function () {};
        _.extend(constructor.prototype, base, Backbone.Events, pageType);
        this.repository[name] = constructor;
      },
      get: function (name) {
        if (!this.repository[name]) {
          throw 'Unknown page type "' + name + '"';
        }
        return new this.repository[name]();
      }
    };
  }();

  const SimulatedAdapter = function () {
    var stack = [{
      hash: null,
      state: null
    }];
    this.back = function () {
      if (stack.length > 1) {
        stack.pop();
        this.trigger('popstate');
        return true;
      }
      return false;
    };
    this.pushState = function (state, title, hash) {
      stack.push({
        state: state,
        hash: hash
      });
    };
    this.replaceState = function (state, title, hash) {
      peek().state = state;
      peek().hash = hash;
    };
    this.state = function () {
      return peek().state;
    };
    this.hash = function () {
      return peek().hash;
    };
    function peek() {
      return stack[stack.length - 1];
    }
  };
  _.extend(SimulatedAdapter.prototype, Backbone.Events);

  const PushStateAdapter = function () {
    var counter = 0;
    this.back = function () {
      if (counter > 0) {
        window.history.back();
        return true;
      }
      return false;
    };
    this.pushState = function (state, title, hash) {
      counter += 1;
      window.history.pushState(state, title, '#' + hash);
    };
    this.replaceState = function (state, title, hash) {
      window.history.replaceState(state, title, '#' + hash);
    };
    this.state = function () {
      return history.state;
    };
    this.hash = function () {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    };
    this.on = function (event, listener) {
      return $(window).on(event, listener);
    };
    $(window).on('popstate', function () {
      counter -= 1;
    });
  };

  const HashAdapter = function () {
    var counter = 0;
    this.back = function () {
      if (counter > 0) {
        window.history.back();
        counter -= 1;
        return true;
      }
      return false;
    };
    this.pushState = function (state, title, hash) {
      if (window.location.hash !== hash) {
        counter += 1;
        window.location.hash = hash;
      }
    };
    this.replaceState = function (state, title, hash) {
      window.location.hash = hash;
    };
    this.state = function () {
      return {};
    };
    this.hash = function () {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    };
    this.on = function (event, listener) {
      return $(window).on(event, listener);
    };
  };

  const History = function (slideshow, adapter) {
    slideshow.on('slideshowchangepage', function (event, options) {
      var hash = slideshow.currentPage().attr('id');
      if (options.back) {
        adapter.replaceState(null, '', adapter.hash());
      } else if (options.ignoreInHistory) {
        adapter.replaceState(null, '', hash);
      } else {
        adapter.replaceState(options, '', adapter.hash());
        adapter.pushState(null, '', hash);
      }
    });
    adapter.on('popstate', function (event) {
      if (!adapter.state()) {
        return;
      }
      slideshow.goToByPermaId(adapter.hash(), _.extend({
        back: true
      }, _.pick(adapter.state(), 'direction', 'transition')));
    });
    adapter.on('hashchange', function () {
      slideshow.goToByPermaId(adapter.hash());
    });
    this.getLandingPagePermaId = function () {
      return adapter.hash() || pageParameter();
    };
    this.start = function () {
      adapter.replaceState(null, '', slideshow.currentPage().attr('id'));
    };
    this.back = _.bind(adapter.back, adapter);
    function pageParameter() {
      var match = window.location.href.match(/page=([^&]*)/);
      return match ? match[1] : '';
    }
  };
  History.create = function (slideshow, options) {
    options = options || {};
    var adapter;
    if (options.simulate) {
      adapter = new SimulatedAdapter();
    } else if (browser.has('pushstate support')) {
      adapter = new PushStateAdapter();
    } else {
      adapter = new HashAdapter();
    }
    return new History(slideshow, adapter);
  };

  var attributeName = 'atmo_audio_file_id';
  const Atmo = BaseObject.extend({
    initialize: function (options) {
      this.slideshow = options.slideshow;
      this.multiPlayer = options.multiPlayer;
      this.backgroundMedia = options.backgroundMedia;
      this.disabled = browser.has('mobile platform');
      this.listenTo(options.events, 'page:change page:update background_media:unmute', function () {
        this.update();
      });
      this.listenTo(options.multiPlayer, 'playfailed', function () {
        options.backgroundMedia.mute();
      });
    },
    disable: function () {
      this.disabled = true;
      this.multiPlayer.fadeOutAndPause();
      events.trigger('atmo:disabled');
    },
    enable: function () {
      this.disabled = false;
      this.update();
      events.trigger('atmo:enabled');
    },
    pause: function () {
      if (browser.has('volume control support')) {
        return this.multiPlayer.fadeOutAndPause();
      } else {
        this.multiPlayer.pause();
      }
    },
    turnDown: function () {
      if (browser.has('volume control support')) {
        return this.multiPlayer.changeVolumeFactor(0.2);
      } else {
        this.multiPlayer.pause();
      }
    },
    resume: function () {
      if (this.multiPlayer.paused()) {
        if (this.disabled || this.backgroundMedia.muted) {
          return new $.Deferred().resolve().promise();
        } else {
          return this.multiPlayer.resumeAndFadeIn();
        }
      } else {
        return this.multiPlayer.changeVolumeFactor(1);
      }
    },
    update: function () {
      var configuration = this.slideshow.currentPageConfiguration();
      if (!this.disabled) {
        if (this.backgroundMedia.muted) {
          this.multiPlayer.fadeOutAndPause();
        } else {
          this.multiPlayer.fadeTo(configuration[attributeName]);
        }
      }
    },
    createMediaPlayerHooks: function (configuration) {
      var atmo = this;
      return {
        before: function () {
          if (configuration.atmo_during_playback === 'mute') {
            atmo.pause();
          } else if (configuration.atmo_during_playback === 'turn_down') {
            atmo.turnDown();
          }
        },
        after: function () {
          atmo.resume();
        }
      };
    }
  });
  Atmo.create = function (slideshow, events, audio, backgroundMedia) {
    return new Atmo({
      slideshow: slideshow,
      events: events,
      backgroundMedia: backgroundMedia,
      multiPlayer: audio.createMultiPlayer({
        loop: true,
        fadeDuration: 500,
        crossFade: true,
        playFromBeginning: false,
        rewindOnChange: true,
        pauseInBackground: true
      })
    });
  };
  Atmo.duringPlaybackModes = ['play', 'mute', 'turn_down'];

  (function ($) {
    var creatingMethods = ['reinit', 'reactivate', 'activate', 'activateAsLandingPage', 'preload', 'prepare', 'linkedPages'];
    var ignoredMethods = ['cleanup', 'refreshScroller', 'resize', 'deactivate', 'unprepare', 'isPageChangeAllowed'];
    var prototype = {
      _create: function () {
        this.configuration = this.element.data('configuration') || this.options.configuration;
        this.index = this.options.index;
      },
      _destroy: function () {
        this.isDestroyed = true;
      },
      _ensureCreated: function () {
        this.created = true;
        this.element.nonLazyPage(this.options);
      },
      _delegateToInner: function (method, args) {
        return this.element.nonLazyPage.apply(this.element, [method].concat([].slice.call(args)));
      },
      getPermaId: function () {
        return parseInt(this.element.attr('id'), 10);
      },
      getConfiguration: function () {
        return this.configuration;
      },
      getAnalyticsData: function () {
        return state$1.entryData.getPageAnalyticsData(this.getPermaId());
      },
      update: function (configuration) {
        if (this.created) {
          this._delegateToInner('update', arguments);
        } else {
          _.extend(this.configuration, configuration.attributes);
        }
      }
    };
    _(creatingMethods).each(function (method) {
      prototype[method] = function () {
        this._ensureCreated();
        return this._delegateToInner(method, arguments);
      };
    });
    _(ignoredMethods).each(function (method) {
      prototype[method] = function () {
        if (this.created) {
          return this._delegateToInner(method, arguments);
        }
      };
    });
    $.widget('pageflow.page', prototype);
  })($);

  /**
   * Utility functions for page types that dynamically switch to a two
   * column layout where some kind of embed is displayed next to the
   * text (i.e. `pageflow-chart` and `pageflow-embedded-video`).
   *
   * Works closely with the `page-with_split_layout` CSS class (see
   * `pageflow/themes/default/page/line_lengths.scss`).
   *
   * @since 12.2
   */
  const pageSplitLayout = function () {
    return {
      /**
       * Determine if the page is wide enough to display two columns.
       *
       * @memberof pageflow.pageSplitLayout
       */
      pageIsWideEnough: function (pageElement) {
        var pageClientRect = pageElement[0].getBoundingClientRect();
        var contentClientRect = getContentClientRect(pageElement, pageClientRect);
        var spaceRightFromTitle = pageClientRect.right - contentClientRect.right;
        var spaceLeftFromTitle = contentClientRect.left - pageClientRect.left;
        var leftPositionedEmbedWidth = pageClientRect.width * 0.51;
        var rightPositionedEmbedWidth = pageClientRect.width * 0.55;
        return spaceLeftFromTitle >= leftPositionedEmbedWidth || spaceRightFromTitle >= rightPositionedEmbedWidth;
      }
    };
    function getContentClientRect(pageElement, pageClientRect) {
      var pageTitle = pageElement.find('.page_header-title');
      var pageText = pageElement.find('.page_text .paragraph');
      var pageTitleClientRect = pageTitle[0].getBoundingClientRect();
      var pageTextClientRect = pageText[0].getBoundingClientRect();
      var contentRight;
      var contentLeft;
      if (isTitleHidden(pageTitleClientRect)) {
        contentRight = pageTextClientRect.right;
        contentLeft = pageTextClientRect.left;
      } else {
        contentRight = Math.max(pageTitleClientRect.right, pageTextClientRect.right);
        contentLeft = pageTitleClientRect.left;
      }
      var contentTranslation = getContentTranslationCausedByHiddenText(pageElement, pageClientRect);
      return {
        right: contentRight - contentTranslation,
        left: contentLeft - contentTranslation
      };
    }
    function isTitleHidden(pageTitleClientRect) {
      return pageTitleClientRect.width === 0;
    }
    function getContentTranslationCausedByHiddenText(pageElement, pageClientRect) {
      var contentWrapper = pageElement.find('.content_wrapper');
      var contentWrapperClientRect = contentWrapper[0].getBoundingClientRect();
      var contentWrapperMarginInsidePage = contentWrapper[0].offsetLeft;
      var nonTranslatedContentWrapperLeft = pageClientRect.left + contentWrapperMarginInsidePage;
      return contentWrapperClientRect.left - nonTranslatedContentWrapperLeft;
    }
  }();

  const ScrollIndicator = BaseObject.extend({
    initialize: function (pageElement) {
      this.pageElement = pageElement;
    },
    disable: function () {
      if (this._isPageActive()) {
        events.trigger('scroll_indicator:disable');
      }
    },
    scheduleDisable: function () {
      if (this._isPageActive()) {
        events.trigger('scroll_indicator:schedule_disable');
      }
    },
    enable: function (text) {
      if (this._isPageActive()) {
        events.trigger('scroll_indicator:enable');
      }
    },
    _isPageActive: function () {
      return this.pageElement.hasClass('active');
    }
  });

  const widgets = function () {
    return {
      isPresent: function (name) {
        return !!$('div.' + className(name)).length;
      },
      areLoaded: function () {
        return !!$('div.widgets_present').length;
      },
      use: function (options, callback) {
        var original = options.insteadOf;
        var originalClassName = className(original);
        var replacementClassNames = className(options.name) + ' ' + className(original, 'replaced');
        if (this.isPresent(original)) {
          replace(originalClassName, replacementClassNames);
          callback(function () {
            replace(replacementClassNames, originalClassName);
          });
        } else {
          callback(function () {});
        }
      }
    };
    function replace(original, replacement) {
      $('div.widgets_present').removeClass(original).addClass(replacement);
      events.trigger('widgets:update');
      state$1.slides.triggerResizeHooks();
    }
    function className(name, state) {
      return 'widget_' + name + '_' + (state || 'present');
    }
  }();

  const navigationDirection = function () {
    var eventMapping = {
      v: {
        scrollerbumpnext: 'scrollerbumpdown',
        scrollerbumpback: 'scrollerbumpup',
        scrollerhintnext: 'scrollerhintdown',
        scrollerhintback: 'scrollerhintup'
      },
      h: {
        scrollerbumpnext: 'scrollerbumpright',
        scrollerbumpback: 'scrollerbumpleft',
        scrollerhintnext: 'scrollerhintright',
        scrollerhintback: 'scrollerhintleft'
      }
    };
    return {
      isHorizontalOnPhone: function () {
        return widgets.isPresent('phone_horizontal_slideshow_mode');
      },
      isHorizontal: function () {
        return this.isHorizontalOnPhone() && browser.has('phone platform');
      },
      getEventName: function (name) {
        var result = eventMapping[this.isHorizontal() ? 'h' : 'v'][name];
        if (!result) {
          throw 'Unknown event name ' + name;
        }
        return result;
      }
    };
  }();

  const PageTransitions = BaseObject.extend({
    initialize: function (navigationDirection) {
      this.repository = {};
      this.navigationDirection = navigationDirection;
    },
    register: function (name, options) {
      this.repository[name] = options;
    },
    get: function (name) {
      var transition = this.repository[name];
      if (!transition) {
        throw 'Unknown page transition "' + name + '"';
      }
      return this.navigationDirection.isHorizontal() ? transition.h : transition.v;
    },
    names: function () {
      return _.keys(this.repository);
    }
  });
  const pageTransitions = new PageTransitions(navigationDirection);
  pageTransitions.register('fade', {
    v: {
      className: 'fade fade-v',
      duration: 1100
    },
    h: {
      className: 'fade fade-h',
      duration: 600
    }
  });
  pageTransitions.register('crossfade', {
    v: {
      className: 'crossfade',
      duration: 1100
    },
    h: {
      className: 'crossfade crossfade-fast',
      duration: 600
    }
  });
  pageTransitions.register('fade_to_black', {
    v: {
      className: 'fade_to_black',
      duration: 2100
    },
    h: {
      className: 'fade_to_black',
      duration: 2100
    }
  });
  pageTransitions.register('cut', {
    v: {
      className: 'cut',
      duration: 1100
    },
    h: {
      className: 'cut',
      duration: 1100
    }
  });
  pageTransitions.register('scroll', {
    v: {
      className: 'scroll scroll-in scroll-from_bottom',
      duration: 1100
    },
    h: {
      className: 'scroll scroll-in scroll-from_right scroll-fast',
      duration: 600
    }
  });
  pageTransitions.register('scroll_right', {
    v: {
      className: 'scroll scroll-in scroll-from_right',
      duration: 1100
    },
    h: {
      className: 'scroll scroll-in scroll-from_bottom scroll-fast',
      duration: 600
    }
  });
  pageTransitions.register('scroll_left', {
    v: {
      className: 'scroll scroll-in scroll-from_left',
      duration: 1100
    },
    h: {
      className: 'scroll scroll-in scroll-from_top scroll-fast',
      duration: 600
    }
  });
  pageTransitions.register('scroll_over_from_right', {
    v: {
      className: 'scroll scroll-over scroll-from_right',
      duration: 1100
    },
    h: {
      className: 'scroll scroll-over scroll-from_bottom scroll-fast',
      duration: 600
    }
  });
  pageTransitions.register('scroll_over_from_left', {
    v: {
      className: 'scroll scroll-over scroll-from_left',
      duration: 1100
    },
    h: {
      className: 'scroll scroll-over scroll-from_top scroll-fast',
      duration: 600
    }
  });

  (function ($) {
    $.widget('pageflow.nonLazyPage', {
      widgetEventPrefix: 'page',
      _create: function () {
        this.configuration = this.element.data('configuration') || this.options.configuration;
        this.index = this.options.index;
        this._setupNearBoundaryCssClasses();
        this._setupContentLinkTargetHandling();
        this.reinit();
      },
      getPermaId: function () {
        return parseInt(this.element.attr('id'), 10);
      },
      getConfiguration: function () {
        return this.configuration;
      },
      getAnalyticsData: function () {
        return state$1.entryData.getPageAnalyticsData(this.getPermaId());
      },
      update: function (configuration) {
        _.extend(this.configuration, configuration.attributes);
        this.pageType.update(this.element, configuration);
      },
      reinit: function () {
        this.pageType = pageType.get(this.element.data('template'));
        this.element.data('pageType', this.pageType);
        this.preloaded = false;
        if (this.pageType.scroller === false) {
          this.content = $();
        } else {
          this.content = this.element.find('.scroller');
        }
        this.content.scroller(this.pageType.scrollerOptions || {});
        this.pageType.scroller = this.content.scroller('instance');
        this.pageType.scrollIndicator = new ScrollIndicator(this.element);
        this._setupHideTextOnSwipe();
        this._triggerPageTypeHook('enhance');
        this._trigger('enhanced');
      },
      reactivate: function () {
        if (this.element.hasClass('active')) {
          this.preload();
          this.content.scroller('enable');
          this.content.scroller('resetPosition');
          this.content.scroller('afterAnimationHook');
          this._triggerPageTypeHook('activating');
          this._triggerDelayedPageTypeHook('activated');
        }
      },
      cleanup: function () {
        this._triggerPageTypeHook('deactivating');
        this._triggerDelayedPageTypeHook('deactivated');
        this._triggerPageTypeHook('cleanup');
      },
      refreshScroller: function () {
        this.content.scroller('refresh');
      },
      resize: function () {
        this._triggerPageTypeHook('resize');
      },
      activateAsLandingPage: function () {
        this.element.addClass('active');
        this.content.scroller('enable');
        this.content.scroller('resetPosition');
        this.content.scroller('afterAnimationHook');
        this._trigger('activate', null, {
          page: this
        });
        this._triggerPageTypeHook('activating');
        this._triggerDelayedPageTypeHook('activated');
      },
      prepare: function () {
        this._triggerPageTypeHook('prepare');
      },
      unprepare: function () {
        this._triggerPageTypeHook('unprepare');
      },
      prepareNextPageTimeout: function () {
        return this.pageType.prepareNextPageTimeout;
      },
      linkedPages: function () {
        return this._triggerPageTypeHook('linkedPages');
      },
      isPageChangeAllowed: function (options) {
        return this._triggerPageTypeHook('isPageChangeAllowed', options);
      },
      preload: function () {
        var page = this;
        if (!this.preloaded) {
          this.preloaded = true;
          return $.when(this._triggerPageTypeHook('preload')).then(function () {
            page._trigger('preloaded');
          });
        }
      },
      activate: function (options) {
        options = options || {};
        setTimeout(_.bind(function () {
          this.element.addClass('active');
        }, this), 0);
        var duration = this.animateTransition('in', options, function () {
          this.content.scroller('enable');
          this.content.scroller('afterAnimationHook');
          this._triggerDelayedPageTypeHook('activated');
        });
        this.content.scroller('resetPosition', {
          position: options.position
        });
        this._trigger('activate', null, {
          page: this
        });
        this._triggerPageTypeHook('activating', {
          position: options.position
        });
        return duration;
      },
      deactivate: function (options) {
        options = options || {};
        this.element.removeClass('active');
        var duration = this.animateTransition('out', options, function () {
          this._triggerPageTypeHook('deactivated');
        });
        this.content.scroller('disable');
        this._trigger('deactivate');
        this._triggerPageTypeHook('deactivating');
        return duration;
      },
      animateTransition: function (destination, options, callback) {
        var otherDestination = destination === 'in' ? 'out' : 'in';
        var transition = pageTransitions.get(options.transition || this.configuration.transition || 'fade');
        var animateClass = transition.className + ' animate-' + destination + '-' + options.direction;
        this.element.removeClass('animate-' + otherDestination + '-forwards animate-' + otherDestination + '-backwards').addClass(animateClass);
        setTimeout(_.bind(function () {
          this.element.removeClass(animateClass);
          callback.call(this);
        }, this), transition.duration);
        return transition.duration;
      },
      _triggerDelayedPageTypeHook: function (name) {
        var that = this;
        var handle = delayedStart.wait(function () {
          that._triggerPageTypeHook(name);
        });
        this.element.one('pagedeactivate', function () {
          handle.cancel();
        });
      },
      _triggerPageTypeHook: function (name, options) {
        return this.pageType[name](this.element, this.configuration, options || {});
      },
      _setupHideTextOnSwipe: function () {
        if (state$1.entryData.getSiteOption('hide_text_on_swipe') && !navigationDirection.isHorizontal() && !this.pageType.noHideTextOnSwipe) {
          this.element.hideTextOnSwipe({
            eventTargetSelector:
            // legacy ERB pages
            '.content > .scroller,' +
            // React based pages
            '.content > .scroller-wrapper > .scroller,' +
            // internal links/text page
            '.content.scroller'
          });
        }
      },
      _setupNearBoundaryCssClasses: function () {
        var element = this.element;
        _(['top', 'bottom']).each(function (boundary) {
          element.on('scrollernear' + boundary, function () {
            element.addClass('is_near_' + boundary);
          });
          element.on('scrollernotnear' + boundary, function () {
            element.removeClass('is_near_' + boundary);
          });
        });
      },
      _setupContentLinkTargetHandling: function () {
        this._on({
          'click .page_text .paragraph a': function (event) {
            var href = $(event.currentTarget).attr('href');
            var target = PAGEFLOW_EDITOR ? '_blank' : $(event.currentTarget).attr('target');
            if (href[0] === '#') {
              state$1.slides.goToByPermaId(href.substr(1));
            } else {
              // There was a time when the rich text editor did not add
              // target attributes to inline links even though it should
              // have. Ensure all content links to external urls open in
              // new tab, except explicitly specified otherwise by editor.
              window.open(href, target || '_blank');
            }
            event.preventDefault();
          }
        });
      }
    });
  })($);

  (function ($) {
    /**
     * Wrapper widget around iScroll adding special bump events which
     * are triggered when scrolling to the very top or very bottom
     * (called boundary posititon below).
     * @private
     */
    $.widget('pageflow.scroller', {
      dragThreshold: 50,
      maxXDelta: 50,
      maxYDelta: 50,
      doubleBumpThreshold: 500,
      _create: function () {
        this.eventListenerTarget = this.options.eventListenerTarget ? $(this.options.eventListenerTarget) : this.element;
        this.iscroll = new IScroll(this.element[0], _.extend({
          mouseWheel: true,
          bounce: false,
          keyBindings: true,
          probeType: 2,
          preventDefault: false,
          eventListenerTarget: this.eventListenerTarget[0]
        }, _.pick(this.options, 'freeScroll', 'scrollX', 'noMouseWheelScrollX')));
        this.iscroll.disable();
        if (state$1.entryData.getSiteOption('page_change_by_scrolling')) {
          this._initMousewheelBump('up');
          this._initMousewheelBump('down');
          this._initDragGestureBump();
        }
        this._initKeyboardBump('up');
        this._initKeyboardBump('down');
        this._initNearBottomEvents();
        this._initNearTopEvents();
        this._initMoveEvents();
        this._onScrollEndCallbacks = new $.Callbacks();
      },
      enable: function () {
        this.iscroll.enable();
        this.iscroll.refresh();
      },
      resetPosition: function (options) {
        options = options || {};
        this.iscroll.refresh();
        if (options.position === 'bottom') {
          this.iscroll.scrollTo(0, this.iscroll.maxScrollY, 0);
        } else {
          this.iscroll.scrollTo(0, 0, 0);
        }
        this._triggerBoundaryEvents();
      },
      scrollBy: function (deltaX, deltaY, time, easing) {
        this.scrollTo(this.iscroll.x + deltaX, this.iscroll.y + deltaY, time, easing);
      },
      scrollTo: function (x, y, time, easing) {
        this.iscroll.scrollTo(Math.max(Math.min(x, 0), this.iscroll.maxScrollX), Math.max(Math.min(y, 0), this.iscroll.maxScrollY), time, easing);
        this._onScrollEndCallbacks.fire();
      },
      refresh: function () {
        this.iscroll.refresh();
      },
      afterAnimationHook: function () {
        this._triggerBoundaryEvents();
      },
      disable: function () {
        this.iscroll.disable();
      },
      positionX: function () {
        return this.iscroll.x;
      },
      positionY: function () {
        return this.iscroll.y;
      },
      maxX: function () {
        return this.iscroll.maxScrollX;
      },
      maxY: function () {
        return this.iscroll.maxScrollY;
      },
      onScroll: function (callback) {
        this.iscroll.on('scroll', callback);
      },
      onScrollEnd: function (callback) {
        this.iscroll.on('scrollEnd', callback);
        this._onScrollEndCallbacks.add(callback);
      },
      _initMoveEvents: function () {
        this.iscroll.on('mousewheelup', _.bind(this._triggerMoveEvent, this));
        this.iscroll.on('mousewheeldown', _.bind(this._triggerMoveEvent, this));
        this.iscroll.on('afterkeyboard', _.bind(this._triggerMoveEvent, this));
      },
      _triggerMoveEvent: function () {
        this._trigger('move');
      },
      _initNearBottomEvents: function () {
        this.iscroll.on('scroll', _.bind(this._triggerNearBottomEvents, this));
        this.iscroll.on('scrollEnd', _.bind(this._triggerNearBottomEvents, this));
        this.iscroll.on('afterkeyboard', _.bind(this._triggerNearBottomEvents, this));
      },
      _initNearTopEvents: function () {
        this.iscroll.on('scroll', _.bind(this._triggerNearTopEvents, this));
        this.iscroll.on('scrollEnd', _.bind(this._triggerNearTopEvents, this));
        this.iscroll.on('afterkeyboard', _.bind(this._triggerNearTopEvents, this));
      },
      _triggerBoundaryEvents: function () {
        this._triggerNearTopEvents();
        this._triggerNearBottomEvents();
      },
      _triggerNearBottomEvents: function () {
        if (this._atBoundary('down', {
          delta: 50
        })) {
          this._trigger('nearbottom');
        } else {
          this._trigger('notnearbottom');
        }
      },
      _triggerNearTopEvents: function () {
        if (this._atBoundary('up', {
          delta: 50
        })) {
          this._trigger('neartop');
        } else {
          this._trigger('notneartop');
        }
      },
      // Whenever the a mousewheel event is triggered, we test whether
      // the scroller is at the very top or at the very bottom. If so,
      // we trigger a hintdown or hintup event the first time the mouse
      // wheel turns and a bumpup or bumpdown event when the mouse wheel
      // is turned to times in a short period of time.
      _initMousewheelBump: function (direction) {
        var firstBump = false;
        this.iscroll.on('mousewheel' + direction, _.bind(function () {
          if (!this._atBoundary(direction)) {
            return;
          }
          if (firstBump) {
            this._trigger('bump' + direction);
            firstBump = false;
            clearTimeout(this.waitForSecondBump);
          } else {
            this._trigger('hint' + direction);
            firstBump = true;
            this.waitForSecondBump = setTimeout(function () {
              firstBump = false;
            }, this.doubleBumpThreshold);
          }
        }, this));
      },
      // Trigger bumpup or bumpdown event when the a up/down key is
      // pressed while the scroller in boundary position.
      _initKeyboardBump: function (direction) {
        this.iscroll.on('keyboard' + direction, _.bind(function (event) {
          if (this._atBoundary(direction)) {
            // Make sure other iScrolls which might be enabled by the
            // bump event do not process the keyboard event again.
            event.stopImmediatePropagation();
            this._trigger('bump' + direction);
          }
        }, this));
        this.iscroll.on('keyboardhint' + direction, _.bind(function () {
          if (this._atBoundary(direction)) {
            this._trigger('hint' + direction);
          }
        }, this));
      },
      // Trigger bumpup or bumpdown when the user drags the page from a
      // boundary position. Trigger bumpleft or bumpright if user drags
      // horizontally.
      _initDragGestureBump: function () {
        var allowUp = false,
          allowDown = false,
          allowLeft = false,
          allowRight = false,
          startX,
          startY;
        this.eventListenerTarget.on('touchstart MSPointerDown pointerdown', _.bind(function (event) {
          var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
          startX = point.pageX;
          startY = point.pageY;
          if (!this._isNonTouchPointer(event)) {
            allowDown = this._atBoundary('down');
            allowUp = this._atBoundary('up');
            allowLeft = true;
            allowRight = true;
          }
        }, this));
        this.eventListenerTarget.on('touchmove MSPointerMove pointermove', _.bind(function (event) {
          var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
          var deltaX = point.pageX - startX;
          var deltaY = point.pageY - startY;
          if (Math.abs(deltaX) > this.maxXDelta) {
            allowDown = allowUp = false;
          }
          if (Math.abs(deltaY) > this.maxYDelta) {
            allowLeft = allowRight = false;
          }
          if (allowUp && deltaY > this.dragThreshold) {
            this._trigger('bumpup');
            allowDown = allowUp = allowLeft = allowRight = false;
          } else if (allowDown && deltaY < -this.dragThreshold) {
            this._trigger('bumpdown');
            allowDown = allowUp = allowLeft = allowRight = false;
          } else if (allowLeft && deltaX > this.dragThreshold) {
            this._trigger('bumpleft');
            allowDown = allowUp = allowLeft = allowRight = false;
          } else if (allowRight && deltaX < -this.dragThreshold) {
            this._trigger('bumpright');
            allowDown = allowUp = allowLeft = allowRight = false;
          }
        }, this));
        this.eventListenerTarget.on('touchend MSPointerUp pointerup', _.bind(function (event) {
          var point = event.originalEvent.touches ? event.originalEvent.changedTouches[0] : event.originalEvent;
          var deltaX = point.pageX - startX;
          var deltaY = point.pageY - startY;
          if (allowUp && deltaY > 0) {
            this._trigger('hintup');
          } else if (allowDown && deltaY < 0) {
            this._trigger('hintdown');
          }
          if (allowLeft && deltaX > 0) {
            this._trigger('hintleft');
          } else if (allowRight && deltaX < 0) {
            this._trigger('hintright');
          }
        }, this));
      },
      _isNonTouchPointer: function (event) {
        return event.originalEvent.pointerType && event.originalEvent.pointerType !== event.originalEvent.MSPOINTER_TYPE_TOUCH && event.originalEvent.pointerType !== 'touch';
      },
      // Checks whether the scroller is at the very top or very bottom.
      _atBoundary: function (direction, options) {
        options = options || {};
        var delta = options.delta || 0;
        if (direction === 'up') {
          return this.iscroll.y >= -delta;
        } else {
          return this.iscroll.y <= this.iscroll.maxScrollY + delta;
        }
      }
    });
  })($);

  (function ($) {
    var boundaries = {
      back: 'top',
      next: 'bottom'
    };
    $.widget('pageflow.scrollIndicator', {
      _create: function () {
        var parent = this.options.parent,
          direction = this.element.data('direction'),
          boundary = boundaries[direction],
          that = this,
          fadeTimeout;
        function update(page) {
          that.element.toggleClass('hidden_by_scoll_indicator_mode', hiddenByMode(page));
          that.element.toggleClass('hidden_for_page', hideScrollIndicatorForPage(page));
          that.element.toggleClass('invert', invertIndicator(page));
          that.element.toggleClass('horizontal', page.hasClass('scroll_indicator_orientation_horizontal'));
          that.element.toggleClass('available', targetPageExists());
        }
        function hiddenByMode(page) {
          return page.hasClass('scroll_indicator_mode_non') || page.hasClass('scroll_indicator_mode_only_next') && direction === 'back' || page.hasClass('scroll_indicator_mode_only_back') && direction === 'next';
        }
        function invertIndicator(page) {
          var result = page.data('invertIndicator');
          if (typeof result === 'undefined') {
            result = page.hasClass('invert') && !hasSlimPlayerControls(page);
          }
          return result;
        }
        function hideScrollIndicatorForPage(page) {
          return hasSlimPlayerControls(page) || !widgets.areLoaded();
        }
        function hasSlimPlayerControls(page) {
          return hasPlayerControls(page) && widgets.isPresent('slim_player_controls');
        }
        function hasPlayerControls(page) {
          return !!page.find('[data-role="player_controls"]').length;
        }
        function targetPageExists() {
          return direction === 'next' ? parent.nextPageExists() : parent.previousPageExists();
        }
        parent.on('pageactivate', function (event) {
          update($(event.target));
          clearTimeout(fadeTimeout);
          that.element.removeClass('faded');
        });
        events.on({
          'page:update': function () {
            update(parent.currentPage());
          },
          'scroll_indicator:disable': function () {
            clearTimeout(fadeTimeout);
            that.element.addClass('hidden_for_page');
          },
          'scroll_indicator:schedule_disable': function () {
            clearTimeout(fadeTimeout);
            fadeTimeout = setTimeout(function () {
              that.element.addClass('faded');
            }, 2000);
          },
          'scroll_indicator:enable': function () {
            clearTimeout(fadeTimeout);
            that.element.removeClass('faded hidden_for_page');
          }
        });
        parent.on(navigationDirection.getEventName('scrollerhint' + direction), function () {
          that.element.addClass('animate');
          setTimeout(function () {
            that.element.removeClass('animate');
          }, 500);
        });
        parent.on('scrollernear' + boundary, function (event) {
          var page = $(event.target).parents('section');
          if (page.hasClass('active')) {
            that.element.toggleClass('visible', targetPageExists());
          }
        });
        parent.on('scrollernotnear' + boundary + ' slideshowchangepage', function () {
          that.element.removeClass('visible');
        });
        $.when(ready, delayedStart.promise()).done(function () {
          setTimeout(function () {
            that.element.addClass('attract');
            setTimeout(function () {
              that.element.removeClass('attract');
            }, 1500);
          }, 3000);
        });
        this.element.on('click', function () {
          if (direction === 'next') {
            parent.next();
          } else {
            parent.back();
          }
        });
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.hiddenTextIndicator', {
      _create: function () {
        var parent = this.options.parent,
          that = this;
        parent.on('pageactivate', function (event) {
          var pageOrPageWrapper = $(event.target).add('.content_and_background', event.target);
          that.element.toggleClass('invert', $(event.target).hasClass('invert'));
          that.element.toggleClass('hidden', pageOrPageWrapper.hasClass('hide_content_with_text') || pageOrPageWrapper.hasClass('no_hidden_text_indicator'));
        });
        parent.on('hidetextactivate', function () {
          that.element.addClass('visible');
        });
        parent.on('hidetextdeactivate', function () {
          that.element.removeClass('visible');
        });
      }
    });
  })($);

  const AdjacentPages = BaseObject.extend({
    initialize: function (pages, scrollNavigator) {
      this.pages = pages;
      this.scrollNavigator = scrollNavigator;
    },
    of: function (page) {
      var result = [];
      var pages = this.pages();
      var nextPage = this.nextPage(page);
      if (nextPage) {
        result.push(nextPage);
      }
      _(page.linkedPages()).each(function (permaId) {
        var linkedPage = pages.filter('#' + permaId);
        if (linkedPage.length) {
          result.push(linkedPage.page('instance'));
        }
      }, this);
      return result;
    },
    nextPage: function (page) {
      var nextPage = this.scrollNavigator.getNextPage(page.element, this.pages());
      return nextPage.length && nextPage.page('instance');
    }
  });

  const AdjacentPreloader = BaseObject.extend({
    initialize: function (adjacentPages) {
      this.adjacentPages = adjacentPages;
    },
    attach: function (events) {
      this.listenTo(events, 'page:change', this.preloadAdjacent);
    },
    preloadAdjacent: function (page) {
      _(this.adjacentPages.of(page)).each(function (page) {
        page.preload();
      });
    }
  });
  AdjacentPreloader.create = function (pages, scrollNavigator) {
    return new AdjacentPreloader(new AdjacentPages(pages, scrollNavigator));
  };

  const SuccessorPreparer = BaseObject.extend({
    initialize: function (adjacentPages) {
      this.adjacentPages = adjacentPages;
    },
    attach: function (events) {
      this.listenTo(events, 'page:change', this.schedule);
    },
    schedule: function (page) {
      clearTimeout(this.scheduleTimeout);
      var prepare = _.bind(this.prepareSuccessor, this, page);
      this.scheduleTimeout = setTimeout(prepare, page.prepareNextPageTimeout());
    },
    prepareSuccessor: function (page) {
      var preparedPages = _.compact([page, this.adjacentPages.nextPage(page)]);
      var noLongerPreparedPages = _.difference(this.lastPreparedPages, preparedPages);
      var newAdjacentPages = _.difference(preparedPages, this.lastPreparedPages);
      _(noLongerPreparedPages).each(function (page) {
        if (!page.isDestroyed) {
          page.unprepare();
        }
      });
      _(newAdjacentPages).each(function (adjacentPage) {
        adjacentPage.prepare();
      });
      this.lastPreparedPages = preparedPages;
    }
  });
  SuccessorPreparer.create = function (pages, scrollNavigator) {
    return new SuccessorPreparer(new AdjacentPages(pages, scrollNavigator));
  };

  (function ($) {
    $.widget('pageflow.swipeGesture', {
      _create: function () {
        var startX, startY, startTime, distX, distY;
        this.options = _.extend({
          orientation: 'x',
          minDist: 100,
          maxOrthogonalDist: 50,
          maxDuration: 500
        }, this.options);
        var selector = this.options.eventTargetSelector;
        this.element.on('touchstart MSPointerDown pointerdown', selector, _.bind(function (event) {
          if (isNonTouchPointer(event)) {
            return;
          }
          var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
          startX = point.pageX;
          startY = point.pageY;
          distX = 0;
          distY = 0;
          startTime = new Date().getTime();
        }, this));
        this.element.on('touchmove MSPointerMove pointermove', selector, _.bind(function (event) {
          if (isNonTouchPointer(event)) {
            return;
          }
          var point = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
          distX = point.pageX - startX;
          distY = point.pageY - startY;
        }, this));
        this.element.on('touchend MSPointerUp pointerup', selector, _.bind(function (event) {
          if (isNonTouchPointer(event)) {
            return;
          }
          var elapsedTime = new Date().getTime() - startTime;
          var dist = this.options.orientation === 'x' ? distX : distY;
          var orthogonalDist = this.options.orientation === 'x' ? distY : distX;
          if (Math.abs(dist) > this.options.minDist && Math.abs(orthogonalDist) < this.options.maxOrthogonalDist && elapsedTime < this.options.maxDuration) {
            if (this.options.orientation === 'x') {
              this._trigger(dist > 0 ? 'right' : 'left');
            } else {
              this._trigger(dist > 0 ? 'down' : 'up');
            }
          }
        }, this));
        function isNonTouchPointer(event) {
          return event.originalEvent.pointerType && event.originalEvent.pointerType !== event.originalEvent.MSPOINTER_TYPE_TOUCH && event.originalEvent.pointerType !== 'touch';
        }
      }
    });
  })($);

  const hideText = function () {
    function element() {
      return $('body');
    }
    function prefix(event) {
      return _.map(event.split(' '), function (e) {
        return 'hidetext' + e;
      }).join(' ');
    }
    $(function () {
      element().on('keydown', function (event) {
        if (event.keyCode == 27) {
          hideText.deactivate();
        }
      });
    });
    return {
      isActive: function () {
        return element().hasClass('hideText');
      },
      toggle: function () {
        if (this.isActive()) {
          this.deactivate();
        } else {
          this.activate();
        }
      },
      activate: function () {
        if (!this.isActive()) {
          element().addClass('hideText');
          element().trigger('hidetextactivate');
        }
      },
      deactivate: function () {
        if (this.isActive()) {
          element().removeClass('hideText');
          element().trigger('hidetextdeactivate');
        }
      },
      on: function (event, callback) {
        element().on(prefix(event), callback);
      },
      off: function (event, callback) {
        element().off(prefix(event), callback);
      }
    };
  }();

  (function ($) {
    $.widget('pageflow.hideTextOnSwipe', {
      _create: function () {
        this.element.swipeGesture({
          orientation: 'x',
          eventTargetSelector: this.options.eventTargetSelector
        });
        this.element.on('swipegestureleft', function () {
          hideText.activate();
        });
        this.element.on('touchstart MSPointerDown pointerdown mousedown', this.options.eventTargetSelector, function () {
          if (hideText.isActive()) {
            hideText.deactivate();
          }
        });
        this.element.on('scrollermove', function () {
          if (hideText.isActive()) {
            hideText.deactivate();
          }
        });
      }
    });
  })($);

  const DomOrderScrollNavigator = function (slideshow, entryData) {
    this.getLandingPage = function (pages) {
      return pages.first();
    };
    this.back = function (currentPage, pages) {
      var position = 'bottom';
      var previousPage = this.getPreviousPage(currentPage, pages);
      if (previousPage.is(getParentPage(currentPage, pages))) {
        position = null;
      }
      slideshow.goTo(previousPage, {
        position: position,
        ignoreInHistory: true
      });
    };
    this.next = function (currentPage, pages) {
      slideshow.goTo(this.getNextPage(currentPage, pages), {
        ignoreInHistory: true
      });
    };
    this.nextPageExists = function (currentPage, pages) {
      return !!this.getNextPage(currentPage, pages).length;
    };
    this.previousPageExists = function (currentPage, pages) {
      return !!this.getPreviousPage(currentPage, pages).length;
    };
    this.getNextPage = function (currentPage, pages) {
      var currentPageIndex = pages.index(currentPage);
      var nextPage = currentPageIndex < pages.length - 1 ? $(pages.get(currentPageIndex + 1)) : $();
      if (sameStoryline(currentPage, nextPage)) {
        return nextPage;
      }
      var scrollSuccessor = getScrollSuccessor(currentPage, pages);
      if (scrollSuccessor.length) {
        return scrollSuccessor;
      }
      return getParentPage(currentPage, pages);
    };
    this.getPreviousPage = function (currentPage, pages) {
      var currentPageIndex = pages.index(currentPage);
      var previousPage = currentPageIndex > 0 ? $(pages.get(currentPageIndex - 1)) : $();
      if (sameStoryline(currentPage, previousPage)) {
        return previousPage;
      }
      return getParentPage(currentPage, pages);
    };
    this.getTransitionDirection = function (previousPage, currentPage, pages, options) {
      return pages.index(currentPage) > pages.index(previousPage) ? 'forwards' : 'backwards';
    };
    this.getDefaultTransition = function (previousPage, currentPage, pages) {
      if (inParentStorylineOf(currentPage, previousPage, pages)) {
        return getStorylinePageTransition(currentPage);
      } else if (inParentStorylineOf(previousPage, currentPage, pages)) {
        return getStorylinePageTransition(previousPage);
      }
    };
    function inParentStorylineOf(page, otherPage, pages) {
      var parentPage = getParentPage(page, pages);
      return entryData.getStorylineIdByPagePermaId(parentPage.page('getPermaId')) == entryData.getStorylineIdByPagePermaId(otherPage.page('getPermaId'));
    }
    function sameStoryline(page1, page2) {
      return entryData.getStorylineIdByPagePermaId(page1.page('getPermaId')) == entryData.getStorylineIdByPagePermaId(page2.page('getPermaId'));
    }
    function getParentPage(page, pages) {
      var storylineConfiguration = getStorylineConfiguration(page);
      if ('parent_page_perma_id' in storylineConfiguration && entryData.getSiteOption('change_to_parent_page_at_storyline_boundary')) {
        return pages.filter('#' + storylineConfiguration.parent_page_perma_id);
      }
      return $();
    }
    function getStorylinePageTransition(page) {
      var storylineConfiguration = getStorylineConfiguration(page);
      return storylineConfiguration.page_transition || 'scroll_over_from_right';
    }
    function getScrollSuccessor(page, pages) {
      var storylineConfiguration = getStorylineConfiguration(page);
      if ('scroll_successor_id' in storylineConfiguration) {
        return pages.filter('#' + storylineConfiguration.scroll_successor_id);
      }
      return $();
    }
    function getStorylineConfiguration(page) {
      var permaId = page.page('getPermaId');
      var storylineId = entryData.getStorylineIdByPagePermaId(permaId);
      return entryData.getStorylineConfiguration(storylineId);
    }
  };

  const Slideshow = function ($el, configurations) {
    var transitioning = false,
      currentPage = $(),
      pages = $(),
      that = this,
      currentPageIndex;
    configurations = configurations || {};
    function transitionMutex(fn, context) {
      if (transitioning) {
        return;
      }
      transitioning = true;
      var transitionDuration = fn.call(context);
      setTimeout(function () {
        transitioning = false;
      }, transitionDuration);
    }
    function nearestPage(index) {
      var result = $(pages.get(index));
      if (!result.length) {
        return pages.last();
      }
      return result;
    }
    this.nextPageExists = function () {
      return this.scrollNavigator.nextPageExists(currentPage, pages);
    };
    this.previousPageExists = function () {
      return this.scrollNavigator.previousPageExists(currentPage, pages);
    };
    this.isOnLandingPage = function () {
      return currentPage.is(this.scrollNavigator.getLandingPage(pages));
    };
    this.goToLandingPage = function () {
      this.goTo(this.scrollNavigator.getLandingPage(pages));
    };
    this.back = function () {
      this.scrollNavigator.back(currentPage, pages);
    };
    this.next = function () {
      this.scrollNavigator.next(currentPage, pages);
    };
    this.parentPageExists = function () {
      return !!state$1.entryData.getParentPagePermaIdByPagePermaId(this.currentPagePermaId());
    };
    this.goToParentPage = function () {
      this.goToByPermaId(state$1.entryData.getParentPagePermaIdByPagePermaId(this.currentPagePermaId()));
    };
    this.goToById = function (id, options) {
      return this.goTo($el.find('[data-id=' + id + ']'), options);
    };
    this.goToByPermaId = function (permaId, options) {
      if (permaId) {
        return this.goTo(getPageByPermaId(permaId), options);
      }
    };
    this.goTo = function (page, options) {
      options = options || {};
      if (page.length && !page.is(currentPage)) {
        var cancelled = false;
        events.trigger('page:changing', {
          cancel: function () {
            cancelled = true;
          }
        });
        if (cancelled) {
          return;
        }
        transitionMutex(function () {
          var previousPage = currentPage;
          currentPage = page;
          currentPageIndex = currentPage.index();
          var transition = options.transition || this.scrollNavigator.getDefaultTransition(previousPage, currentPage, pages);
          var direction = this.scrollNavigator.getTransitionDirection(previousPage, currentPage, pages, options);
          var outDuration = previousPage.page('deactivate', {
            direction: direction,
            transition: transition
          });
          var inDuration = currentPage.page('activate', {
            direction: direction,
            position: options.position,
            transition: transition
          });
          currentPage.page('preload');
          $el.trigger('slideshowchangepage', [options]);
          return Math.max(outDuration, inDuration);
        }, this);
        return true;
      }
    };
    this.goToFirstPage = function () {
      return this.goTo(pages.first());
    };
    this.update = function (options) {
      pages = $el.find('section.page');
      pages.each(function (index) {
        var $page = $(this);
        $page.page({
          index: index,
          configuration: configurations[$page.data('id')]
        });
      });
      ensureCurrentPage(options);
    };
    this.currentPage = function () {
      return currentPage;
    };
    this.currentPagePermaId = function () {
      return parseInt(currentPage.attr('id'), 10);
    };
    this.currentPageConfiguration = function () {
      return currentPage.page('getConfiguration');
    };
    function ensureCurrentPage(options) {
      var newCurrentPage = findNewCurrentPage(options);
      if (newCurrentPage) {
        currentPage = newCurrentPage;
        currentPageIndex = currentPage.index();
        currentPage.page('activateAsLandingPage');
        currentPage.page('preload');
      }
    }
    function findNewCurrentPage(options) {
      if (!currentPage.length) {
        var permaId = options && options.landingPagePermaId;
        var landingPage = permaId ? getPageByPermaId(permaId) : $();
        return landingPage.length ? landingPage : that.scrollNavigator.getLandingPage(pages);
      } else if (!currentPage.parent().length) {
        return nearestPage(currentPageIndex);
      }
    }
    function getPageByPermaId(permaId) {
      return $el.find('#' + parseInt(permaId, 10));
    }
    this.on = function () {
      $el.on.apply($el, arguments);
    };
    this.triggerResizeHooks = function () {
      currentPage.page('resize');
      events.trigger('resize');
    };
    $el.on(navigationDirection.getEventName('scrollerbumpback'), _.bind(function (event) {
      if (currentPage.page('isPageChangeAllowed', {
        type: 'bumpback'
      })) {
        this.back();
      }
    }, this));
    $el.on(navigationDirection.getEventName('scrollerbumpnext'), _.bind(function (event) {
      if (currentPage.page('isPageChangeAllowed', {
        type: 'bumpnext'
      })) {
        this.next();
      }
    }, this));
    $el.on('click', 'a.to_top', _.bind(function () {
      this.goToLandingPage();
    }, this));
    $(window).on('resize', this.triggerResizeHooks);
    nativeScrolling.preventScrollBouncing($el);
    $el.addClass('slideshow');
    $el.find('.hidden_text_indicator').hiddenTextIndicator({
      parent: $('body')
    });
    this.on('slideshowchangepage', function () {
      hideText.deactivate();
    });
    $el.find('.scroll_indicator').scrollIndicator({
      parent: this
    });
    this.scrollNavigator = new DomOrderScrollNavigator(this, state$1.entryData);
    AdjacentPreloader.create(function () {
      return pages;
    }, this.scrollNavigator).attach(events);
    SuccessorPreparer.create(function () {
      return pages;
    }, this.scrollNavigator).attach(events);
  };
  Slideshow.setup = function (options) {
    function configurationsById(pages) {
      return _.reduce(pages, function (memo, page) {
        memo[page.id] = page.configuration;
        return memo;
      }, {});
    }
    state$1.slides = new Slideshow(options.element, configurationsById(options.pages));
    features.enable('slideshow', options.enabledFeatureNames || []);
    state$1.atmo = Atmo.create(state$1.slides, events, state$1.audio, backgroundMedia);
    state$1.history = History.create(state$1.slides, {
      simulate: options.simulateHistory
    });
    if (options.beforeFirstUpdate) {
      options.beforeFirstUpdate();
    }
    state$1.slides.update({
      landingPagePermaId: state$1.history.getLandingPagePermaId()
    });
    state$1.history.start();
    return state$1.slides;
  };

  $(function ($) {
    $('body').on('click', 'a.navigation_main', function () {
      events.trigger('button:header');
    });
    $('body').on('click', 'a.navigation_index', function () {
      events.trigger('button:overview');
    });
    $('body').on('click', 'a.navigation_fullscreen', function () {
      events.trigger('button:fullscreen');
    });
    $('body').on('click', '.mute a', function () {
      events.trigger('button:mute');
    });
    $('body').on('click', 'a.share.facebook', function () {
      events.trigger('share:facebook');
    });
    $('body').on('click', 'a.share.twitter', function () {
      events.trigger('share:twitter');
    });
    $('body').on('click', 'a.share.google', function () {
      events.trigger('share:google');
    });
    $('body').on('pageactivate', function (event, ui) {
      events.trigger('page:change', ui.page);
    });
  });

  (function ($) {
    $.widget('pageflow.fullscreenButton', {
      _create: function () {
        fullscreen.on('change', this.update, this);
        this.update();
        this.element.click(function () {
          fullscreen.toggle();
        });
        if (!fullscreen.isSupported()) {
          this.element.css('visibility', 'hidden');
        }
      },
      _destroy: function () {
        fullscreen.off('change', this.update);
      },
      update: function () {
        this.element.toggleClass('active', !!fullscreen.isActive()).updateTitle();
      }
    });
  })($);

  $(function ($) {
    $.widget('pageflow.header', {
      _create: function () {
        var slideshow = this.options.slideshow,
          that = this;
        slideshow.on('pageactivate', function (event, options) {
          updateClasses(slideshow.currentPage());
        });
        slideshow.on('scrollerneartop', function (event) {
          var page = $(event.target).parents('section');
          if (page.is(slideshow.currentPage())) {
            that.element.addClass('near_top');
          }
        });
        slideshow.on('scrollernotneartop', function (event) {
          var page = $(event.target).parents('section');
          if (page.is(slideshow.currentPage())) {
            that.element.removeClass('near_top');
          }
        });
        if (slideshow.currentPage().length) {
          updateClasses(slideshow.currentPage());
        }
        this.element.addClass('near_top');
        this.element.find('.header input').placeholder();
        function updateClasses(page) {
          that.element.toggleClass('invert', page.hasClass('invert'));
          that.element.toggleClass('first_page', page.index() === 0);
          that.element.toggleClass('hide_logo', page.hasClass('hide_logo'));
        }
      }
    });
  });

  (function ($) {
    $.widget('pageflow.multimediaAlert', {
      _create: function () {
        var widget = this;
        function show() {
          widget.element.show();
          toggleContent(false);
        }
        function hide() {
          widget.element.hide();
          toggleContent(true);
        }
        function toggleContent(state) {
          $('.page .content').toggleClass('initially_hidden', !state);
          $('.slideshow .scroll_indicator').toggleClass('initially_hidden', !state);
        }
        manualStart.required().then(function (start) {
          show();
          widget.element.find('.close').one('click', function () {
            hide();
            backgroundMedia.unmute();
            events.trigger('button:close_multimedia_alert');
            start();
            return false;
          });
        });
        events.on('request:multimedia_alert', function () {
          show();
          widget.element.find('.close').one('click', function () {
            hide();
          });
        }, this);
        nativeScrolling.preventScrollBouncing(this.element);
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.muteButton', {
      _create: function () {
        var element = this.element;
        var volumeBeforeMute = 1;
        element.on('click', toggleMute);
        settings.on('change:volume', this.update, this);
        this.update();
        function toggleMute() {
          if (settings.get('volume') > 0) {
            volumeBeforeMute = settings.get('volume');
            settings.set('volume', 0);
          } else {
            settings.set('volume', volumeBeforeMute);
          }
        }
      },
      _destroy: function () {
        settings.off('change:volume', this.update);
      },
      update: function () {
        var volume = settings.get('volume');
        if (volume === 0) {
          this.element.attr('title', this.element.attr('data-muted-title')).addClass('muted');
        } else {
          this.element.attr('title', this.element.attr('data-not-muted-title')).removeClass('muted');
        }
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.navigation', {
      _create: function () {
        var element = this.element,
          overlays = element.find('.navigation_site_detail'),
          toggleIndicators = function () {};
        element.addClass('js').append(overlays);
        $('a.navigation_top', element).topButton();
        $('.navigation_bar_bottom', element).append($('.navigation_bar_top > li', element).slice(-2));
        $('.navigation_volume_box', element).volumeSlider({
          orientation: 'h'
        });
        $('.navigation_mute', element).muteButton();

        /* hide volume button on mobile devices */

        if (browser.has('mobile platform')) {
          $('li.mute', element).hide();
          $('.navigation_bar_bottom', element).css('height', '224px');
          $('.scroller', element).css('bottom', '224px');
          $('.navigation_scroll_indicator.bottom', element).css('bottom', '190px');
        }

        /* header button */
        $('.navigation_main', element).click(function () {
          $(this).toggleClass('active').updateTitle();
          $('.header').toggleClass('active');
        });

        /* open header through skiplinks */
        $('a[href="#header"], a[href="#search"]', '#skipLinks').click(function () {
          $('.navigation_main', element).addClass('active');
          $('.header').addClass('active');
          $(this.getAttribute('href')).select();
        });

        /* share-button */
        $('.navigation_menu .navigation_menu_box a', element).focus(function () {
          $(this).parents('.navigation_menu').addClass('focused');
        }).blur(function () {
          $(this).parents('.navigation_menu').removeClass('focused');
        });
        var shareBox = $('.navigation_share_box', element),
          links = $('.share_box_icons > a', shareBox);
        shareBox.shareMenu({
          subMenu: $('.sub_share', element),
          links: links,
          insertAfter: $('.share_box_icons'),
          closeOnMouseLeaving: shareBox
        });

        /* pages */
        var pageLinks = $('.navigation_thumbnails a', element),
          target;
        function registerHandler() {
          target = $(this);
          target.one('mouseup touchend', goToPage);
        }
        function removeHandler() {
          pageLinks.off('mouseup touchend', goToPage);
        }
        function hideOverlay() {
          $(overlays).addClass('hidden').removeClass('visible');
        }
        function goToPage(e) {
          if (target && target[0] != e.currentTarget) {
            return;
          }
          hideOverlay();
          state$1.slides.goToById(this.getAttribute("data-link"));
          e.preventDefault();
        }
        pageLinks.each(function (index) {
          var handlerIn = function () {
            if (!('ontouchstart' in document.documentElement)) {
              $(overlays[index]).css("top", $(this).offset().top).addClass('visible').removeClass('hidden');
              overlays.loadLazyImages();
            }
          };
          $(this).on({
            'mouseenter': handlerIn,
            'mouseleave': hideOverlay,
            'mousedown touchstart': registerHandler,
            'click': goToPage
          });
        });
        $(window).on('resize', function () {
          $(overlays).css("top", "0");
          initiateIndicators();
        });
        var initiateIndicators = function () {
          setTimeout(function () {
            $('.navigation_scroll_indicator', element).show();
            toggleIndicators();
          }, 500);
        };
        $('.scroller', element).each(function () {
          var bottomIndicator = $('.navigation_scroll_indicator.bottom', element),
            topIndicator = $('.navigation_scroll_indicator.top', element),
            scrollUpIntervalID,
            scrollDownIntervalID,
            hideOverlay = function () {
              overlays.addClass('hidden').removeClass('visible');
            };
          var atBoundary = function (direction) {
            if (direction === 'up') {
              return scroller.y >= 0;
            } else {
              return scroller.y <= scroller.maxScrollY;
            }
          };
          toggleIndicators = function () {
            if (atBoundary('down')) {
              clearInterval(scrollDownIntervalID);
              bottomIndicator.removeClass('pressed');
            }
            if (atBoundary('up')) {
              clearInterval(scrollUpIntervalID);
              topIndicator.removeClass('pressed');
            }
            topIndicator.toggleClass('visible', !atBoundary('up'));
            bottomIndicator.toggleClass('visible', !atBoundary('down'));
          };
          var keyPressHandler = function (e) {
            var that = this,
              scrollByStep = function () {
                if ($(that).hasClass('bottom')) {
                  scroller.scrollBy(0, -20, 80);
                } else {
                  scroller.scrollBy(0, 20, 80);
                }
                toggleIndicators();
              };
            if (e.which == 13) {
              scrollByStep();
              setTimeout(function () {
                that.focus();
              }, 50);
            } else if (e.which === 0) {
              scrollByStep();
            }
          };
          var scrollerOptions = {
            mouseWheel: true,
            bounce: false,
            probeType: 2
          };

          /*
            This is just a quick fix to detect IE10. We should
            refactor this condition if we decide to use Modernizr
            or another more global detection.
           */
          if (window.navigator.msPointerEnabled) {
            scrollerOptions.preventDefault = false;
          }
          var scroller = new IScroll(this, scrollerOptions);
          $('ul.navigation_thumbnails', element).pageNavigationList({
            scroller: scroller,
            scrollToActive: true,
            animationDuration: 500,
            lazyLoadImages: true,
            onAnimationStart: function () {
              element.addClass('is_animating');
            },
            onAnimationEnd: function () {
              element.removeClass('is_animating');
            },
            onFilterChange: function () {
              toggleIndicators();
            }
          });
          ready.then(function () {
            toggleIndicators();
          });
          topIndicator.on({
            'mousedown': function () {
              scrollUpIntervalID = setInterval(function () {
                scroller.scrollBy(0, 1);
                toggleIndicators();
              }, 5);
            },
            'keypress': keyPressHandler,
            'touchstart': keyPressHandler
          });
          topIndicator.on('mouseup touchend', function () {
            clearInterval(scrollUpIntervalID);
          });
          bottomIndicator.on({
            'mousedown': function () {
              scrollDownIntervalID = setInterval(function () {
                scroller.scrollBy(0, -1);
                toggleIndicators();
              }, 5);
            },
            'keypress': keyPressHandler,
            'touchstart': keyPressHandler
          });
          bottomIndicator.on('mouseup touchend', function () {
            clearInterval(scrollDownIntervalID);
          });
          toggleIndicators();
          scroller.on('scroll', function () {
            toggleIndicators();
            hideOverlay();
            removeHandler();
          });
        });

        /* hide text button */
        var hideTextElement = $('.navigation_hide_text', element);
        hideTextElement.click(function () {
          hideText.toggle();
        });
        hideText.on('activate deactivate', function () {
          hideTextElement.toggleClass('active', hideText.isActive()).updateTitle();
        });

        /* fullscreen button */
        $('.navigation_bar_bottom .fullscreen a', element).fullscreenButton();
        $('.button, .navigation_mute, .navigation_scroll_indicator', element).on({
          'touchstart mousedown': function () {
            $(this).addClass('pressed');
          },
          'touchend mouseup': function () {
            $(this).removeClass('pressed');
          }
        });
        $('.navigation_share, .navigation_credits', element).on({
          'touchstart': function () {
            var element = $(this).parent().parent();
            element.addClass('open');
            function close(e) {
              if (!element.find(e.target).length) {
                element.removeClass('open');
                $('body').off('touchstart', close);
              }
            }
            $('body').on('touchstart', close);
          }
        });
        $('li', element).on('mouseleave', function () {
          $(this).blur();
        });
        $('body').on({
          'pageactivate': function (e) {
            toggleIndicators();
          }
        });
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.navigationMobile', {
      _create: function () {
        var that = this,
          element = this.element,
          scroller;
        nativeScrolling.preventScrollBouncing(element);
        $('body').on('touchstart mousedown MSPointerDown pointerdown', function (event) {
          if (element.hasClass('active') && !$(event.target).parents().filter(element).length) {
            element.removeClass('active imprint sharing');
          }
        });
        $('.menu.index', element).click(function () {
          if (!$(element).hasClass('sharing') && !$(element).hasClass('imprint')) {
            $(element).toggleClass('active');
            element.loadLazyImages();
          }
          $(element).removeClass('imprint sharing');
        });
        $('.menu.sharing', element).click(function () {
          $(element).addClass('sharing');
          $(element).removeClass('imprint');
        });
        $('.menu.imprint', element).click(function () {
          $(element).addClass('imprint');
          $(element).removeClass('sharing');
        });
        $('.imprint_mobile a', element).on('click touchstart', function (event) {
          event.stopPropagation();
        });
        $('.parent_page', element).parentPageButton({
          visibleClass: 'is_visible'
        });
        $('.wrapper', element).each(function () {
          var sharingMobile = $(this).parents('.sharing_mobile');
          scroller = new IScroll(this, {
            preventDefault: false,
            mouseWheel: true,
            bounce: false,
            probeType: 3
          });
          $('ul.pages', element).pageNavigationList({
            scroller: scroller,
            animationDuration: 500
          });
          scroller.on('scroll', function () {
            $('.overview_mobile li', element).removeClass('touched').off('touchend mouseup MSPointerUp pointerup', that._goToPage);
            $('.sub_share a', sharingMobile).off('touchend mouseup MSPointerUp pointerup', that._openLink);
          });
          $('.menu', element).click(function () {
            scroller.refresh();
          });
          if (!$(element).data('touchBound')) {
            $('li', element).on({
              'touchstart mousedown MSPointerDown pointerdown': function () {
                $(this).addClass('touched');
              },
              'touchend mouseup MSPointerUp pointerup': function () {
                $(this).removeClass('touched');
              }
            });
            $('.overview_mobile li', element).on({
              'touchstart mousedown MSPointerDown pointerdown': function () {
                $(this).one('touchend mouseup MSPointerUp pointerup', that._goToPage);
              }
            });
            $(element).data('touchBound', true);
          }
          $('.sub_share a', sharingMobile).on({
            'touchstart mousedown MSPointerDown pointerdown': function () {
              $(this).one('touchend mouseup MSPointerUp pointerup', that._openLink);
            }
          });
          sharingMobile.shareMenu({
            subMenu: $('.sub_share', element),
            links: $('li > a', sharingMobile),
            scroller: scroller
          });
        });
      },
      _goToPage: function () {
        var a = $('a', this),
          id = a.attr("data-link");
        if (id !== undefined) {
          state$1.slides.goToById(id);
          $('.navigation_mobile').removeClass('active');
        }
      },
      _openLink: function (event) {
        event.preventDefault();
        window.open(this.href, '_blank');
      }
    });
  })($);

  $(function ($) {
    $.widget('pageflow.overview', {
      _create: function () {
        var that = this,
          scroller,
          chapterParts = $('.ov_chapter', this.element),
          pages = $('.ov_page', this.element),
          noOfChapterParts = chapterParts.size(),
          scrollerWidth = noOfChapterParts * chapterParts.outerWidth(true),
          closeButton = $('.close', this.element),
          indexButton = $('.navigation_index'),
          overview = $('.overview'),
          wrapper = $('.wrapper', this.element);
        var toggleContent = function (state) {
          var scrollIndicator = $('.slideshow .scroll_indicator');
          overview.toggleClass('active', state);
          overview.loadLazyImages();
          indexButton.toggleClass('active', state).updateTitle();
          $('section.page').toggleClass('hidden_by_overlay', state);
          scrollIndicator.toggleClass('hidden', state);
          if (overview.hasClass('active')) {
            events.once('page:change', function () {
              toggleContent(false);
            }, that);
          } else {
            events.off('page:change', null, that);
          }
        };
        var goToPage = function () {
          if (!$(this).hasClass('active')) {
            state$1.slides.goToById(this.getAttribute("data-link"));
          }
        };
        $('.scroller', this.element).width(scrollerWidth);
        if (wrapper.find('.ov_chapter').length) {
          // scroller throws exception if initialized with empty set
          // of pages

          scroller = new IScroll(wrapper[0], {
            snap: '.ov_chapter',
            bounce: false,
            scrollX: true,
            scrollY: false,
            probeType: 2,
            mouseWheel: true,
            preventDefault: false
          });
          scroller.on('scroll', function () {
            pages.removeClass('touched').off('touchend mouseup', goToPage);
          });
          wrapper.pageNavigationList({
            scroller: scroller,
            scrollToActive: '.ov_chapter'
          });
          this.element.find('.overview_scroll_indicator.left').scrollButton({
            scroller: scroller,
            page: true,
            direction: 'left'
          });
          this.element.find('.overview_scroll_indicator.right').scrollButton({
            scroller: scroller,
            page: true,
            direction: 'right'
          });
        }
        pages.each(function () {
          $(this).on({
            'touchstart mousedown': function () {
              $(this).addClass('touched');
              $(this).one('touchend mouseup', goToPage);
            },
            'touchend mouseup': function () {
              $(this).removeClass('touched');
            },
            'click': function (event) {
              event.preventDefault();
            }
          });
        });
        if (scrollerWidth < wrapper.width()) {
          var closeButtonPos = Math.max(400, scrollerWidth - closeButton.width() - 10);
          if (isDirLtr(closeButton)) {
            closeButton.css({
              left: closeButtonPos + 'px',
              right: 'auto'
            });
          } else {
            closeButton.css({
              right: closeButtonPos + 'px',
              left: 'auto'
            });
          }
        }
        closeButton.click(toggleContent);
        indexButton.click(toggleContent);
        $('body').keyup(function (e) {
          if (e.which == 27 && overview.hasClass('active')) {
            toggleContent();
          }
        });
        function isDirLtr(el) {
          var styles = window.getComputedStyle(el[0]);
          return styles.direction == 'ltr';
        }
      }
    });
  });

  const PageNavigationListAnimation = BaseObject.extend({
    initialize: function (entryData) {
      this.entry = entryData;
    },
    update: function (currentPagePermaId) {
      var currentPagePosition = this.entry.getPagePosition(currentPagePermaId);
      var currentStorylineId = this.entry.getStorylineIdByPagePermaId(currentPagePermaId);
      var currentStorylineLevel = this.entry.getStorylineLevel(currentStorylineId);
      this.enabled = this.lastStorylineId && this.lastStorylineId !== currentStorylineId;
      this.movingUp = this.lastStorylineLevel > currentStorylineLevel;
      this.movingDown = this.lastStorylineLevel < currentStorylineLevel;
      this.movingForwards = this.lastStorylineLevel === currentStorylineLevel && this.lastPagePosition < currentPagePosition;
      this.movingBackwards = this.lastStorylineLevel === currentStorylineLevel && this.lastPagePosition > currentPagePosition;
      this.lastPagePosition = currentPagePosition;
      this.lastStorylineId = currentStorylineId;
      this.lastStorylineLevel = currentStorylineLevel;
    },
    start: function (element, visible) {
      if (this.enabled) {
        element.toggleClass('moving_up', this.movingUp);
        element.toggleClass('moving_down', this.movingDown);
        element.toggleClass('moving_forwards', this.movingForwards);
        element.toggleClass('moving_backwards', this.movingBackwards);
        element.toggleClass('animate_out', !visible);
      }
    },
    finish: function (element, visible) {
      if (this.enabled) {
        element.toggleClass('animate_in', !!visible);
      }
    }
  });
  PageNavigationListAnimation.create = function () {
    return new PageNavigationListAnimation(state$1.entryData);
  };

  (function ($) {
    $.widget('pageflow.pageNavigationList', {
      _create: function () {
        var element = this.element;
        var options = this.options;
        var scroller = options.scroller;
        var links = element.find('a[href]');
        var chapterFilter = ChapterFilter.create();
        var highlightedPage = HighlightedPage.create(options.highlightedPage);
        var animation = PageNavigationListAnimation.create();
        ready.then(function () {
          highlightUnvisitedPages(state$1.visited.getUnvisitedPages());
          update(getPagePermaId(state$1.slides.currentPage()));
        });
        state$1.slides.on('pageactivate', function (e) {
          setPageVisited(e.target.getAttribute('id'));
          update(getPagePermaId(e.target));
        });
        function getPagePermaId(section) {
          return parseInt($(section).attr('id') || $(section).attr('data-perma-id'), 10);
        }
        function update(currentPagePermaId) {
          var highlightedPagePermaId = highlightedPage.getPagePermaId(currentPagePermaId);
          var highlightedChapterId = state$1.entryData.getChapterIdByPagePermaId(highlightedPagePermaId);
          element.toggleClass('inside_sub_chapter', highlightedPagePermaId !== currentPagePermaId);
          filterChapters(currentPagePermaId).then(function () {
            highlightPage(highlightedPagePermaId, {
              animate: !animation.enabled
            });
            highlightChapter(highlightedChapterId);
            if (options.onFilterChange) {
              options.onFilterChange();
            }
          });
        }
        function highlightPage(permaId, highlightOptions) {
          links.each(function () {
            var link = $(this);
            var active = '#' + permaId === link.attr('href');
            link.toggleClass('active', active);
            link.attr('tabindex', active ? '-1' : '3');
            if (active) {
              if (options.scrollToActive) {
                var target = options.scrollToActive === true ? link : link.parents(options.scrollToActive);
                scroller.scrollToElement(target[0], highlightOptions.animate ? 800 : 0);
              }
            }
          });
        }
        function highlightChapter(activeChapterId) {
          links.each(function () {
            var link = $(this);
            var active = activeChapterId === link.data('chapterId');
            link.toggleClass('in_active_chapter', active);
          });
        }
        function highlightUnvisitedPages(ids) {
          links.each(function () {
            var link = $(this);
            var unvisited = ids.indexOf(parseInt(link.attr('href').substr(1), 10)) >= 0;
            link.toggleClass('unvisited', unvisited);
          });
        }
        function setPageVisited(id) {
          element.find('[href="#' + id + '"]').removeClass('unvisited');
        }
        function filterChapters(currentPagePermaId) {
          animation.update(currentPagePermaId);
          links.each(function () {
            var link = $(this);
            animation.start(link.parent(), visible(currentPagePermaId, link));
          });
          return $.when(animation.enabled && animationDurationElapsed()).then(function () {
            links.each(function () {
              var link = $(this);
              var pageIsVisible = visible(currentPagePermaId, link);
              animation.finish(link.parent(), pageIsVisible);
              link.parent().andSelf().toggleClass('filtered', !pageIsVisible);
              if (pageIsVisible && options.lazyLoadImages) {
                link.loadLazyImages();
              }
            });
            scroller.refresh();
          });
        }
        function visible(currentPagePermaId, link) {
          return chapterFilter.chapterVisibleFromPage(currentPagePermaId, link.data('chapterId'));
        }
        function animationDurationElapsed() {
          if (options.animationDuration) {
            if (options.onAnimationStart) {
              options.onAnimationStart();
            }
            return $.Deferred(function (deferred) {
              setTimeout(function () {
                deferred.resolve();
                if (options.onAnimationEnd) {
                  setTimeout(options.onAnimationEnd, 500);
                }
              }, 500);
            }).promise();
          }
        }
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.parentPageButton', {
      _create: function () {
        var element = this.element;
        var options = this.options;
        element.click(function (event) {
          state$1.slides.goToParentPage();
          event.preventDefault();
        });
        state$1.slides.on('pageactivate', function (e, ui) {
          update();
        });
        update();
        function update() {
          var pagePermaId = parseInt(state$1.slides.currentPage().attr('id'), 10);
          var chapterId = state$1.entryData.getChapterIdByPagePermaId(pagePermaId);
          var chapterConfiguration = state$1.entryData.getChapterConfiguration(chapterId);
          var visible = state$1.slides.parentPageExists() && chapterConfiguration.display_parent_page_button !== false;
          if (options.visibleClass) {
            element.toggleClass(options.visibleClass, visible);
          } else {
            element.toggle(visible);
          }
        }
      }
    });
  })($);

  $.widget('pageflow.playerControls', {
    _create: function () {
      var player = this.options.player;
      var playButton = this.element.find('.vjs-play-control');
      var progressHolder = this.element.find('.vjs-progress-holder');
      var playProgress = this.element.find('.vjs-play-progress');
      var currentTimeDisplay = this.element.find('.vjs-current-time-display');
      var durationDisplay = this.element.find('.vjs-duration-display');
      var progressHandler = this.element.find('.vjs-slider-handle');
      var smallTimestamp = durationDisplay.html().length === 5 && durationDisplay.html().charAt(0) === "0";
      if (smallTimestamp) {
        durationDisplay.html("0:00");
        currentTimeDisplay.html(currentTimeDisplay.html().substr(1));
      } else {
        durationDisplay.html("00:00");
      }
      player.on('timeupdate', function (position, duration) {
        var percent = duration > 0 ? player.position / player.duration * 100 : 0;
        if (!isNaN(position)) {
          if (player.duration < 600) {
            $(currentTimeDisplay).html(player.formatTime(position).substr(1));
            $(durationDisplay).html(player.formatTime(duration).substr(1));
          } else {
            $(currentTimeDisplay).html(player.formatTime(position));
            $(durationDisplay).html(player.formatTime(duration));
          }
        }
        var handlerLeft = (progressHolder.width() - progressHandler.width()) * percent / 100;
        progressHandler.css({
          left: handlerLeft + 'px'
        });
        playProgress.css({
          width: percent + "%"
        });
      });
      player.on('play', function (position, duration) {
        $(playButton).removeClass('vjs-play');
        $(playButton).addClass('vjs-pause vjs-playing');
      });
      player.on('pause', function (position, duration) {
        $(playButton).removeClass('vjs-pause vjs-playing');
        $(playButton).addClass('vjs-play');
      });
      player.on('ended', function (position, duration) {
        $(playButton).removeClass('vjs-pause vjs-playing');
        $(playButton).addClass('vjs-play');
      });
      function togglePlay() {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
      }
      playButton.on({
        'mousedown touchstart': function () {
          $(this).addClass('pressed');
        },
        'mouseup touchend': function () {
          $(this).removeClass('pressed');
        },
        'click': function () {
          togglePlay();
        },
        'keypress': function (e) {
          if (e.which == 13) {
            var that = this;
            togglePlay();
            setTimeout(function () {
              $(that).focus();
            }, 20);
          }
        }
      });
      $(progressHolder).on('mousedown touchstart', function (event) {
        player.seek(getSeekPosition(event));
        $('body').on({
          'mousemove touchmove': onMouseMove,
          'mouseup touchend': onMouseUp
        });
        function onMouseMove(event) {
          player.seek(getSeekPosition(event));
        }
        function onMouseUp() {
          $('body').off({
            'mousemove touchmove': onMouseMove,
            'mouseup touchend': onMouseUp
          });
        }
        function getSeekPosition(event) {
          var position = getPointerPageX(event) - $(progressHolder).offset().left;
          var fraction = position / $(progressHolder).width();
          return Math.min(Math.max(fraction, 0), 1) * player.duration;
        }
        function getPointerPageX(event) {
          if (event.originalEvent.changedTouches) {
            return event.originalEvent.changedTouches[0].pageX;
          } else {
            return event.pageX;
          }
        }
      });
    }
  });

  (function ($) {
    var SPACE_KEY = 32;
    $.widget('pageflow.scrollButton', {
      _create: function () {
        var element = this.element;
        var scroller = this.options.scroller;
        var direction = this.options.direction;
        scroller.on('scrollEnd', function () {
          updateVisibility();
        });
        this.element.on('click', function () {});
        if (this.options.page) {
          element.on({
            click: function () {
              changePage();
              element.blur();
              return false;
            },
            keypress: function (e) {
              if (e.which == SPACE_KEY) {
                changePage();
              }
            },
            touchstart: function () {
              changePage();
            }
          });
        }
        updateVisibility();
        function updateVisibility() {
          element.toggle(!atBoundary());
        }
        function changePage() {
          if (direction === 'top' || direction === 'left') {
            scroller.prev();
          } else if (direction === 'down' || direction === 'right') {
            scroller.next();
          }
        }
        function atBoundary() {
          if (direction === 'top') {
            return scroller.y >= 0;
          } else if (direction === 'left') {
            return scroller.x >= 0;
          } else if (direction === 'down') {
            return scroller.y <= scroller.maxScrollY;
          } else {
            return scroller.x <= scroller.maxScrollX;
          }
        }
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.shareMenu', {
      _create: function () {
        var $element = this.element,
          options = this.options,
          $links = options.links || $('a', $element),
          $subMenu = options.subMenu || $($element.find('.sub_share')),
          $subLinks = $('a', $subMenu),
          $closeOnMouseLeaving = options.closeOnMouseLeaving,
          scroller = options.scroller;
        $links.on('click', function (event) {
          var $this = $(this),
            $a = $this.find('a').length ? $this.find('a') : $this,
            active = $a.hasClass('active');
          if ($a.data('share-page')) {
            $links.removeClass('active');
            $a.addClass('active');
            event.preventDefault();
            var $currentPage = state$1.slides.currentPage(),
              id = $currentPage.attr('id') || $currentPage.data('perma-id'),
              siteShareUrl = $a.data('share-page').replace(/permaId$/, id),
              $insertAfter = options.insertAfter || $a;
            $($subLinks[0]).attr('href', $a.attr('href'));
            $($subLinks[1]).attr('href', siteShareUrl);
            if (!$insertAfter.next().hasClass('sub_share')) {
              $insertAfter.after($subMenu);
            }
            if (active) {
              $subMenu.toggle();
              $a.toggleClass('active');
            } else {
              $subMenu.show();
              $links.find('.button').removeClass('pressed');
              $(this).find('.button').addClass('pressed');
            }
            if (scroller) {
              scroller.refresh();
            }
          }
        });
        if ($closeOnMouseLeaving) {
          $closeOnMouseLeaving.on('mouseleave', function () {
            $links.removeClass('active').blur();
            $(this).find('.button').removeClass('pressed');
            $subMenu.hide();
          });
        }
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.skipPageButton', {
      _create: function () {
        this.element.on('click', function () {
          state$1.slides.next();
        });
        events.on('page:change page:update', this.update, this);
        this.update();
      },
      _destroy: function () {
        events.off(null, this.update);
      },
      update: function () {
        if (state$1.slides) {
          this.element.toggleClass('enabled', !!state$1.slides.nextPageExists());
        }
      }
    });
  })($);

  $.widget('pageflow.thirdPartyEmbedConsent', {
    _create: function () {
      var element = this.element;
      var vendorName = this.element.find('[data-consent-vendor]').data('consentVendor');
      if (!vendorName) {
        return;
      }
      consent.requireAccepted(vendorName).then(function (result) {
        if (result === 'fulfilled') {
          element.addClass('consent_given');
        }
      });
      this._on(this.element, {
        'click .third_party_embed_opt_in-button': function () {
          consent.accept(vendorName);
        }
      });
    }
  });

  (function ($) {
    $.widget('pageflow.topButton', {
      _create: function () {
        var element = this.element;
        element.click(function (event) {
          state$1.slides.goToLandingPage();
          event.preventDefault();
        });
        state$1.slides.on('pageactivate', function (e, ui) {
          toggle();
        });
        toggle(state$1.slides.currentPage());
        function toggle() {
          var onLandingPage = state$1.slides.isOnLandingPage();
          element.toggleClass('deactivated', onLandingPage);
          element.attr('tabindex', onLandingPage ? '-1' : '2');
        }
      }
    });
  })($);

  (function ($) {
    $.widget('pageflow.volumeSlider', {
      _create: function () {
        var element = this.element;
        var orientation = this.options.orientation;
        var slider = $('.volume-slider', element);
        element.on('mousedown', function (event) {
          var parent = $('body');
          parent.on('mousemove.volumeSlider', changeVolume);
          element.addClass('lock_showing');
          parent.on('mouseup.volumeSlider', function () {
            parent.off('mousemove.volumeSlider mouseup.volumeSlider');
            element.removeClass('lock_showing');
          });
          changeVolume(event);
          function changeVolume(event) {
            var volume;
            if (orientation === 'v') {
              volume = 1 - (event.pageY - slider.offset().top) / slider.height();
            } else {
              volume = (event.pageX - slider.offset().left) / slider.width();
            }
            settings.set('volume', Math.min(1, Math.max(0, volume)));
          }
        });
        settings.on('change:volume', this.update, this);
        this.update();
      },
      _destroy: function () {
        settings.off('change:volume', this.update);
      },
      update: function () {
        var volume = settings.get('volume');
        if (this.options.orientation === 'v') {
          $('.volume-level', this.element).css({
            height: volume * 100 + '%'
          });
          $('.volume-handle', this.element).css({
            bottom: volume * 100 + '%',
            top: 'initial'
          });
        } else {
          $('.volume-level', this.element).css({
            width: volume * 100 + '%'
          });
          $('.volume-handle', this.element).css({
            left: volume * 100 + '%'
          });
        }
        this.element.toggleClass('volume-high', volume > 2 / 3);
        this.element.toggleClass('volume-medium', volume >= 1 / 3 && volume <= 2 / 3);
        this.element.toggleClass('volume-low', volume < 1 / 3 && volume > 0);
        this.element.toggleClass('volume-mute', volume === 0);
      }
    });
  })($);

  const phoneLandscapeFullscreen = function () {
    if (window.screen.orientation) {
      if (browser.has('phone platform') && !browser.has('iphone platform')) {
        window.screen.orientation.onchange = function () {
          if (isLandscape()) {
            requestFullscreen(document.body);
          }
        };
      }
    }
    function isLandscape() {
      return window.orientation == 90 || window.orientation == -90;
    }
    function requestFullscreen(el) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.webkitEnterFullscreen) {
        el.webkitEnterFullscreen();
      }
    }
  };

  const widgetTypes = function () {
    var registry = {};
    var base = {
      enhance: function (element) {}
    };
    return {
      register: function (name, widgetType) {
        registry[name] = _.extend({}, base, widgetType);
      },
      enhance: function (container) {
        function enhance(element) {
          var typeName = $(element).data('widget');
          if (registry[typeName]) {
            registry[typeName].enhance(element);
          }
        }
        container.find('[data-widget]').each(function () {
          enhance($(this));
        });
      }
    };
  }();

  widgetTypes.register('default_navigation', {
    enhance: function (element) {
      element.navigation();
    }
  });
  widgetTypes.register('default_mobile_navigation', {
    enhance: function (element) {
      element.navigationMobile();
    }
  });

  var pagePreloaded = new $.Deferred(function (pagePreloadedDeferred) {
    $(document).one('pagepreloaded', pagePreloadedDeferred.resolve);
  }).promise();
  window.onload = function () {
    browser.detectFeatures().then(function () {
      var slideshow = $('[data-role=slideshow]');
      var body = $('body');
      Visited.setup();
      pagePreloaded.then(function () {
        readyDeferred.resolve();
        events.trigger('ready');
      });
      slideshow.each(function () {
        events.trigger('seed:loaded');
        state$1.entryData = new SeedEntryData(state$1.seed);
        Audio.setup({
          audioFiles: state$1.audioFiles
        });
        Slideshow.setup({
          element: $(this),
          pages: state$1.pages,
          enabledFeatureNames: state$1.enabledFeatureNames,
          beforeFirstUpdate: function () {
            $('.header').header({
              slideshow: state$1.slides
            });
            $('.overview').overview();
            $('.multimedia_alert').multimediaAlert();
            pageType.invokeInitializers(state$1.pages);
            widgetTypes.enhance(body);
            delayedStart.perform();
            phoneLandscapeFullscreen();
          }
        });
        consent.closeVendorRegistration();
      });
      links.setup();
      FocusOutline.setup(body);
      nativeScrolling.preventScrollingOnEmbed(slideshow);
    });
  };

  /**
   * A promise that is resolved once the document is printed.
   */

  // old promise not working properly, resolved in print-mode

  /*  return new $.Deferred(function(deferred) {
      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            deferred.resolve();
          }
        });
      }

      window.onbeforeprint = deferred.resolve;
    });
  }; */

  $(function ($) {
    // now bound to pageflow.ready

    ready.then(function () {
      $('img.print_image').each(function () {
        var img = $(this);
        if (img.data('src')) {
          img.attr('src', img.data('printsrc'));
        }
      });
    });
  });

  // A proxy which lazily initializes the real video player.
  const Lazy = function (template, options) {
    var placeholder = $('<span class="video_placeholder" />'),
      that = this,
      readyCallbacks = new $.Callbacks(),
      disposeTimeout,
      videoTag,
      videoPlayer,
      html;
    saveHtml(template);
    template.before(placeholder);
    this.ensureCreated = function () {
      if (disposeTimeout) {
        clearTimeout(disposeTimeout);
        disposeTimeout = null;
      }
      if (!videoTag) {
        videoTag = createVideoTag();
        placeholder.replaceWith(videoTag);
        videoPlayer = new VideoPlayer(videoTag[0], options);
        videoPlayer.ready(readyCallbacks.fire);
      }
    };
    this.isPresent = function () {
      return videoTag && !disposeTimeout;
    };
    this.dispose = function () {
      if (videoTag && !browser.has('mobile platform')) {
        this.setEmptySrc();
        $(videoPlayer.el()).replaceWith(placeholder);
        videoPlayer.dispose();
        videoPlayer = null;
        videoTag = null;
      }
    };
    this.setEmptySrc = function () {
      videoPlayer.src([{
        type: 'video/webm',
        src: assetUrls.emptyWebm
      }, {
        type: 'video/mp4',
        src: assetUrls.emptyMp4
      }]);
    };
    this.scheduleDispose = function () {
      if (!disposeTimeout) {
        disposeTimeout = setTimeout(function () {
          that.dispose();
        }, 5 * 1000);
      }
    };

    // proxied methods

    this.ready = function (callback) {
      readyCallbacks.add(callback);
    };
    this.paused = function () {
      return videoPlayer && videoPlayer.paused();
    };
    this.volume = function /* arguments */
    () {
      if (!videoPlayer) {
        return 0;
      }
      return videoPlayer.volume.apply(videoPlayer, arguments);
    };
    this.showPosterImage = function () {
      return videoPlayer && videoPlayer.posterImage.show();
    };
    this.hidePosterImage = function () {
      return videoPlayer && videoPlayer.posterImage.unlockShowing();
    };
    _.each(['play', 'playAndFadeIn', 'pause', 'fadeOutAndPause', 'prebuffer', 'src', 'on', 'load', 'currentTime', 'muted'], function (method) {
      that[method] = function /* args */
      () {
        var args = arguments;
        if (!videoPlayer) {
          log('Video Player not yet initialized. (' + method + ')', {
            force: true
          });
          return;
        }
        return new $.Deferred(function (deferred) {
          videoPlayer.ready(function () {
            $.when(videoPlayer[method].apply(videoPlayer, args)).then(deferred.resolve);
          });
        });
      };
    });
    function saveHtml(template) {
      html = template.html();
    }
    function createVideoTag() {
      var htmlWithPreload = html.replace(/preload="[a-z]*"/, 'preload="auto"');
      htmlWithPreload = htmlWithPreload.replace(/src="([^"]*)"/g, 'src="$1&t=' + new Date().getTime() + '"');
      var element = $(htmlWithPreload);
      if (browser.has('mobile platform') && element.attr('data-mobile-poster')) {
        element.attr('poster', element.attr('data-mobile-poster'));
      } else if (browser.has('high bandwidth') && !browser.has('mobile platform')) {
        element.attr('poster', element.attr('data-large-poster'));
        element.find('source').each(function () {
          $(this).attr('src', $(this).attr('data-high-src'));
        });
      } else {
        element.attr('poster', element.attr('data-poster'));
      }
      return element;
    }
  };

  if (VideoJS.Html5DashJS) {
    VideoJS.Html5DashJS.hook('beforeinitialize', function (player, mediaPlayer) {
      mediaPlayer.getDebug().setLogToBrowserConsole(false);
    });
  }

  VideoPlayer.Lazy = Lazy;

  exports.AdjacentPreloader = AdjacentPreloader;
  exports.Atmo = Atmo;
  exports.Audio = Audio;
  exports.AudioPlayer = AudioPlayer;
  exports.ChapterFilter = ChapterFilter;
  exports.Consent = Consent;
  exports.DelayedStart = DelayedStart;
  exports.DomOrderScrollNavigator = DomOrderScrollNavigator;
  exports.EntryData = EntryData;
  exports.Features = Features;
  exports.FocusOutline = FocusOutline;
  exports.HighlightedPage = HighlightedPage;
  exports.History = History;
  exports.MediaPool = MediaPool;
  exports.MediaType = MediaType;
  exports.MultiPlayer = MultiPlayer;
  exports.Object = BaseObject;
  exports.PageNavigationListAnimation = PageNavigationListAnimation;
  exports.PageTransitions = PageTransitions;
  exports.PlayerSourceIDMap = PlayerSourceIDMap;
  exports.ScrollIndicator = ScrollIndicator;
  exports.SeedEntryData = SeedEntryData;
  exports.Slideshow = Slideshow;
  exports.SuccessorPreparer = SuccessorPreparer;
  exports.VideoPlayer = VideoPlayer;
  exports.Visited = Visited;
  exports.assetUrls = assetUrls;
  exports.audioContext = audioContext;
  exports.backgroundMedia = backgroundMedia;
  exports.bandwidth = bandwidth;
  exports.blankSources = blankSources;
  exports.browser = browser;
  exports.commonPageCssClasses = commonPageCssClasses;
  exports.consent = consent;
  exports.cookieNotice = cookieNotice;
  exports.cookies = cookies;
  exports.debugMode = debugMode;
  exports.defaultPageContent = defaultPageContent;
  exports.delayedStart = delayedStart;
  exports.documentHiddenState = documentHiddenState;
  exports.events = events;
  exports.features = features;
  exports.fullscreen = fullscreen;
  exports.hideText = hideText;
  exports.infoBox = infoBox;
  exports.links = links;
  exports.log = log;
  exports.manualStart = manualStart;
  exports.media = media;
  exports.mediaPlayer = mediaPlayer;
  exports.multimediaAlert = multimediaAlert;
  exports.nativeScrolling = nativeScrolling;
  exports.navigationDirection = navigationDirection;
  exports.pageSplitLayout = pageSplitLayout;
  exports.pageTransitions = pageTransitions;
  exports.pageType = pageType;
  exports.phoneLandscapeFullscreen = phoneLandscapeFullscreen;
  exports.preload = preload;
  exports.ready = ready;
  exports.readyDeferred = readyDeferred;
  exports.setItemCookieString = setItemCookieString;
  exports.settings = settings;
  exports.theme = theme;
  exports.videoHelpers = videoHelpers;
  exports.volumeFade = volumeFade;
  exports.widgetTypes = widgetTypes;
  exports.widgets = widgets;

  return exports;

}({}, jQuery, jQuery, Backbone, _, videojs, IScroll));
