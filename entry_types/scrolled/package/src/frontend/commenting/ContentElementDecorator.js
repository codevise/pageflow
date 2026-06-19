import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {widths} from '../layouts';
import {useAddCommentMode} from './AddCommentModeProvider';
import {AddCommentOverlay} from './AddCommentOverlay';
import {Popover} from './Popover';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './ContentElementDecorator.module.css';

export function ContentElementDecorator({type, width, customMargin, permaId, children}) {
  const {inlineComments} = api.contentElementTypes.getOptions(type) || {};

  if (inlineComments) {
    return children;
  }

  return (
    <DefaultCommentDecorator permaId={permaId}
                             flush={width === widths.full || customMargin}>
      {children}
    </DefaultCommentDecorator>
  );
}

function DefaultCommentDecorator({permaId, flush, children}) {
  const {active} = useAddCommentMode();
  const {isSelected} = useSelectedSubject('ContentElement', permaId);

  return (
    <div className={classNames(styles.wrapper, {[styles.selected]: isSelected})}>
      <div inert={active ? '' : undefined}>{children}</div>
      <AddCommentOverlay permaId={permaId} />
      <div className={classNames(styles.badge, {[styles.badgeFlush]: flush})}>
        <Popover subjectType="ContentElement" subjectId={permaId} />
      </div>
    </div>
  );
}
