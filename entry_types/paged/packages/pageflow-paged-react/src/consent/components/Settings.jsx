import React from 'react';

import {VendorList} from './VendorList';

export function Settings({consent, t}) {
  return (
    <div>
      <VendorList vendors={consent.relevantVendors()}
                  t={t}
                  onVendorInputChange={handleInputChange}/>
    </div>
  );

  function handleInputChange(vendorName, event) {
    event.target.checked ?
      consent.accept(vendorName) :
      consent.deny(vendorName);
  }
}
