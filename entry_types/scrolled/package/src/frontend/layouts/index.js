import React from 'react';

import {TwoColumn} from './TwoColumn';
import {Center} from './Center';

import {withInlineEditingAlternative} from '../inlineEditing';

export {widths, widthName} from './widths';

export const Layout = React.memo(
  withInlineEditingAlternative('LayoutWithPlaceholder', LayoutWithoutInlineEditing),
  (prevProps, nextProps) => (
    prevProps.sectionId === nextProps.sectionId &&
    prevProps.items === nextProps.items &&
    prevProps.appearance === nextProps.appearance &&
    prevProps.contentAreaRef === nextProps.contentAreaRef &&
    prevProps.sectionProps === nextProps.sectionProps
  )
);

export function LayoutWithoutInlineEditing(props) {
  if (props.sectionProps.layout === 'center' ||
      props.sectionProps.layout === 'centerRagged') {
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
