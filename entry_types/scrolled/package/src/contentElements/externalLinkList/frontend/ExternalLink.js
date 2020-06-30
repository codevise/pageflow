import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {Image, useI18n, useContentElementEditorState} from 'pageflow-scrolled/frontend';

export function ExternalLink(props) {
  const [hideTooltip, setHideTooltip] = useState(true);
  var {layout} = props.sectionProps;
  const {t} = useI18n({locale: 'ui'});
  const {isEditable, isSelected} = useContentElementEditorState();

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

  function renderNewTabTooltip() {
    if (isEditable) {
      const onTooltipClick = function () {
        window.open(props.url, '_blank');
        setHideTooltip(true);
      };

      return (
        <div className={classNames({[styles.hidden]: hideTooltip}, styles.tooltip)}
             onClick={onTooltipClick}>
          {t('pageflow_scrolled.inline_editing.external_links.open_in_new_tab_message')}
          {<span>{t('pageflow_scrolled.inline_editing.external_links.open_in_new_tab')}</span>}
        </div>
      )
    }
  }

  return (
    <a className={classNames(styles.link_item,
                             {
                               [styles.invert]: props.invert,
                               [styles.layout_center]: layout === 'center'
                             })}
       href={props.url || 'about:blank'}
       onClick={onClick}
       onMouseLeave={onMouseLeave}
       target={props.open_in_new_tab ? '_blank' : '_self'}>
      <div className={styles.link_thumbnail}>
        <Image id={props.thumbnail}
               isPrepared={props.isPrepared}
               variant="linkThumbnailLarge" />
      </div>

      <div className={styles.link_details}>
        <p className={styles.link_title}>{props.title}</p>
        <p className={styles.link_desc}>{props.description}</p>
      </div>

      {renderNewTabTooltip()}
    </a>
  );
}
