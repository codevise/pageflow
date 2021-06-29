const supportedParadigms = ['external opt-out', 'opt-in', 'skip'];

export class Consent {
  constructor({cookies}) {
    this.requirePromises = {};
    this.requirePromiseResolves = {};

    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
    this.cookies = cookies;
  }

  registerVendor(name, {displayName, paradigm, cookieName, cookieKey}) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after registration has been closed.`);
    }

    if (supportedParadigms.indexOf(paradigm) < 0) {
      throw new Error(`unknown paradigm ${paradigm}`);
    }

    this.vendors.push({displayName, name, paradigm, cookieName, cookieKey});
  }

  closeVendorRegistration() {
    const vendors = this.vendors.filter((vendor) => vendor.paradigm === 'opt-in');
    this.vendorRegistrationClosed = true;

    if (!vendors.length) {
      return;
    }
    const requirePromiseResolves = this.requirePromiseResolves;

    this.requestedPromiseResolve({
      vendors,

      acceptAll() {
        Object.values(requirePromiseResolves).forEach(resolve => {
          resolve('fulfilled');
        });
      },
      denyAll() {
        Object.values(requirePromiseResolves).forEach(resolve => {
          resolve('failed');
        });
      },
      save(vendorConsent) {
        Object.entries(requirePromiseResolves).forEach(([vendorName, resolve]) => {
          if (vendorConsent[vendorName]) {
            resolve('fulfilled');
          }
          else {
            resolve('failed');
          }
        });
      }
    });
  }

  require(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName)

    if (vendor) {
      if (vendor.paradigm === 'opt-in') {
        this.requirePromises[vendorName] = this.requirePromises[vendorName] ||
          new Promise((resolve) => this.requirePromiseResolves[vendorName] = resolve);

        return this.requirePromises[vendorName];
      } else if (vendor.paradigm === 'external opt-out') {
        if (this.hasOptOutInCookieFor(vendor)) {
          return Promise.resolve('failed');
        }
      }
    }
    return Promise.resolve('fulfilled');
  }

  requested() {
    return this.requestedPromise;
  }

  hasOptOutInCookieFor(vendor) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};
    return flags[vendor.cookieKey || vendor.name] === false;
  }
}
