import React from 'react';
import classNames from 'classnames';

import {
  useI18n,
  useContentElementEditorState,
  ActionButton
} from 'pageflow-scrolled/frontend';

import styles from './Flippable.module.css';

import {useFlippedItem} from './FlippedItemProvider';

export function Flippable({contentElementId, linkId, actionButtonVisible, front, back}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  const {t} = useI18n({locale: 'ui'});
  const backfaceId = `teaser-${contentElementId}-${linkId}-backface`;

  const [isFlipped, toggle] = useFlippedItem(linkId);

  function handleClick(event) {
    if (!isEditable && !event.target.closest('a, button')) {
      toggle();
    }
  }

  return (
    <div className={styles.outer}>
      {!isEditable &&
       <button aria-label={t('pageflow_scrolled.public.flip_card')}
               aria-expanded={isFlipped ? 'true' : 'false'}
               aria-controls={backfaceId}
               className={styles.flipButton}
               onClick={toggle} />}
      <div className={classNames(styles.flippable,
                               {[styles.flipped]: isFlipped},
                               {[styles.teaseFlip]: !isSelected},)}
           onClick={handleClick}>
        <div inert={isFlipped ? 'true' : undefined}>
          {front}
        </div>
        <div id={backfaceId}
             inert={isFlipped ? undefined : 'true'}>
          {back}
        </div>
      </div>
      {actionButtonVisible &&
       <ActionButton icon="background"
                     position="topRight"
                     portal={true}
                     text={t('pageflow_scrolled.public.flip_card')}
                     onClick={toggle} />}
    </div>
  );
}
