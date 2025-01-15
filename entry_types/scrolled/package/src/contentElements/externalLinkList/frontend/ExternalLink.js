import React, {useMemo} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {
  EditableLink,
  EditableInlineText,
  EditableText,
  InlineFileRights,
  useFileWithInlineRights,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n,
  utils
} from 'pageflow-scrolled/frontend';

import {Thumbnail} from './Thumbnail';

export function ExternalLink({id, configuration, ...props}) {
  const {isEditable, isSelected} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});

  const itemTexts = configuration.itemTexts || {};
  const itemLinks = configuration.itemLinks || {};

  const thumbnailImageFile = useFileWithInlineRights({
    configuration: props,
    collectionName: 'imageFiles',
    propertyName: 'thumbnail'
  });

  function handleTextChange(propertyName, value) {
    updateConfiguration({
      itemTexts: {
        ...itemTexts,
        [id]: {
          ...itemTexts[id],
          [propertyName]: value
        }
      }
    });
  }

  function handleLinkChange(value) {
    updateConfiguration({
      itemLinks: {
        ...itemLinks,
        [id]: value
      }
    });
  }

  const legacyTexts = useMemo(
    () => ({
      title: [{
        type: 'heading',
        children: [{text: props.title || ''}],
      }],
      description: [{
        type: 'paragraph',
        children: [{text: props.description || ''}],
      }]
    }),
    [props.title, props.description]
  );

  function presentOrEditing(propertyName) {
    return !utils.isBlankEditableTextValue(itemTexts[id]?.[propertyName] ||
                                           legacyTexts[propertyName]) ||
           (isEditable && props.selected) ||
           (isEditable &&
            utils.isBlankEditableTextValue(itemTexts[id]?.tagline) &&
            utils.isBlankEditableTextValue(itemTexts[id]?.title || legacyTexts.title) &&
            utils.isBlankEditableTextValue(itemTexts[id]?.description || legacyTexts.description));
  }

  const href = itemLinks[id] ? itemLinks[id]?.href : ensureAbsolute(props.url);
  const openInNewTab = itemLinks[id] ? itemLinks[id]?.openInNewTab : props.open_in_new_tab;

  return (
    <li className={classNames(styles.item,
                              styles[`textPosition-${props.textPosition}`],
                              {[styles.link]: !!href},
                              {[styles.outlined]: props.outlined},
                              {[styles.selected]: props.selected})}
        onClick={props.onClick}>
      <Link isEditable={isEditable}
            actionButtonVisible={props.selected}
            href={href}
            openInNewTab={openInNewTab}
            onChange={handleLinkChange}>
        <div className={classNames(
          styles.card,
          styles[`thumbnailSize-${props.thumbnailSize}`],
          styles[`textSize-${props.textSize}`],
          {[styles.invert]: props.invert
        })}>
          <div className={styles.thumbnail}>
            <Thumbnail imageFile={thumbnailImageFile}
                       aspectRatio={props.thumbnailAspectRatio}
                       cropPosition={props.thumbnailCropPosition}
                       load={props.loadImages}>
              <InlineFileRights context="insideElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
            </Thumbnail>
          </div>
          <div className={styles.background}
               style={{pointerEvents: !isEditable || isSelected ? undefined : 'none'}}>
            <InlineFileRights context="afterElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
            <div className={styles.details}>
              {presentOrEditing('tagline') &&
               <div className={styles.tagline}>
                 <EditableInlineText value={itemTexts[id]?.tagline}
                                     placeholder={t('pageflow_scrolled.inline_editing.type_tagline')}
                                     onChange={value => handleTextChange('tagline', value)} />
               </div>}
              <div className={styles.title}>
                <EditableInlineText value={itemTexts[id]?.title || legacyTexts.title}
                                    placeholder={t('pageflow_scrolled.inline_editing.type_heading')}
                                    onChange={value => handleTextChange('title', value)} />
              </div>
              {presentOrEditing('description') &&
               <div className={styles.link_desc}>
                 <EditableText value={itemTexts[id]?.description || legacyTexts.description}
                               scaleCategory="teaserDescription"
                               placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                               onChange={value => handleTextChange('description', value)} />
               </div>}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function Link(props) {
  if (props.href || props.isEditable) {
    return (
      <EditableLink {...props}
                    actionButtonVisible={props.actionButtonVisible}
                    linkPreviewPosition="above" />
    );
  }
  else {
    return props.children;
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
