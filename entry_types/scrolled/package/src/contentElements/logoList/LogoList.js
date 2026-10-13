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
  useFile
} from 'pageflow-scrolled/frontend';

import styles from './LogoList.module.css';

export function LogoList({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {isSelected} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const items = configuration.items || [];
  const itemLinks = configuration.itemLinks || {};

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_ITEM') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_ITEM_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
  });

  function handleItemClick(event, id) {
    if (isSelected) {
      setSelectedItemId(id);
      event.preventDefault();
    }
  }

  function handleListClick(event) {
    if (!event.defaultPrevented) {
      setSelectedItemId(null);
    }
  }

  function handleLinkChange(id, value) {
    updateConfiguration({itemLinks: {...itemLinks, [id]: value}});
  }

  return (
    <LinkTooltipProvider position="above" align="center" gap={5}>
      <ul className={styles.list} onClick={handleListClick}>
        {items.map((item, index) =>
          <Logo key={item.id}
                image={item.image}
                link={itemLinks[item.id]}
                load={shouldLoad}
                outlined={isSelected}
                highlighted={isSelected && index === highlightedIndex}
                selected={isSelected && item.id === selectedItemId}
                onClick={event => handleItemClick(event, item.id)}
                onLinkChange={value => handleLinkChange(item.id, value)} />
        )}
      </ul>
    </LinkTooltipProvider>
  );
}

function Logo({image, link, load, outlined, highlighted, selected, onClick, onLinkChange}) {
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
