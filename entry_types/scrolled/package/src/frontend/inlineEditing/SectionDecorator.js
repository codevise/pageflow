import React from 'react';
import classNames from 'classnames';
import styles from './SectionDecorator.module.css';
import contentElementStyles from './ContentElementDecorator.module.css';

import {Toolbar} from './Toolbar';
import {ForcePaddingContext} from '../Foreground';
import {useEditorSelection} from './EditorState';
import {MotifAreaVisibilityProvider} from '../MotifAreaVisibilityProvider';
import {useI18n} from '../i18n';

import transitionIcon from './images/arrows.svg';

export function SectionDecorator({section, contentElements, children}) {
  const {t} = useI18n({locale: 'ui'});

  const {isSelected, select, resetSelection} = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
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
        !event.target.closest('#fullscreenRoot')) {
      isSelected ? resetSelection() : select();
    }
  }

  return (
    <div aria-label={t('pageflow_scrolled.inline_editing.select_section')}
         className={className(isSelected, transitionSelection)}
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
        <ForcePaddingContext.Provider value={isLastContentElementSelected || isSelected}>
          {children}
        </ForcePaddingContext.Provider>
      </MotifAreaVisibilityProvider>
    </div>
  );
}

function className(isSectionSelected, transitionSelection) {
  return classNames(styles.wrapper, {
    [styles.selected]: isSectionSelected,
    [styles.transitionSelected]: transitionSelection.isSelected
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
