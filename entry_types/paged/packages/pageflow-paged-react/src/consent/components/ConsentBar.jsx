import registerWidgetType from 'registerWidgetType';

import {privacyLinkUrl} from 'theming/selectors';
import {editingWidget} from 'widgets/selectors';
import {t, locale} from 'i18n/selectors';
import {isConsentUIVisible, requestedVendors} from '../selectors';
import GearIcon from 'components/icons/Gear';
import {VendorList} from './VendorList';
import {acceptAll, denyAll, save} from '../actions';

import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

export class ConsentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {}
    };
    this.handleSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.handleVendorInputChange = this.onVendorInputChange.bind(this);
  }

  onSaveButtonClick() {
    const signal = this.props.requestedVendors.reduce((result, {name}) => ({
      ...result,
      [name]: this.state.checked[name] || false
    }), {});
    this.props.save(signal);
  }

  onVendorInputChange(vendorName, event) {
    this.setState({
      checked: {
        ...this.state.checked,
        [vendorName]: event.target.checked
      }
    });
  }

  render() {
    const {editing, t, acceptAll, denyAll, requestedVendors, visible} = this.props;

    if (visible || editing) {
      return (
        <div className={classNames(
               'consent_bar',
               {'consent_bar-expanded': this.state.showVendorBox}
             )}>
          <div className="consent_bar-content">
            {renderText(this.props)}

            <div className="consent_bar-vendor_box">
              <h3>{t('pageflow.public.consent_settings')}</h3>
              <VendorList vendors={requestedVendors}
                          t={t}
                          onVendorInputChange={this.handleVendorInputChange} />
              <button className="consent_bar-save" onClick={this.handleSaveButtonClick}>
                {t('pageflow.public.consent_save')}
              </button>
            </div>

            <div className="consent_bar-buttons">
              <button className="consent_bar-configure"
                      onClick={() => this.setState({showVendorBox: !this.state.showVendorBox})}>
                <GearIcon width={10} height={10} />
                {t('pageflow.public.consent_configure')}
              </button>
              <div className="consent_bar-decision_buttons">
                <button className="consent_bar-deny_all" onClick={denyAll}>
                  {t('pageflow.public.consent_deny_all')}
                </button>
                <button className="consent_bar-accept_all" onClick={acceptAll}>
                  {t('pageflow.public.consent_accept_all')}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

function renderText({privacyLinkUrl, t, locale, requestedVendors}) {
  const vendorNames = requestedVendors.map(vendor => vendor.name).join(',');
  const text = t('pageflow.public.consent_prompt_html', {
    privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}&vendors=${vendorNames}#consent`
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
