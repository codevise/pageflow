import {extensible} from './extensionRegistry';

import {Widget} from './Widget'

export const SelectableWidget = extensible(
  'SelectableWidget',
  Widget
);
