import {log} from './base';
import BackboneEvents from 'backbone-events-standalone';

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
      this.trigger('change:'+attr);
    }

    this.trigger('change');
  }

  toJSON() {
    return {...this.attributes};
  }

  initialize() {
    const storage = this.getLocalStorage();

    if (storage) {
      if (storage['pageflow.settings']) {
        try {
          this.set(JSON.parse(storage['pageflow.settings']));
        }
        catch(e) {
          log(e);
        }
      }

      this.on('change', function() {
        storage['pageflow.settings'] = JSON.stringify(this.attributes);
      });
    }
  }

  getLocalStorage() {
    try {
      return window.localStorage;
    }
    catch(e) {
      // Safari throws SecurityError when accessing window.localStorage
      // if cookies/website data are disabled.
      return null;
    }
  }
}

Object.assign(Settings.prototype, BackboneEvents);

export const settings = new Settings();
