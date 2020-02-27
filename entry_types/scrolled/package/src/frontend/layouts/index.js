import React from 'react';

import TwoColumn from './TwoColumn';
import Center from './Center';

export function Layout(props) {
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
