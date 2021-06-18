export class Consent {
  constructor() {
    this.requirePromise = new Promise((resolve) => {
      this.requirePromiseResolve = resolve;
    });

    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
  }

  registerVendor(name, {paradigm}) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after registration has been closed.`);
    }

    if (paradigm === 'opt-in') {
      this.vendors.push(name);
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
    const requirePromiseResolve = this.requirePromiseResolve;
    this.requestedPromiseResolve({
      acceptAll() {
        requirePromiseResolve('fulfilled');
      },
      denyAll() {
        requirePromiseResolve('failed');
      }
    });
  }

  require(providerName) {
    if (this.vendors.indexOf(providerName) >= 0) {
      return this.requirePromise;
    }
    return Promise.resolve('fulfilled');
  }

  requested() {
    return this.requestedPromise;
  }
}
