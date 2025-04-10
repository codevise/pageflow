import React, {useState, useMemo} from 'react';
import classNames from 'classnames';

import {ActionButton} from './ActionButton';
import {EditableText} from './EditableText';
import {useDarkBackground} from './backgroundColor';
import {useContentElementEditorState} from './useContentElementEditorState';
import {useI18n} from './i18n';
import {isBlankEditableTextValue} from './utils/blank';

import styles from './Figure.module.css';

/**
 * Render a figure with a caption text attached.
 *
 * @param {Object} props
 * @param {string} props.children - Content of figure.
 * @param {Object[]|string} props.caption - Formatted text data as provided by onCaptionChange.
 * @param {string} [props.variant] - Name of figureCaption property scope to apply.
 * @param {Function} props.onCaptionChange - Receives updated value when it changes.
 * @param {boolean} [props.addCaptionButtonVisible=true] - Control visiblility of action button.
 * @param {string} [props.captionButtonPosition='outside'] - Position of action button.
 */
export function Figure({
  children,
  variant,
  caption, onCaptionChange,
  addCaptionButtonVisible = true, addCaptionButtonPosition = 'outside',
  renderInsideCaption
}) {
  const darkBackground = useDarkBackground();
  const {isSelected, isEditable} = useContentElementEditorState();
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const {t} = useI18n({locale: 'ui'});

  caption = useMemo(
    () => typeof caption === 'string' ?
         [{type: 'paragraph', children: [{ text: caption }]}] :
         caption,
    [caption]
  );

  if (!isBlankEditableTextValue(caption) || isEditable) {
    return (
      <figure className={classNames(styles.root, {[styles.invert]: !darkBackground})}>
        {children}

        {isBlankEditableTextValue(caption) && isSelected && !isEditingCaption && addCaptionButtonVisible &&
         <ActionButton position={addCaptionButtonPosition}
                       icon="pencil"
                       text={t('pageflow_scrolled.inline_editing.add_caption')}
                       onClick={() => setIsEditingCaption(true)} />}

        {(!isBlankEditableTextValue(caption) || isEditingCaption) &&
         <figcaption className={classNames(variant && `scope-figureCaption-${variant}`)}
                     onBlur={() => setIsEditingCaption(false)}>
           {renderInsideCaption?.()}
           <EditableText autoFocus={isEditingCaption}
                         value={caption}
                         scaleCategory="caption"
                         onChange={onCaptionChange}
                         onlyParagraphs={true}
                         hyphens="none"
                         placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
         </figcaption>}
      </figure>
    );
  }
  else {
    return children;
  }
}
