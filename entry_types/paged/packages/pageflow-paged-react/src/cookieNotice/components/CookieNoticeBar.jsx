import registerWidgetType from 'registerWidgetType';

import {isCookieNoticeVisible} from '../selectors';
import {privacyLinkUrl} from 'theming/selectors';
import {editingWidget} from 'widgets/selectors';
import {t, locale} from 'i18n/selectors';

import {dismiss} from '../actions';

import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';

function CookieNoticeBar(props) {
  const {isCookieNoticeVisible, editing, t, dismiss} = props;

  if (isCookieNoticeVisible || editing) {
    return (
      <div className="cookie_notice_bar">
        <div className="cookie_notice_bar-content">
          {renderText(props)}

          <a className="cookie_notice_bar-dismiss" onClick={dismiss}>
            {t('pageflow.public.dismiss_cookie_notice')}
          </a>
        </div>
      </div>
    );
  }
  else {
    return <noscript />;
  }
}

function renderText({privacyLinkUrl, t, locale}) {
  const text = t('pageflow.public.cookie_notice_html', {
    privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}`
  });

  return (
    <span className="cookie_notice_bar-text" dangerouslySetInnerHTML={{
      __html: text
    }} />
  );
}

export function register() {
  registerWidgetType('cookie_notice_bar', {
    component: connect(
      combineSelectors({
        isCookieNoticeVisible,
        privacyLinkUrl,
        editing: editingWidget({role: 'cookie_notice'}),
        t,
        locale
      }),
      {
        dismiss
      }
    )(CookieNoticeBar)
  });
}
