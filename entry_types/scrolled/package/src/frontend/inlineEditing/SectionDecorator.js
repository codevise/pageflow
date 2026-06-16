import React from 'react';
import classNames from 'classnames';
import styles from './SectionDecorator.module.css';
import backdropStyles from './BackdropDecorator.module.css';
import contentElementStyles from './ContentElementDecorator.module.css';
import widgetSelectionRectStyles from './WidgetSelectionRect.module.css';
import paddingIndicatorStyles from './PaddingIndicator.module.css';

import {features} from 'pageflow/frontend';
import {ThreadsBadge, useCommentThreads} from 'pageflow-scrolled/review';
import {Toolbar} from './Toolbar';
import {ForcePaddingContext} from '../Foreground';
import {useEditorSelection} from './EditorState';
import {MotifAreaVisibilityProvider} from '../MotifAreaVisibilityProvider';
import {useI18n} from '../i18n';

import transitionIcon from './images/arrows.svg';

export function SectionDecorator({backdrop, section, contentElements, transitions, children}) {
  const {t} = useI18n({locale: 'ui'});
  const commentingEnabled = features.isEnabled('commenting');

  const {isSelected: isSectionSelected, select, resetSelection} = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
  });

  const {isSelected: isPaddingSelected} = useEditorSelection({
    id: section.id,
    type: 'sectionPaddings'
  });

  const {isSelected: isCommentsSelected, select: selectComments} = useEditorSelection({
    id: section.id,
    type: 'sectionComments'
  });

  const {isSelected: isNewThreadSelected, select: selectNewThread} = useEditorSelection({
    type: 'newThread',
    subjectType: 'Section',
    subjectId: section.permaId
  });

  // Viewing a section's comments or composing a new thread on it.
  const commentsSelected = isCommentsSelected || isNewThreadSelected;

  // The section reads as selected while its comments are open, so the
  // section and the sidebar comment panel stay visually in sync.
  const isSelected = isSectionSelected || isPaddingSelected || commentsSelected;

  const threads = useCommentThreads(
    {subjectType: 'Section', subjectId: section.permaId},
    {resolved: false}
  );
  const hasThreads = threads.length > 0;

  const clipBadgeCorner = (isSectionSelected || isPaddingSelected) && !hasThreads;

  const {isSelected: isBackdropElementSelected} = useEditorSelection({
    id: backdrop.contentElement?.id,
    type: 'contentElement'
  });

  const {isSelected: isHighlighted} = useEditorSelection({
    id: section.id,
    type: 'section'
  });

  const transitionSelection = useEditorSelection({
    id: section.id,
    type: 'sectionTransition'
  });

  const nextTransitionSelection = useEditorSelection({
    id: section.nextSection && section.nextSection.id,
    type: 'sectionTransition'
  });

  const lastContentElement = contentElements[contentElements.length - 1];

  const {isSelected: isLastContentElementSelected} = useEditorSelection({
    id: lastContentElement && lastContentElement.id,
    type: 'contentElement'
  });

  function selectIfOutsideContentItem(event) {
    if (!event.target.closest(`.${contentElementStyles.wrapper}`) &&
        !event.target.closest(`.${backdropStyles.wrapper}`) &&
        !event.target.closest(`.${widgetSelectionRectStyles.wrapper}`) &&
        !event.target.closest(`.${paddingIndicatorStyles.indicator}`) &&
        !event.target.closest(`.${styles.commentBadge}`) &&
        !event.target.closest('#fullscreenRoot') &&
        !event.target.closest('[data-floating-ui-portal]')) {
      isSectionSelected ? resetSelection() : select();
    }
  }

  return (
    <div aria-label={t('pageflow_scrolled.inline_editing.select_section')}
         aria-selected={isSelected}
         className={className(isSelected, transitionSelection, isHighlighted, isBackdropElementSelected, transitions, clipBadgeCorner, commentingEnabled)}
         onMouseDown={selectIfOutsideContentItem}>
      <div className={styles.controls}>
        {renderEditTransitionButton({id: section.previousSection && section.id,
                                     selection: transitionSelection,
                                     position: 'before'})}
        {renderEditTransitionButton({id: section.nextSection && section.nextSection.id,
                                     selection: nextTransitionSelection,
                                     position: 'after'})}
      </div>
      <MotifAreaVisibilityProvider visible={isSelected}>
        <ForcePaddingContext.Provider value={isLastContentElementSelected ||
                                             isSectionSelected ||
                                             isHighlighted ||
                                             commentsSelected}>
          {children}
        </ForcePaddingContext.Provider>
      </MotifAreaVisibilityProvider>
      {commentingEnabled &&
       <div className={classNames(styles.commentBadge, {[styles.sticky]: hasThreads || commentsSelected})}>
         <ThreadsBadge subjectType="Section"
                       subjectId={section.permaId}
                       mode={commentsSelected ? 'active' :
                             isSelected ? 'icon' : 'dot'}
                       onClick={() => hasThreads ? selectComments() : selectNewThread()}
                       onSelectThread={threadId => selectComments({
                         type: 'sectionComments',
                         id: section.id,
                         highlightedThreadId: threadId
                       })} />
       </div>}
    </div>
  );
}

function className(isSelected, transitionSelection, isHighlighted, isBackdropElementSelected, transitions, clipBadgeCorner, commenting) {
  return classNames(styles.wrapper, {
    [styles.selected]: isSelected,
    [styles.highlighted]: isHighlighted,
    [styles.lineAbove]: isBackdropElementSelected && transitions[0].startsWith('fade'),
    [styles.lineBelow]: isBackdropElementSelected && transitions[1].startsWith('fade'),
    [styles.transitionSelected]: transitionSelection.isSelected,
    [styles.clipBadgeCorner]: clipBadgeCorner,
    [styles.commenting]: commenting
  });
}

function renderEditTransitionButton({id, position, selection}) {
  if (!id) {
    return null;
  }

  return (
    <div className={styles[`transitionToolbar-${position}`]}>
      <EditTransitionButton id={id}
                            selection={selection}
                            position={position} />
    </div>
  );
}

function EditTransitionButton({id, position, selection}) {
  const {t} = useI18n({locale: 'ui'});

  return (
    <EditSectionButton id={id}
                       selection={selection}
                       text={t(`pageflow_scrolled.inline_editing.edit_section_transition_${position}`)}
                       icon={transitionIcon} />
  );
}

function EditSectionButton({id, selection, icon, text}) {
  return (
    <Toolbar buttons={[{name: 'button', active: selection.isSelected, icon, text}]}
             iconSize={20}
             onButtonClick={() => selection.select()} />
  );
}
