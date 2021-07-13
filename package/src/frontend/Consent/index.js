import {Persistence} from './Persistence';
import {cookies} from '../cookies';

const supportedParadigms = ['external opt-out', 'opt-in', 'skip'];

export class Consent {
  constructor({cookies}) {
    this.requirePromises = {};
    this.requirePromiseResolves = {};

    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
    this.persistence = new Persistence({cookies});
  }

  registerVendor(name, {displayName, paradigm, cookieName, cookieKey}) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after registration has been closed.`);
    }

    if (supportedParadigms.indexOf(paradigm) < 0) {
      throw new Error(`unknown paradigm ${paradigm}`);
    }

    this.vendors.push({
      displayName,
      name,
      paradigm,
      cookieName: cookieName || 'consent',
      cookieKey});
  }

  closeVendorRegistration() {
    this.vendorRegistrationClosed = true;
    const vendors = this.getUndecidedOptInVendors();

    if (!vendors.length) {
      return;
    }

    this.requestedPromiseResolve({
      vendors,

      acceptAll: () => {
        this.persistence.store(vendors, 'accepted');
        this.resolvePendingRequirePromises('fulfilled');
      },
      denyAll: () => {
        this.persistence.store(vendors, 'denied');
        this.resolvePendingRequirePromises('failed');
      },
      save: (vendorConsent) => {
        this.persistence.store(vendors, vendorConsent);
        this.resolvePendingRequirePromises(vendorConsent);
      }
    });
  }

  relevantVendors() {
    return this.vendors
      .filter((vendor) => {
        return vendor.paradigm !== 'skip';
      })
      .map((vendor) => {
        return {...vendor, state: this.persistence.read(vendor)};
      });
  }

  require(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot require consent for unknown vendor "${vendorName}". ` +
                      'Consider using registerVendor.');
    }

    switch (vendor.paradigm) {
    case 'opt-in':
      switch (this.persistence.read(vendor)) {
      case 'denied':
        return Promise.resolve('failed');
      case 'undecided':
        return this.getRequirePromise(vendorName);
      default: // 'accepted'
        return Promise.resolve('fulfilled');
      }
    case 'external opt-out':
      if (this.persistence.read(vendor) === 'denied') {
        return Promise.resolve('failed');
      }
      return Promise.resolve('fulfilled');
    case 'skip':
      return Promise.resolve('fulfilled');
    default: // should not be used
      return null;
    }
  }

  requested() {
    return this.requestedPromise;
  }

  accept(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot accept consent for unknown vendor "${vendorName}". ` +
                      'Consider using registerVendor.');
    }

    this.persistence.update(vendor, true);
  }

  deny(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot deny consent for unknown vendor "${vendorName}". ` +
                      'Consider using registerVendor.');
    }

    this.persistence.update(vendor, false);
  }

  getRequirePromise(vendorName) {
    this.requirePromises[vendorName] = this.requirePromises[vendorName] ||
      new Promise((resolve) => this.requirePromiseResolves[vendorName] = resolve);

    return this.requirePromises[vendorName];
  }

  getUndecidedOptInVendors() {
    return this.vendors.filter((vendor) => {
      return vendor.paradigm === 'opt-in' &&
        this.persistence.read(vendor) === 'undecided';
    });
  }

  resolvePendingRequirePromises(signal) {
    Object.entries(this.requirePromiseResolves).forEach(([vendorName, resolve]) => {
      if (typeof signal === 'string') {
        resolve(signal);
      } else {
        resolve(signal[vendorName] ? 'fulfilled' : 'failed');
      }
    });
  }
}

Consent.create = function() {
  return new Consent({cookies});
};
