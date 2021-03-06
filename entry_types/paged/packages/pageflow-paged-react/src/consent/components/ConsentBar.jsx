import registerWidgetType from 'registerWidgetType';

import {privacyLinkUrl} from 'theming/selectors';
import {editingWidget} from 'widgets/selectors';
import {t, locale} from 'i18n/selectors';
import {isConsentUIVisible, requestedVendors} from '../selectors';

import {acceptAll, denyAll, save} from '../actions';

import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';

export class ConsentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.handleVendorInputChange = this.onVendorInputChange.bind(this);
  }

  onSaveButtonClick() {
    const signal = this.props.requestedVendors.reduce((result, {name}) => ({
      ...result,
      [name]: this.state[name] || false
    }), {});
    this.props.save(signal);
  }

  onVendorInputChange(vendorName, event) {
    this.setState({[vendorName]: event.target.checked});
  }

  render() {
    const {editing, t, acceptAll, denyAll, requestedVendors, visible} = this.props;

    if (visible || editing) {
      return (
        <div className="consent_bar">
          <div className="consent_bar-content">
            {renderText(this.props)}

            <button className="consent_bar-deny_all" onClick={denyAll}>
              {t('pageflow.public.consent_deny_all')}
            </button>
            <button className="consent_bar-accept_all" onClick={acceptAll}>
              {t('pageflow.public.consent_accept_all')}
            </button>
          </div>
          <div className="consent_bar-vendor_box">
            {renderVendors(this, requestedVendors)}
            <button className="consent_bar-save" onClick={this.handleSaveButtonClick}>
              {t('pageflow.public.consent_save')}
            </button>
          </div>
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

function renderVendors(that, requestedVendors) {
  return requestedVendors.map((vendor) => {
    const id = `consent_bar-vendor_${vendor.name}`;

    return (
      <label htmlFor={id} key={id}>
        <input id={id} type="checkbox" onChange={event => that.handleVendorInputChange(vendor.name, event)} /> {vendor.displayName}
      </label>
    );
  });
}

function renderText({privacyLinkUrl, t, locale}) {
  const text = t('pageflow.public.consent_prompt_html', {
    privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}`
  });

  return (
    <span className="consent_bar-text" dangerouslySetInnerHTML={{
      __html: text
    }} />
  );
}

export function register() {
  registerWidgetType('consent_bar', {
    component: connect(
      combineSelectors({
        privacyLinkUrl,
        editing: editingWidget({role: 'cookie_notice'}),
        t,
        locale,
        requestedVendors,
        visible: isConsentUIVisible
      }),
      {
        acceptAll,
        denyAll,
        save
      }
    )(ConsentBar)
  });
}
