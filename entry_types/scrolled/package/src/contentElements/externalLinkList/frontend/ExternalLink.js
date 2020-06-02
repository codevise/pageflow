import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {Image, useI18n} from 'pageflow-scrolled/frontend';

export function ExternalLink(props) {
  const [hideTooltip, setHideTooltip] = useState(true);
  var {layout, invert} = props.sectionProps;
  const {t} = useI18n();

  const isInEditor = function () {
    return window.frameElement != undefined && window.location.pathname.includes('/editor/entries/');
  };

  const onTooltipClick = function () {
    window.open(props.url, '_blank');
    setHideTooltip(true);
  };

  const onClick = function (event) {
    if (props.open_in_new_tab == false && isInEditor()) {
      setHideTooltip(false);
      event.preventDefault();
    }
  };

  const onMouseLeave = function () {
    setHideTooltip(true);
  };

  return (
    <a className={classNames(styles.link_item, {[styles.invert]: invert, [styles.layout_center]: layout=='center'})} href={props.url || ''} 
       onClick={onClick} 
       onMouseLeave={onMouseLeave}
       target={props.open_in_new_tab == '1' ? '_blank':'_self'}
       >
      <div className={styles.link_thumbnail}>
          <Image id={props.thumbnail} />
      </div>

      <div className={styles.link_details}>
        <p className={styles.link_title}>{props.title}</p>
        <p className={styles.link_desc}>{props.description}</p>
      </div>

      <div className={classNames({[styles.hidden]: hideTooltip}, styles.tooltip)} 
           onClick={onTooltipClick}
           >
        {t('pageflow_scrolled.public.external_link.open_in_new_tab_message')}
        {<span target="_blank">{t('pageflow_scrolled.public.external_link.open_in_new_tab')}</span>}
      </div>
    </a>
  );
}
