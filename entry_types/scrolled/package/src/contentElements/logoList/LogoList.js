import React, {useState} from 'react';
import classNames from 'classnames';

import {
  EditableLink,
  Image,
  LinkTooltipProvider,
  useContentElementConfigurationUpdate,
  useContentElementEditorCommandSubscription,
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile,
  useIsStaticPreview
} from 'pageflow-scrolled/frontend';

import styles from './LogoList.module.css';

export function LogoList({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const isStaticPreview = useIsStaticPreview();
  const {isSelected, setTransientState} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [marqueePreview, setMarqueePreview] = useState(false);

  const items = configuration.items || [];
  const itemLinks = configuration.itemLinks || {};

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_ITEM') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_ITEM_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
    else if (command.type === 'SET_SELECTED_ITEM') {
      setSelectedItemId(items[command.index]?.id || null);
    }
    else if (command.type === 'START_MARQUEE_PREVIEW') {
      setMarqueePreview(true);
    }
    else if (command.type === 'STOP_MARQUEE_PREVIEW') {
      setMarqueePreview(false);
    }
  });

  function handleItemClick(event, id) {
    if (isSelected) {
      setTransientState({selectedItemId: id});
      setSelectedItemId(id);
      event.preventDefault();
    }
  }

  function handleListClick(event) {
    if (!event.defaultPrevented) {
      setTransientState({selectedItemId: null});
      setSelectedItemId(null);
    }
  }

  function handleLinkChange(id, value) {
    updateConfiguration({itemLinks: {...itemLinks, [id]: value}});
  }

  function handleMarqueeFocus(event) {
    event.target.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }

  function handleMarqueeBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      event.currentTarget.scrollLeft = 0;
    }
  }

  const marquee = !isStaticPreview && configuration.marquee && (!isSelected || marqueePreview);

  return (
    <LinkTooltipProvider position="above" align="center" gap={5}>
      {marquee ? renderMarquee() : renderList()}
    </LinkTooltipProvider>
  );

  function renderMarquee() {
    return (
      <div className={styles.marquee}
           style={{'--logo-count': items.length,
                   '--marquee-speed': scaleProperty('marquee-speed', configuration.marqueeSpeed)}}
           onFocus={handleMarqueeFocus}
           onBlur={handleMarqueeBlur}>
        {renderList()}
        {renderList({inert: ''})}
      </div>
    );
  }

  function renderList(attributes) {
    return (
      <ul className={classNames(styles.list,
                                {[styles.staggered]: configuration.staggered})}
          style={{'--logo-height': scaleProperty('logo-height', configuration.logoHeight)}}
          onClick={handleListClick}
          {...attributes}>
        {items.map((item, index) =>
          <Logo key={item.id}
                image={item.image}
                alt={item.alt}
                link={itemLinks[item.id]}
                load={shouldLoad}
                outlined={isSelected}
                highlighted={isSelected && index === highlightedIndex}
                selected={isSelected && item.id === selectedItemId}
                onClick={event => handleItemClick(event, item.id)}
                onLinkChange={value => handleLinkChange(item.id, value)} />
        )}
      </ul>
    );
  }
}

function scaleProperty(name, value) {
  return value && `var(--theme-logo-list-${name}-${value})`;
}

function Logo({image, alt, link, load, outlined, highlighted, selected, onClick, onLinkChange}) {
  const {isEditable} = useContentElementEditorState();
  const imageFile = useFile({collectionName: 'imageFiles', permaId: image});

  if (!imageFile) {
    return null;
  }

  return (
    <li className={classNames(styles.item,
                              {[styles.outlined]: outlined,
                               [styles.highlighted]: highlighted,
                               [styles.selected]: selected})}
        onClick={onClick}>
      {renderLink(
        <Image imageFile={imageFile}
               alt={alt}
               load={load}
               variant="medium"
               preferSvg={true}
               fill={false}
               width={imageFile.width}
               height={imageFile.height} />
      )}
    </li>
  );

  function renderLink(children) {
    if (!isEditable && !link?.href) {
      return children;
    }

    return (
      <EditableLink className={styles.link}
                    linkPreviewPosition="above"
                    href={link?.href}
                    openInNewTab={link?.openInNewTab}
                    actionButtonVisible={selected}
                    actionButtonPortal={true}
                    allowRemove={true}
                    onChange={onLinkChange}>
        {children}
      </EditableLink>
    );
  }
}
