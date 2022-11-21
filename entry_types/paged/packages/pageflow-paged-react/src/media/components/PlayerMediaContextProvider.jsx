import React from 'react';

export default class PlayerMediaContextProvider extends React.Component {
  getChildContext() {
    return {
      mediaContext: {
        ...this.context.mediaContext,
        playbackMode: this.props.playbackMode,
        playerDescription: this.props.playerDescription
      },
    };
  }

  render() {
    return this.props.children;
  }
}

PlayerMediaContextProvider.contextTypes = {
  mediaContext: React.PropTypes.object
};

PlayerMediaContextProvider.childContextTypes = {
  mediaContext: React.PropTypes.object
};
