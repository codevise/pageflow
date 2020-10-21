import React from 'react';
import classNames from 'classnames';
import styles from './SectionDecorator.module.css';
import contentElementStyles from './ContentElementDecorator.module.css';

import {Toolbar} from './Toolbar';
import {ForcePaddingContext} from '../Foreground';
import {useEditorSelection} from './EditorState';
import {MotifAreaVisibilityProvider} from '../MotifArea';
import {useI18n} from '../i18n';

import editIcon from './images/settings.svg';
import transitionIcon from './images/arrows.svg';

export function SectionDecorator(props) {
  const {t} = useI18n({locale: 'ui'});

  const {isSelected, select, resetSelection} = useEditorSelection({
    id: props.id,
    type: 'section'
  });

  const settingsSelection = useEditorSelection({
    id: props.id,
    type: 'sectionSettings'
  });

  const transitionSelection = useEditorSelection({
    id: props.id,
    type: 'sectionTransition'
  });

  const nextTransitionSelection = useEditorSelection({
    id: props.nextSection && props.nextSection.id,
    type: 'sectionTransition'
  });

  const lastContentElement = props.foreground[props.foreground.length - 1];

  const {isSelected: isLastContentElementSelected} = useEditorSelection({
    id: lastContentElement && lastContentElement.id,
    type: 'contentElement'
  });

  const isSectionSelected = isSelected || settingsSelection.isSelected;

  function selectIfOutsideContentItem(event) {
    if (!event.target.closest(`.${contentElementStyles.wrapper}`)) {
      isSelected ? resetSelection() : select();
    }
  }

  return (
    <div aria-label={t('pageflow_scrolled.inline_editing.select_section')}
         className={className(isSectionSelected, transitionSelection)}
         onMouseDown={selectIfOutsideContentItem}>
      <div className={styles.controls}>
        {renderEditTransitionButton({id: props.previousSection && props.id,
                                     selection: transitionSelection,
                                     position: 'before'})}
        <div className={styles.editToolbar} >
          <EditSectionButton id={props.id}
                             selection={settingsSelection}
                             text={t('pageflow_scrolled.inline_editing.edit_section_settings')}
                             icon={editIcon} />
        </div>
        {renderEditTransitionButton({id: props.nextSection && props.nextSection.id,
                                     selection: nextTransitionSelection,
                                     position: 'after'})}
      </div>
      <MotifAreaVisibilityProvider visible={isSectionSelected}>
        <ForcePaddingContext.Provider value={isLastContentElementSelected || isSectionSelected}>
          {props.children}
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
