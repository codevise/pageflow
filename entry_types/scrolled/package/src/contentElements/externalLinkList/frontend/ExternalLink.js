import React, {useMemo} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {
  EditableLink,
  EditableInlineText,
  EditableText,
  InlineFileRights,
  Text,
  useFileWithInlineRights,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n,
  utils,
  LinkButton
} from 'pageflow-scrolled/frontend';

import {Thumbnail} from './Thumbnail';

const scaleCategorySuffixes = {
  small: 'sm',
  medium: 'md',
  large: 'lg'
};

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

  const scaleCategorySuffix = scaleCategorySuffixes[props.textSize || 'small'];

  return (
    <li className={classNames(styles.item,
                              styles[`textPosition-${props.textPosition}`],
                              {[styles.link]: !!href && !configuration.displayButtons},
                              {[styles.outlined]: props.outlined},
                              {[styles.highlighted]: props.highlighted},
                              {[styles.selected]: props.selected})}
        onClick={props.onClick}>
      <Link isEnabled={!configuration.displayButtons}
            isEditable={isEditable}
            actionButtonVisible={props.selected}
            href={href}
            openInNewTab={openInNewTab}
            onChange={handleLinkChange}>
        <div className={classNames(
          styles.card,
          styles[`thumbnailSize-${props.thumbnailSize}`]
        )}>
          <div className={styles.thumbnail}>
            <Thumbnail imageFile={thumbnailImageFile}
                       aspectRatio={props.thumbnailAspectRatio}
                       cropPosition={props.thumbnailCropPosition}
                       load={props.loadImages}>
              <InlineFileRights context="insideElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
            </Thumbnail>
          </div>
          <div className={classNames(styles.background,
                                     styles[`align-${configuration.textAlign}`],
                                     props.darkBackground ? styles.light : styles.dark)}
               style={{pointerEvents: !isEditable || isSelected ? undefined : 'none'}}>
            <InlineFileRights context="afterElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
            <div className={styles.details}>
              {presentOrEditing('tagline') &&
               <Text scaleCategory={`teaserTagline-${scaleCategorySuffix}`}>
                 <EditableInlineText value={itemTexts[id]?.tagline}
                                     placeholder={t('pageflow_scrolled.inline_editing.type_tagline')}
                                     onChange={value => handleTextChange('tagline', value)} />
               </Text>}
              <Text scaleCategory={`teaserTitle-${scaleCategorySuffix}`}>
                <EditableInlineText value={itemTexts[id]?.title || legacyTexts.title}
                                    placeholder={t('pageflow_scrolled.inline_editing.type_heading')}
                                    onChange={value => handleTextChange('title', value)} />
              </Text>
              {presentOrEditing('description') &&
               <div className={styles.link_desc}>
                 <EditableText value={itemTexts[id]?.description || legacyTexts.description}
                               scaleCategory={`teaserDescription-${scaleCategorySuffix}`}
                               placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                               onChange={value => handleTextChange('description', value)} />
               </div>}
              {configuration.displayButtons && presentOrEditing('link') &&
               <LinkButton className={styles.link}
                           href={href}
                           openInNewTab={openInNewTab}
                           value={itemTexts[id]?.link}
                           linkPreviewDisabled={true}
                           actionButtonVisible={false}
                           onTextChange={value => handleTextChange('link', value)}
                           onLinkChange={value => handleLinkChange(value)} />}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function Link({isEnabled, isEditable, ...props}) {
  if ((isEnabled && props.href) || isEditable) {
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
