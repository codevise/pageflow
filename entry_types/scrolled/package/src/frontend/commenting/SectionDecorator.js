import React from 'react';
import classNames from 'classnames';

import {useCommentThreads} from 'pageflow-scrolled/review';
import {useI18n} from '../i18n';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';
import {Popover} from './Popover';

import AddCommentIcon from './images/addComment.svg';
import styles from './SectionDecorator.module.css';

export function SectionDecorator({section, children}) {
  const {active} = useAddCommentMode();
  const {isSelected} = useSelectedSubject('Section', section.permaId);
  const threads = useCommentThreads(
    {subjectType: 'Section', subjectId: section.permaId},
    {resolved: false}
  );
  const hasThreads = threads.length > 0;

  return (
    <div className={styles.wrapper}>
      {children}
      <div className={classNames(styles.commentBadge,
                                 {[styles.sticky]: hasThreads || active || isSelected})}>
        {active ?
         <AddCommentButton permaId={section.permaId} /> :
         <Popover subjectType="Section"
                  subjectId={section.permaId}
                  placement="top-start"
                  strategy="fixed" />}
      </div>
    </div>
  );
}

function AddCommentButton({permaId}) {
  const {t} = useI18n({locale: 'ui'});
  const {deactivate} = useAddCommentMode();
  const {select} = useSelectedSubject('Section', permaId);

  function handleClick() {
    select({showNewForm: true});
    deactivate();
  }

  return (
    <button data-add-comment-overlay
            onClick={handleClick}
            className={styles.addButton}
            aria-label={t('pageflow_scrolled.review.select_section')}>
      <span className={styles.pill}>
        <AddCommentIcon />
      </span>
    </button>
  );
}
