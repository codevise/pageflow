import React from 'react';

export default class MediaContextProvider extends React.Component {
  getChildContext() {
    return {
      mediaContext: this.props.mediaContext,
    };
  }

  render() {
    return this.props.children;
  }
}

MediaContextProvider.childContextTypes = {
  mediaContext: React.PropTypes.object
};
