import React from 'react';
import {Range} from 'slate';
import {useSlate} from 'slate-react';

import {LinkTooltipProvider} from '../LinkTooltip';

export function SelectionAwareLinkTooltipProvider(props) {
  const editor = useSlate();

  return (
    <LinkTooltipProvider {...props}
                         disabled={!!editor.selection && !Range.isCollapsed(editor.selection)} />
  );
}
