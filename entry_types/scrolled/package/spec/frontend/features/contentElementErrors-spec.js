import React, {useEffect} from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element errors', () => {
  usePageObjects();

  beforeEach(() => {
    frontend.contentElementErrorBoundary = undefined;
  });

  it('are handled at content element level', () => {
    frontend.contentElementTypes.register('working', {
      component: function Working({configuration}) {
        return (
          <div>Working component</div>
        )
      }
    });
    frontend.contentElementTypes.register('broken', {
      component: function Broken({configuration}) {
        useEffect(() => { throw(new Error('Something went wrong')); });

        return (
          <div>I'll throw an error</div>
        )
      }
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});
    const {queryByText} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'working'},
          {typeName: 'broken'}
        ]
      }
    });

    expect(queryByText('Working component')).toBeInTheDocument();
    expect(queryByText('Error rendering element of type "broken"')).toBeInTheDocument();
  });

  it('can use custom error boundary', () => {
    let capturedProps;

    class CustomErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        capturedProps = props;
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

    frontend.contentElementErrorBoundary = CustomErrorBoundary;

    frontend.contentElementTypes.register('broken', {
      component: function Broken({configuration}) {
        useEffect(() => { throw(new Error('Something went wrong')); });

        return (
          <div>I'll throw an error</div>
        )
      }
    });

    const {queryByText} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'broken', configuration: {testProp: 'testValue'}}
        ]
      }
    });

    expect(capturedProps.typeName).toBe('broken');
    expect(capturedProps.configuration).toEqual({testProp: 'testValue'});
    expect(queryByText('Error rendering element of type "broken"')).toBeInTheDocument();
  });
});
