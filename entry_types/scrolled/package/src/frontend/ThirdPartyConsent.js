import React, {useState} from 'react';
import {ThirdPartyConsentContext} from './ThirdPartyConsentProvider';
import {OptIn} from './OptIn';
import {OptOut} from './OptOut';
import {useIsStaticPreview} from './useScrollPositionLifecycle';
import {useTheme} from '../entryState';
import {useI18n} from './i18n';
import {useContentElementEditorState} from 'pageflow-scrolled/frontend';

export function ThirdPartyConsent({
  children,
  providerName,
  hideTooltip,
  activateEmbed,
  height,
  optOutPlacement='bottom',
  noop
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
              !isStaticPreview &&
              !noop) {
            return (<OptIn
                      cookieMessage={cookieMessage}
                      height={height || '100%'}
                      consent={() => {
                        value.giveConsent(providerName);
                        setConsentedHere(true);
                        if (typeof activateEmbed === 'function') {
                          activateEmbed();
                        }
                      }}/>);
          }

          let optOutForRender = null;

          if (value.consents[providerName] &&
              theme.options.privacyOptOutLink &&
              !isEditable &&
              !noop) {
            optOutForRender =
              <OptOut
                optOutLink={theme.options.privacyOptOutLink}
                hideTooltip={hideTooltip}
                optOutPlacement={optOutPlacement}/>;
          }

          return (
            <>
              <div>
                {typeof children === 'function' ? children(consentedHere) : children}
              </div>
              {optOutForRender}
            </>
          );
        }
      }
    </ThirdPartyConsentContext.Consumer>
  );
};
