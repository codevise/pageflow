import React from 'react';

import {Content} from './Content';
import {Widget} from './Widget';
import {SelectableWidget} from './SelectableWidget';

import {withInlineEditingDecorator} from './inlineEditing';

export const Entry = withInlineEditingDecorator('EntryDecorator', function Entry() {
  return (
    <>
      <Widget role="consent" />
      <SelectableWidget role="header" />
      <Content />
    </>
  );
});
