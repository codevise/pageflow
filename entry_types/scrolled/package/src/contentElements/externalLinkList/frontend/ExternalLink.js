import React, {useMemo} from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';

import {
  EditableLink,
  EditableInlineText,
  EditableText,
  InlineFileRights,
  Link,
  Text,
  useFileWithInlineRights,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useI18n,
  utils,
  LinkButton
} from 'pageflow-scrolled/frontend';

import {Flippable} from './Flippable';
import {Thumbnail} from './Thumbnail';

const scaleCategorySuffixes = {
  small: 'sm',
  medium: 'md',
  large: 'lg'
};

export function ExternalLink({id, configuration, contentElementId, ...props}) {
  const {isEditable, isSelected} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t: translateWithEntryLocale} = useI18n();
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
    if (value) {
      if (utils.isBlankEditableTextValue(itemTexts[id]?.link)) {
        handleTextChange('link', [{
          type: 'heading',
          children: [{text: translateWithEntryLocale('pageflow_scrolled.public.more')}]
        }]);
      }
    }
    else {
      handleTextChange('link', [{
        type: 'heading',
        children: [{text: ''}]
      }]);
    }

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

  function getCardLinkMode() {
    if (isEditable || !href || displayButtons) {
      return 'none';
    }
    if (props.textPosition === 'none') {
      return 'image';
    }
    if (titlePresent) {
      return 'title';
    }
    return 'more';
  }

  const href = itemLinks[id] ? itemLinks[id]?.href : ensureAbsolute(props.url);
  const openInNewTab = itemLinks[id] ? itemLinks[id]?.openInNewTab : props.open_in_new_tab;

  const scaleCategorySuffix = scaleCategorySuffixes[props.textSize || 'small'];
  const displayButtons = configuration.displayButtons || configuration.backfaces

  const inlineFileRightsAfterCard = props.textPosition === 'right' ||
                                    props.textPosition === 'overlay' ||
                                    props.textPosition === 'none';

  const inlineFileRightsItems = [{file: thumbnailImageFile, label: 'image'}];

  const titlePresent = presentOrEditing('title');
  const descriptionPresent = presentOrEditing('description');
  const cardLinkMode = getCardLinkMode();
  const descriptionElementId = `external-link-${contentElementId}-${id}-description`;

  return (
    <li className={classNames(styles.item,
                              styles[`textPosition-${props.textPosition}`],
                              {[styles.link]: !!href && !displayButtons},
                              {[styles.outlined]: props.outlined},
                              {[styles.highlighted]: props.highlighted},
                              {[styles.selected]: props.selected})}
        onClick={props.onClick}>
      <EditorLinkWrapper isEditable={isEditable}
                         linkPreviewDisabled={props.selected && configuration.backfaces}
                         actionButtonVisible={props.selected}
                         actionButtonPortal={true}
                         href={href}
                         openInNewTab={openInNewTab}
                         onChange={handleLinkChange}>
        <div className={styles.cardWrapper}>
          {renderItemContent()}
          {cardLinkMode === 'more' &&
           <MoreLink href={href}
                     openInNewTab={openInNewTab}
                     describedBy={descriptionPresent ? descriptionElementId : undefined} />}
        </div>
      </EditorLinkWrapper>
    </li>
  );

  function renderItemContent() {
    if (configuration.backfaces) {
      return (
        <Flippable
          contentElementId={contentElementId}
          linkId={id}
          actionButtonVisible={props.selected}
          front={renderFront()}
          back={renderBack()}
        />
      )
    }
    else {
      return renderFront();
    }
  }

  function renderFront() {
    return (
      <>
        <div className={classNames(
          styles.card,
          styles.front,
          styles[`thumbnailSize-${props.thumbnailSize}`]
        )}>
          <div className={styles.thumbnail}
               style={{backgroundColor: props.thumbnailBackgroundColor}}>
            <Thumbnail imageFile={thumbnailImageFile}
                       aspectRatio={props.thumbnailAspectRatio}
                       cropPosition={props.thumbnailCropPosition}
                       fit={props.thumbnailFit}
                       linkWidth={props.linkWidth}
                       load={props.loadImages}
                       showPlaceholder={isEditable}
                       renderImageLink={cardLinkMode === 'image'
                         ? (image) => (
                             <Link href={href} openInNewTab={openInNewTab}>
                               {image}
                             </Link>
                           )
                         : undefined}>
              <InlineFileRights configuration={configuration}
                                context="insideElement"
                                position={props.textPosition === 'overlay' ? 'top': 'bottom'}
                                items={inlineFileRightsItems} />
            </Thumbnail>
          </div>
          <div className={classNames(styles.background,
                                     styles[`align-${configuration.textAlign}`],
                                     props.darkBackground ? styles.light : styles.dark)}
               style={{pointerEvents: !isEditable || isSelected ? undefined : 'none'}}>
            {!inlineFileRightsAfterCard &&
             <InlineFileRights configuration={configuration}
                               context="afterElement"
                               items={inlineFileRightsItems} />}
            <div className={styles.details}>
              {presentOrEditing('tagline') &&
               <Text scaleCategory={`teaserTagline-${scaleCategorySuffix}`}>
                 <EditableInlineText value={itemTexts[id]?.tagline}
                                     placeholder={t('pageflow_scrolled.inline_editing.type_tagline')}
                                     onChange={value => handleTextChange('tagline', value)} />
               </Text>}
              {titlePresent &&
               <Text scaleCategory={`teaserTitle-${scaleCategorySuffix}`}>
                 <TitleLink isEnabled={cardLinkMode === 'title'}
                            href={href}
                            openInNewTab={openInNewTab}>
                   <EditableInlineText value={itemTexts[id]?.title || legacyTexts.title}
                                       placeholder={t('pageflow_scrolled.inline_editing.type_heading')}
                                       onChange={value => handleTextChange('title', value)} />
                 </TitleLink>
               </Text>}
              {descriptionPresent &&
               <div className={styles.description} id={descriptionElementId}>
                 <EditableText value={itemTexts[id]?.description || legacyTexts.description}
                               scaleCategory={`teaserDescription-${scaleCategorySuffix}`}
                               placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                               onChange={value => handleTextChange('description', value)} />
               </div>}
              {configuration.displayButtons && !configuration.backfaces &&
               presentOrEditing('link') &&
               <div className={styles.button}>
                 <LinkButton scaleCategory="teaserLink"
                             href={href}
                             openInNewTab={openInNewTab}
                             value={itemTexts[id]?.link}
                             linkPreviewDisabled={true}
                             actionButtonVisible={false}
                             onTextChange={value => handleTextChange('link', value)}
                             onLinkChange={value => handleLinkChange(value)} />
               </div>}
            </div>
          </div>
        </div>
        {inlineFileRightsAfterCard &&
         <div className={styles.inlineFileRightsAfterCard}>
           <InlineFileRights configuration={configuration}
                             context="afterElement"
                             items={inlineFileRightsItems} />
         </div>}
      </>
    );
  }

  function renderBack() {
    return (
      <div className={styles.card}>
        <div className={classNames(styles.background,
                                   styles[`align-${configuration.textAlign}`],
                                   props.darkBackground ? styles.light : styles.dark)}
             style={{pointerEvents: !isEditable || isSelected ? undefined : 'none'}}>
          <div className={styles.details}>
            {presentOrEditing('backfaceTitle') &&
             <Text scaleCategory={`teaserTitle-${scaleCategorySuffix}`}>
               <EditableInlineText value={itemTexts[id]?.backfaceTitle}
                                   placeholder={t('pageflow_scrolled.inline_editing.type_heading')}
                                   onChange={value => handleTextChange('backfaceTitle', value)} />
             </Text>}
            {presentOrEditing('backfaceDescription') &&
             <EditableText value={itemTexts[id]?.backfaceDescription}
                           scaleCategory={`teaserDescription-${scaleCategorySuffix}`}
                           placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                           onChange={value => handleTextChange('backfaceDescription', value)} />}
            {presentOrEditing('link') &&
             <div className={styles.button}>
               <LinkButton scaleCategory="teaserLink"
                           href={href}
                           openInNewTab={openInNewTab}
                           value={itemTexts[id]?.link}
                           actionButtonVisible={false}
                           onTextChange={value => handleTextChange('link', value)}
                           onLinkChange={value => handleLinkChange(value)} />
             </div>}
          </div>
        </div>
      </div>
    );
  }
}

function TitleLink({isEnabled, href, openInNewTab, children}) {
  if (isEnabled) {
    return (
      <Link href={href}
            openInNewTab={openInNewTab}
            attributes={{className: styles.titleLink}}>
        {children}
      </Link>
    );
  }
  else {
    return children;
  }
}

function MoreLink({href, openInNewTab, describedBy}) {
  const {t: translateWithEntryLocale} = useI18n();

  return (
    <Link href={href}
          openInNewTab={openInNewTab}
          attributes={{
            className: styles.moreLink,
            'aria-describedby': describedBy
          }}>
      <span className={styles.moreLinkLabel}>
        {translateWithEntryLocale('pageflow_scrolled.public.more')}
      </span>
    </Link>
  );
}

function EditorLinkWrapper({isEditable, ...props}) {
  if (isEditable) {
    return (
      <EditableLink {...props}
                    allowRemove={true} />
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
