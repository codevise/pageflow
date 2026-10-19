import React from 'react';

import {PlainLink} from '../Link';
import {useLinkTooltip} from '../../shared/linkTooltip';
import {usePreviewableLinkDestination} from './LinkTooltip';

export function Link(props) {
  const linkTooltip = useLinkTooltip();
  const destination = usePreviewableLinkDestination(props.href);

  if (!destination || !linkTooltip) {
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
