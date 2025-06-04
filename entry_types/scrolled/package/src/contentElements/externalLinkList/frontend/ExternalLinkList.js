import React, {useState} from 'react';
import classNames from 'classnames';
import {
  useContentElementEditorCommandSubscription,
  useContentElementEditorState,
  useContentElementLifecycle,
  useDarkBackground,
  contentElementWidthName
} from 'pageflow-scrolled/frontend';
import {ExternalLink} from './ExternalLink';
import styles from './ExternalLinkList.module.css';

import textPositionBelowStyles from './textPositons/below.module.css';
import textPositionRightStyles from './textPositons/right.module.css';

const linkWidths = value => [
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl'
][value + 2];

export function ExternalLinkList(props) {
  const linkList = props.configuration.links || [];
  const {shouldLoad} = useContentElementLifecycle();
  const darkBackground = useDarkBackground();

  const {setTransientState, isSelected} = useContentElementEditorState();
  const [selectedItemId, setSelectedItemId] = useState();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_ITEM') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_ITEM_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
    else if (command.type === 'SET_SELECTED_ITEM') {
      setSelectedItemId(linkList[command.index]?.id);
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

  const layout = props.sectionProps.layout === 'centerRagged' ?
                 'center' :
                 props.sectionProps.layout;

  const linkWidth = linkWidths(
    ('linkWidth' in props.configuration) ? props.configuration.linkWidth : -1
  );

  const textPosition = props.configuration.textPosition || 'below';
  const textPositionStyles = textPosition === 'right' ?
                             textPositionRightStyles :
                             textPositionBelowStyles;

  return (
    <div className={styles.container}>
      <ul className={classNames(
            styles.list,
            styles[`textPosition-${textPosition}`],

            props.configuration.variant &&
            `scope-externalLinkList-${props.configuration.variant}`,

            textPositionStyles.list,
            textPositionStyles[`layout-${layout}`],
            textPositionStyles[`width-${contentElementWidthName(props.configuration.width)}`],
            textPositionStyles[`linkWidth-${linkWidth}`],
            textPositionStyles[`linkAlignment-${props.configuration.linkAlignment}`],
            textPositionStyles[`textPosition-${textPosition}`]
          )}
          style={{'--overlay-opacity': (props.configuration.overlayOpacity || 70) / 100,
                  '--thumbnail-aspect-ratio': `var(--theme-aspect-ratio-${props.configuration.thumbnailAspectRatio || 'wide'})`}}
          onClick={handleListClick}>
        {linkList.map((link, index) =>
          <ExternalLink {...link}
                        key={link.id}
                        configuration={props.configuration}
                        thumbnailAspectRatio={props.configuration.thumbnailAspectRatio}
                        thumbnailSize={props.configuration.thumbnailSize || 'small'}
                        thumbnailFit={props.configuration.thumbnailFit || 'cover'}
                        textPosition={props.configuration.textPosition || 'below'}
                        textSize={props.configuration.textSize || 'small'}
                        darkBackground={darkBackground}
                        loadImages={shouldLoad}
                        outlined={isSelected}
                        highlighted={highlightedIndex === index}
                        selected={link.id === selectedItemId && isSelected}
                        onClick={event => handleItemClick(event, link.id)} />
        )}
      </ul>
    </div>
  );
}
