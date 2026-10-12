import React from 'react';

import {PlainLink} from '../Link';
import {useLinkTooltip} from '../../shared/linkTooltip';
import {usePreviewableLinkedEntry} from './LinkTooltip';

export function Link(props) {
  const linkTooltip = useLinkTooltip();
  const linkedEntry = usePreviewableLinkedEntry(props.href);

  if (!linkedEntry || !linkTooltip) {
    return <PlainLink {...props} />;
  }

  return (
    <PlainLink {...props}
               attributes={{
                 ...props.attributes,
                 onMouseEnter: event =>
                   linkTooltip.activate(props.href, props.openInNewTab,
                                        {current: event.currentTarget}),
                 onMouseLeave: () => linkTooltip.deactivate()
               }} />
  );
}
