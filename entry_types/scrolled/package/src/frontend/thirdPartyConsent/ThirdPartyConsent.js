import React, {useState} from 'react';
import {ThirdPartyConsentContext} from './ThirdPartyConsentProvider';
import {OptIn} from './OptIn';
import {OptOut} from './OptOut';
import {useIsStaticPreview} from '../useScrollPositionLifecycle';
import {useTheme} from '../../entryState';
import {useI18n} from '../i18n';
import {useContentElementEditorState} from 'pageflow-scrolled/frontend';

export function ThirdPartyConsent({
  children,
  providerName,
  hideTooltip,
  optOutPlacement='bottom'
}) {
  const {t} = useI18n();
  const cookieMessage =
      t(`pageflow_scrolled.public.third_party_consent.opt_in_prompt.${providerName}`);
  const theme = useTheme();
  const {isEditable} = useContentElementEditorState();
  const isStaticPreview = useIsStaticPreview();
  const [consentedHere, setConsentedHere] = useState(false);

  return (
    <ThirdPartyConsentContext.Consumer>
      {value =>
        {
          if (theme.options.privacyCookieName &&
              !value.consents[providerName] &&
              !isEditable &&
              !isStaticPreview) {
            return (<OptIn
                      cookieMessage={cookieMessage}
                      consent={() => {
                        value.giveConsent(providerName);
                        setConsentedHere(true);
                      }}/>);
          }

          let optOutForRender = null;

          if (value.consents[providerName] &&
              theme.options.privacyOptOutLink &&
              !isEditable) {
            optOutForRender =
              <OptOut
                optOutLink={theme.options.privacyOptOutLink}
                hideTooltip={hideTooltip}
                optOutPlacement={optOutPlacement}/>;
          }

          return (
            <>
              {typeof children === 'function' ? children(consentedHere) : children}
              {optOutForRender}
            </>
          );
        }
      }
    </ThirdPartyConsentContext.Consumer>
  );
};
