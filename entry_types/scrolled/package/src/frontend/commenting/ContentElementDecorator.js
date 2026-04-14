import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {useAddCommentMode} from './AddCommentModeProvider';
import {AddCommentOverlay} from './AddCommentOverlay';
import {FloatingAnchor} from './FloatingAnchor';
import {Popover} from './Popover';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './ContentElementDecorator.module.css';

export function ContentElementDecorator({type, permaId, children}) {
  const {inlineComments} = api.contentElementTypes.getOptions(type) || {};

  if (inlineComments) {
    return children;
  }

  return (
    <DefaultCommentDecorator permaId={permaId}>
      {children}
    </DefaultCommentDecorator>
  );
}

function DefaultCommentDecorator({permaId, children}) {
  const {active} = useAddCommentMode();
  const {isSelected} = useSelectedSubject('ContentElement', permaId);

  return (
    <div className={classNames(styles.wrapper, {[styles.selected]: isSelected})}>
      <div inert={active ? '' : undefined}>{children}</div>
      <AddCommentOverlay permaId={permaId} />
      <FloatingAnchor>
        {({placement}) => (
          <Popover subjectType="ContentElement"
                   subjectId={permaId}
                   placement={placement} />
        )}
      </FloatingAnchor>
    </div>
  );
}
