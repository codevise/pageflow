import React, {useReducer, useState} from 'react';

import {useI18n} from '../i18n';

import {Toggle} from './Toggle';

import InformationIcon from '../icons/information.svg';
import styles from './Bar.module.css';

function reducer(state, vendorName) {
  return {
    ...state,
    [vendorName]: !state[vendorName]
  };
}

export function VendorsBox({vendors, save, defaultExpanded = false}) {
  const {t} = useI18n();

  const [vendorStates, dispatch] = useReducer(
    reducer,
    vendors.reduce((result, vendor) => ({
      ...result,
      [vendor.name]: vendor.state === 'accepted'
    }), {})
  );

  return (
    <div className={styles.vendorsBox}>
      <h3>{t('pageflow_scrolled.public.consent_settings')}</h3>
      <div className={styles.vendorList}>
        {renderVendors({
          vendors,
          vendorStates,
          t,
          defaultExpanded,
          onToggle: dispatch
        })}
      </div>

      <button className={styles.saveButton}
              onClick={() => save(vendorStates)}>
        {t('pageflow_scrolled.public.consent_save')}
      </button>
    </div>
  );
}

function renderVendors({vendors, vendorStates, t, defaultExpanded, onToggle}) {
  if (!vendors.length) {
    return (
      <div className="consent_vendor_list-blank">
        {t('pageflow_scrolled.public.consent_no_vendors')}
      </div>
    );
  }

  return vendors.map((vendor) =>
    <Vendor key={vendor.name}
            vendor={vendor}
            state={vendorStates[vendor.name]}
            t={t}
            defaultExpanded={defaultExpanded}
            onToggle={onToggle} />
  );
}

function Vendor({vendor, state, onToggle, t, defaultExpanded}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const id = `consent-vendor-${vendor.name}`;

  return (
    <div className={styles.vendor}>
      <label htmlFor={id}>
        {vendor.displayName}
      </label>
      <Toggle id={id}
              checked={state}
              onChange={() => onToggle(vendor.name)} />
      <button className={styles.expandVendor}
              title={t('pageflow_scrolled.public.consent_expand_vendor')}
              onClick={() => setExpanded(!expanded)}>
        <InformationIcon width={30} height={34} />
      </button>
      {expanded &&
       <p dangerouslySetInnerHTML={{__html: vendor.description}} />}
    </div>
  );
}
