import React from 'react';

import {VendorList} from './VendorList';

export function Settings({consent}) {
  return (
    <div>
      <VendorList vendors={consent.relevantVendors()}
                  onVendorInputChange={handleInputChange}/>
    </div>
  );

  function handleInputChange(vendorName, event) {
    event.target.checked ?
      consent.accept(vendorName) :
      consent.deny(vendorName);
  }
}
