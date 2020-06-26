import React from 'react';

import {TwoColumn} from './TwoColumn';
import {Center} from './Center';

import {withInlineEditingAlternative} from '../inlineEditing';

export const Layout = withInlineEditingAlternative('LayoutWithPlaceholder',
                                                   LayoutWithoutInlineEditing);

export function LayoutWithoutInlineEditing(props) {
  if (props.sectionProps.layout === 'center') {
    return (<Center {...props} />);
  }
  else if (props.sectionProps.layout === 'right') {
    return (<TwoColumn align="right" {...props} />);
  }
  else {
    return (<TwoColumn {...props} />);
  }
}

Layout.defaultProps = {
  layout: 'left'
};
