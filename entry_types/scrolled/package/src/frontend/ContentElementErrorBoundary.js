import React from 'react';

import styles from './ContentElement.module.css';

export class ContentElementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.missing}>Error rendering element of type "{this.props.type}"</div>
      );
    }

    return this.props.children;
  }
}
