import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from './EditorState';
import {useI18n} from '../i18n';
import {useScrollToTarget} from '../useScrollTarget';
import {ActionButton} from './ActionButton';

import styles from './BackdropDecorator.module.css';

export function BackdropDecorator({backdrop, motifAreaState, children}) {
  const {t} = useI18n({locale: 'ui'});

  const {isSelected: isSectionSelected, select: selectSection} = useEditorSelection({
    id: backdrop.contentElement?.sectionId,
    type: 'sectionSettings'
  });

  const {
    isSelected: isBackdropElementSelected,
    select: selectBackdropElement
  } = useEditorSelection({
    id: backdrop.contentElement?.id,
    type: 'contentElement'
  });

  const scrollToTarget = useScrollToTarget();

  let text, icon, handleClick;

  if (isBackdropElementSelected) {
    text = t('pageflow_scrolled.inline_editing.back_to_section');
    icon = 'foreground';
    handleClick = () => selectSection();
  }
  else if (backdrop.contentElement) {
    text = t('pageflow_scrolled.inline_editing.select_backdrop_content_element');
    icon = 'background';

    handleClick = () => {
      scrollToTarget({id: backdrop.contentElement.sectionId, align: 'start'});
      selectBackdropElement();
    }
  }
  else {
    return children;
  }

  return (
    <>
      <div className={classNames(styles.wrapper,
                                 {[styles.visible]: isBackdropElementSelected ||
                                   isSectionSelected})}
           style={{height: motifAreaState.paddingTop}}>
        <div className={styles.inner}>
          <ActionButton
            size="lg"
            position="center"
            icon={icon}
            text={text}
            onClick={handleClick} />
        </div>
      </div>
      {children}
    </>
  );
}
