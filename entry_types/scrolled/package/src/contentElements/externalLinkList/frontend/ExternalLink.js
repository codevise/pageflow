import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {Image, useI18n, useContentElementEditorState} from 'pageflow-scrolled/frontend';

export function ExternalLink(props) {
  const [hideTooltip, setHideTooltip] = useState(true);
  var {layout, invert} = props.sectionProps;
  const {t} = useI18n();
  const {isEditable, isSelected} = useContentElementEditorState();

  const onTooltipClick = function () {
    window.open(props.url, '_blank');
    setHideTooltip(true);
  };

  const onClick = function (event) {
    if (isEditable) {
      if (!props.open_in_new_tab || !isSelected) {
        event.preventDefault();
      }

      if (!props.open_in_new_tab && isSelected) {
        setHideTooltip(false);
      }
    }
  };

  const onMouseLeave = function () {
    setHideTooltip(true);
  };

  return (
    <a className={classNames(styles.link_item,
                             {
                               [styles.invert]: invert,
                               [styles.layout_center]: layout === 'center'
                             })}
       href={props.url || 'about:blank'}
       onClick={onClick}
       onMouseLeave={onMouseLeave}
       target={props.open_in_new_tab ? '_blank' : '_self'}>
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
