import React from 'react';

import {ActionButtons} from './ActionButtons';

export function ActionButton({icon, text, onClick, iconOnly, ...rest}) {
  return (
    <ActionButtons {...rest} buttons={[{icon, text, onClick, iconOnly}]} />
  );
}
