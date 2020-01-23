import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingTooltip.module.css";
import ReactTooltip from "react-tooltip";

import EmailIcon from "../assets/images/navigation/icons/shareLinks/email_icon.svg";
import FacebookIcon from "../assets/images/navigation/icons/shareLinks/facebook_icon.svg";
import LinkedInIcon from "../assets/images/navigation/icons/shareLinks/linked_in_icon.svg";
import TelegramIcon from "../assets/images/navigation/icons/shareLinks/telegram_icon.svg";
import TwitterIcon from "../assets/images/navigation/icons/shareLinks/twitter_icon.svg";
import WhatsAppIcon from "../assets/images/navigation/icons/shareLinks/whats_app_icon.svg";

export default function SharingTooltip(props) {
  const shareIcons = {
    email: EmailIcon,
    facebook: FacebookIcon,
    linked_in: LinkedInIcon,
    telegram: TelegramIcon,
    twitter: TwitterIcon,
    whats_app: WhatsAppIcon
  }

  function renderShareLinks(shareLinks) {
    return shareLinks.map((shareLinkConfiguration, _index) => {
      const Icon = shareIcons[shareLinkConfiguration.provider];
      return (
        <div key={shareLinkConfiguration.provider}
             className={styles.shareLinkContainer}>
          <a className={classNames('share', styles.shareLink)}
             href={shareLinkConfiguration.shareLink}
             target={'_blank'}>
            <Icon className={styles.shareIcon}/>
            {shareLinkConfiguration.providerName}
          </a>
        </div>
      )
    })
  };

  return(
    <ReactTooltip id={'sharingTooltip'}
                  type={'light'}
                  place={'bottom'}
                  effect={'solid'}
                  event={'click'}
                  globalEventOff={'click'}
                  clickable={true}
                  offset={{right: -64}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.sharingTooltip)}>
      <div>
        {renderShareLinks(pageflowScrolledSeed.shareLinks)}
      </div>
    </ReactTooltip>
  )
}