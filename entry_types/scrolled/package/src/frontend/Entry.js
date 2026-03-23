import React from 'react';

import {Content} from './Content';
import {Widget} from './Widget';
import {SelectableWidget} from './SelectableWidget';
import {WidgetPresenceWrapper} from './WidgetPresenceWrapper';

import {extensible} from './extensions';

export const Entry = extensible('Entry', function Entry() {
  return (
    <WidgetPresenceWrapper>
      <Widget role="consent" />
      <SelectableWidget role="header" />
      <Content />
    </WidgetPresenceWrapper>
  );
});
