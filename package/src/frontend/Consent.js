export class Consent {
  constructor() {
    this.requirePromises = {};
    this.requirePromiseResolves = {};

    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
  }

  registerVendor(name, {displayName, paradigm}) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after registration has been closed.`);
    }

    if (paradigm === 'opt-in') {
      this.vendors.push({displayName, name});
    }
    else if (paradigm !== 'skip') {
      throw new Error(`unknown paradigm ${paradigm}`);
    }
  }

  closeVendorRegistration() {
    this.vendorRegistrationClosed = true;

    if (!this.vendors.length) {
      return;
    }
    const requirePromiseResolves = this.requirePromiseResolves;
    const vendors = this.vendors;

    this.requestedPromiseResolve({
      vendors: this.vendors,

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

  require(providerName) {
    if (this.vendors.find(vendor => vendor.name === providerName)) {
      this.requirePromises[providerName] = this.requirePromises[providerName] ||
        new Promise((resolve) => this.requirePromiseResolves[providerName] = resolve);

      return this.requirePromises[providerName];
    }
    return Promise.resolve('fulfilled');
  }

  requested() {
    return this.requestedPromise;
  }
}
