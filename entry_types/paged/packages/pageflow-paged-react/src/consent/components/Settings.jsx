import React from 'react';

import {VendorList} from './VendorList';

export function Settings({consent, t, queryString}) {
  const vendors = consent.relevantVendors({include: vendorsFromQueryString(queryString)});
  return (
    <div>
      <VendorList vendors={vendors}
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

export function vendorsFromQueryString(queryString) {
  const match = queryString && queryString.match(/vendors=([^&]+)/);

  if (match) {
    return match[1].split(',');
  }

  return [];
}
