import React from 'react';

import {CommentBadge} from 'pageflow-scrolled/review';

export function ContentElementDecorator({permaId, children}) {
  return (
    <>
      {children}
      <CommentBadge subjectType="ContentElement" subjectId={permaId} />
    </>
  );
}
