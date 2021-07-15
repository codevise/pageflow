import {Persistence} from './Persistence';
import {cookies} from '../cookies';
import BackboneEvents from 'backbone-events-standalone';

const supportedParadigms = ['external opt-out', 'opt-in', 'skip'];

export class Consent {
  constructor({cookies}) {
    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
    this.persistence = new Persistence({cookies});
    this.emitter = {...BackboneEvents};
  }

  registerVendor(name, {displayName, description, paradigm, cookieName, cookieKey}) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after ` +
                      'registration has been closed.');
    }

    if (!name.match(/^[a-z0-9-_]+$/i)) {
      throw new Error(`Invalid vendor name '${name}'. ` +
                      'Only letters, numbers, hyphens and underscores are allowed.');
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
      cookieKey});
  }

  closeVendorRegistration() {
    this.vendorRegistrationClosed = true;

    if (!this.getUndecidedOptInVendors().length) {
      this.triggerDecisionEvents();
      return;
    }

    const vendors = this.relevantVendors();

    this.requestedPromiseResolve({
      vendors,

      acceptAll: () => {
        this.persistence.store(vendors, 'accepted');
        this.triggerDecisionEvents();
      },
      denyAll: () => {
        this.persistence.store(vendors, 'denied');
        this.triggerDecisionEvents();
      },
      save: (vendorConsent) => {
        this.persistence.store(vendors, vendorConsent);
        this.triggerDecisionEvents();
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
    default: // should not be used
      return null;
    }
  }

  requireAccepted(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot require consent for unknown vendor "${vendorName}". ` +
                      'Consider using registerVendor.');
    }

    if (vendor.paradigm === 'opt-in') {
      if (this.getUndecidedOptInVendors().length ||
          this.persistence.read(vendor) !== 'accepted') {
        return new Promise(resolve => {
          this.emitter.once(`${vendor.name}:accepted`, () => resolve('fulfilled'));
        });
      }

      return Promise.resolve('fulfilled');
    }
    else {
      return this.require(vendorName);
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
    this.emitter.trigger(`${vendor.name}:accepted`);
  }

  deny(vendorName) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot deny consent for unknown vendor "${vendorName}". ` +
                      'Consider using registerVendor.');
    }

    this.persistence.update(vendor, false);
  }

  getUndecidedOptInVendors() {
    return this.vendors.filter((vendor) => {
      return vendor.paradigm === 'opt-in' &&
        this.persistence.read(vendor) === 'undecided';
    });
  }

  triggerDecisionEvents() {
    this.vendors
      .filter((vendor) => {
        return vendor.paradigm !== 'skip';
      })
      .forEach((vendor) => {
        this.emitter.trigger(`${vendor.name}:${this.persistence.read(vendor)}`);
      });
  }
}

Consent.create = function() {
  return new Consent({cookies});
};
