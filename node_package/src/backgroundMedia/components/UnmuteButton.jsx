import registerWidgetType from 'registerWidgetType';

import {muted} from '../selectors';
import {t} from 'i18n/selectors';

import {unmute} from '../actions';

import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';

function UnmuteButton(props) {
  const {t, muted, unmute} = props;

  if (muted) {
    return (
      <div className="background_media_unmute_button">
        <a title={t('pageflow.public.mute_off')} onClick={unmute} href="#"></a>
      </div>
    );
  }
  else {
    return null;
  }
}

export function register() {
  registerWidgetType('unmute_button', {
    component: connect(
      combineSelectors({
        t,
        muted
      }),
      {
        unmute
      }
    )(UnmuteButton)
  });
}
