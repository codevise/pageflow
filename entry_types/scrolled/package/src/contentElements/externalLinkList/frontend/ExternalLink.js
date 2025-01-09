import React from 'react';
import classNames from 'classnames';
import styles from './ExternalLink.module.css';
import {
  EditableLink,
  InlineFileRights,
  useFileWithInlineRights,
  useContentElementConfigurationUpdate,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

import {Thumbnail} from './Thumbnail';

export function ExternalLink({id, configuration, ...props}) {
  const {isEditable} = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();

  const itemLinks = configuration.itemLinks || {};

  const thumbnailImageFile = useFileWithInlineRights({
    configuration: props,
    collectionName: 'imageFiles',
    propertyName: 'thumbnail'
  });

  const onClick = function (event) {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  function handleLinkChange(value) {
    updateConfiguration({
      itemLinks: {
        ...itemLinks,
        [id]: value
      }
    });
  }

  return (
    <li className={classNames(styles.item,
                              styles[`textPosition-${props.textPosition}`],
                              {[styles.link]: !!itemLinks[id]?.href},
                              {[styles.outlined]: props.outlined},
                              {[styles.selected]: props.selected})}
        onClick={onClick}>
      <Link isEditable={isEditable}
            href={itemLinks[id]?.href}
            openInNewTab={itemLinks[id]?.openInNewTab}
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
          <div className={styles.background}>
            <InlineFileRights context="afterElement" items={[{file: thumbnailImageFile, label: 'image'}]} />
            <div className={styles.details}>
              <p className={styles.link_title}>{props.title}</p>
              <p className={styles.link_desc}>{props.description}</p>
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
                    linkPreviewPosition="above" />
    );
  }
  else {
    return props.children;
  }
}
