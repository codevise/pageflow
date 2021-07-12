import React from 'react';

export function Settings({consent}) {
  return (
    <div>
      {renderVendors({
        vendors: consent.relevantVendors(),

        onChange({vendor, checked}) {
          checked ? consent.accept(vendor.name) : consent.deny(vendor.name);
        }
      })}
    </div>
  );
}

function renderVendors({vendors, onChange}) {
  return vendors.map((vendor) => {
    const id = `consent_settings-vendor_${vendor.name}`;

    return (
      <label htmlFor={id} key={id}>
        <input id={id}
               type="checkbox"
               onChange={event => onChange({vendor, checked: event.target.checked})}
               defaultChecked={vendor.state == 'accepted'} />
        {vendor.displayName}
      </label>
    );
  });
}
