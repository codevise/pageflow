import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {
  InlineFileRights,
  useFileWithInlineRights,
  useI18n,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

import {Thumbnail} from './Thumbnail';

export function ExternalLink(props) {
  const [hideTooltip, setHideTooltip] = useState(true);
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
    <LinkOrDiv
      className={classNames(styles.item,
                            styles[`textPosition-${props.textPosition}`],
                            styles[`thumbnailSize-${props.thumbnailSize}`],
                            styles[`textSize-${props.textSize}`],
                            {[styles.invert]: props.invert})}
      href={url}
      title={props.textPosition === 'title' ?
             [props.title, props.description].filter(Boolean).join("\n") :
             null}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      target={props.open_in_new_tab ? '_blank' : '_self'}
      rel={props.open_in_new_tab ? 'noopen noreferrer' : undefined}>
      <div className={styles.thumbnail}>
        <Thumbnail imageFile={thumbnailImageFile}
                   aspectRatio={props.thumbnailAspectRatio}
                   cropPosition={props.thumbnailCropPosition}
                   load={props.loadImages}>
          <InlineFileRights context="insideElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
        </Thumbnail>
      </div>
      <div className={styles.background}>
        <InlineFileRights context="afterElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
        <div className={styles.details}>
          <p className={styles.link_title}>{props.title}</p>
          <p className={styles.link_desc}>{props.description}</p>
        </div>
      </div>
      {renderNewTabTooltip()}
    </LinkOrDiv>
  );
}

function LinkOrDiv({children, ...props}) {
  if (props.href) {
    return (
      <a {...props}>
        {children}
      </a>
    );
  }
  else {
    return (
      <div className={props.className}
           title={props.title}>
        {children}
      </div>
    );
  }
}
function ensureAbsolute(url) {
  if (!url || url.match(/^(https?:)?\/\//)) {
    return url;
  }
  else {
    return `http://${url}`;
  }
}
