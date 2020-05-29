import React from 'react';

export class ErrorCatching extends React.Component {
  state = {hasError: false};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error, errInfo) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
