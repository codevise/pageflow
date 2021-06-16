export class Consent {
  constructor() {
    this.promise = new Promise((resolve) => {
      this.promiseResolve = resolve;
    });

    this.vendors = [];
  }

  registerVendor(name, {paradigm}) {
    if (this.requestedHasBeenCalled) {
      throw new Error(`Vendor ${name} has been registered after requested was called.`);
    }

    if (paradigm === 'opt-in') {
      this.vendors.push(name);
    }
    else if (paradigm !== 'skip') {
      throw new Error(`unknown paradigm ${paradigm}`);
    }
  }

  require(providerName) {
    if (this.vendors.indexOf(providerName) >= 0) {
      return this.promise;
    }
    return Promise.resolve('fulfilled');
  }

  requested() {
    return new Promise((resolve) => {
      this.requestedHasBeenCalled = true;

      if (!this.vendors.length) {
        return;
      }
      const promiseResolve = this.promiseResolve;
      resolve({
        acceptAll() {
          promiseResolve('fulfilled');
        },
        denyAll() {
          promiseResolve('failed');
        }
      });
    });
  }
}
