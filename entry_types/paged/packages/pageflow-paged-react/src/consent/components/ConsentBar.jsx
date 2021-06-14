import registerWidgetType from 'registerWidgetType';

import {privacyLinkUrl} from 'theming/selectors';
import {editingWidget} from 'widgets/selectors';
import {t, locale} from 'i18n/selectors';
import {isConsentUIVisible} from '../selectors';

import {acceptAll, denyAll} from '../actions';

import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';

function ConsentBar(props) {
  const {editing, t, acceptAll, denyAll, visible} = props;

  if (visible || editing) {
    return (
      <div className="consent_bar">
        <div className="consent_bar-content">
          {renderText(props)}

          <button className="consent_bar-deny_all" onClick={denyAll}>
            {t('pageflow.public.consent_deny_all')}
          </button>
          <button className="consent_bar-accept_all" onClick={acceptAll}>
            {t('pageflow.public.consent_accept_all')}
          </button>
        </div>
      </div>
    );
  }
  else {
    return <noscript />;
  }
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
        visible: isConsentUIVisible
      }),
      {
        acceptAll,
        denyAll
      }
    )(ConsentBar)
  });
}
