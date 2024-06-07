import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {
  Image,
  InlineFileRights,
  useFileWithInlineRights,
  useI18n,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

export function ExternalLink(props) {
  const [hideTooltip, setHideTooltip] = useState(true);
  var {layout} = props.sectionProps;
  const {t} = useI18n({locale: 'ui'});
  const {isEditable, isSelected} = useContentElementEditorState();
  const thumbnailImageFile = useFileWithInlineRights({
    configuration: props,
    collectionName: 'imageFiles',
    propertyName: 'thumbnail'
  });
  const url = ensureAbsolute(props.url);

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
        window.open(url, '_blank');
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
                               [styles.layout_center]:
                                 layout === 'center' || layout === 'centerRagged'
                             })}
       href={url || 'about:blank'}
       onClick={onClick}
       onMouseLeave={onMouseLeave}
       target={props.open_in_new_tab ? '_blank' : '_self'}
       rel={props.open_in_new_tab ? 'noopen noreferrer' : undefined}>
      <div className={styles.link_thumbnail}>
        <Image imageFile={thumbnailImageFile}
               load={props.loadImages}
               variant="linkThumbnailLarge" />
        <InlineFileRights context="insideElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
      </div>
      <div className={styles.background}>
        <InlineFileRights context="afterElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
        <div className={styles.details}>
          <p className={styles.link_title}>{props.title}</p>
          <p className={styles.link_desc}>{props.description}</p>
        </div>
      </div>
      {renderNewTabTooltip()}
    </a>
  );
}

ExternalLink.defaultProps = {
  sectionProps: {}
};

function ensureAbsolute(url) {
  if (url.match(/^(https?:)?\/\//)) {
    return url;
  }
  else {
    return `http://${url}`;
  }
}
