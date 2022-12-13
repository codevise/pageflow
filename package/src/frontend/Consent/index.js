import {Persistence} from './Persistence';
import {cookies} from '../cookies';
import BackboneEvents from 'backbone-events-standalone';

const supportedParadigms = ['external opt-out', 'opt-in', 'lazy opt-in', 'skip'];

export class Consent {
  constructor({cookies, inEditor}) {
    this.requestedPromise = new Promise((resolve) => {
      this.requestedPromiseResolve = resolve;
    });

    this.vendors = [];
    this.persistence = new Persistence({cookies});
    this.emitter = {...BackboneEvents};
    this.inEditor = inEditor;
  }

  registerVendor(name, {displayName, description, paradigm,
                        cookieName, cookieKey, cookieDomain}) {
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
      save: (vendorConsent) => {
        this.persistence.store(vendors, vendorConsent);
        this.triggerDecisionEvents();
      }
    });
  }

  relevantVendors({include: additionalVendorNames} = {}) {
    return this.withState(
      this.vendors.filter((vendor) => {
        return additionalVendorNames?.includes(vendor.name) ||
          vendor.paradigm === 'opt-in' ||
          vendor.paradigm === 'external opt-out' ||
          (vendor.paradigm === 'lazy opt-in' &&
           this.persistence.read(vendor) !== 'undecided');
      }),
      {applyDefaults: true}
    );
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
    default: // should not be used
      return null;
    }
  }

  requireAccepted(vendorName) {
    if (this.inEditor) {
      return Promise.resolve('fulfilled');
    }

    const vendor = this.findVendor(vendorName, 'require consent for');

    if (vendor.paradigm === 'opt-in' || vendor.paradigm === 'lazy opt-in') {
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
    const vendor = this.findVendor(vendorName, 'accept');

    this.persistence.update(vendor, true);
    this.emitter.trigger(`${vendor.name}:accepted`);
  }

  deny(vendorName) {
    const vendor = this.findVendor(vendorName, 'deny');

    this.persistence.update(vendor, false);
  }

  getRequestedVendors() {
    return this.vendors.filter((vendor) => {
      return vendor.paradigm !== 'skip';
    });
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

  findVendor(vendorName, actionForErrorMessage) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);

    if (!vendor) {
      throw new Error(`Cannot ${actionForErrorMessage} unknown vendor "${vendorName}". ` +
                      'Consider using consent.registerVendor.');
    }

    return vendor;
  }

  withState(vendors, {applyDefaults} = {}) {
    return vendors.map((vendor) => {
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

Consent.create = function() {
  const inEditor = typeof PAGEFLOW_EDITOR !== 'undefined' && PAGEFLOW_EDITOR;
  return new Consent({cookies, inEditor});
};
