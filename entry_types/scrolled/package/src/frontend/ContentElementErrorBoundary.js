import React from 'react';

import {api} from './api';
import styles from './ContentElement.module.css';

export function ContentElementErrorBoundary({typeName, configuration, children}) {
  const ErrorBoundary = api.contentElementErrorBoundary || DefaultErrorBoundary;
  const fallback = () => <DefaultFallback type={typeName} />;

  return (
    <ErrorBoundary
      typeName={typeName}
      configuration={configuration}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}

class DefaultErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback();
    }

    return this.props.children;
  }
}

function DefaultFallback({type}) {
  return (
    <div className={styles.missing}>Error rendering element of type "{type}"</div>
  );
}
