import {frontend, useAudioFocus} from 'frontend';

import React, {useState} from 'react';

import {renderEntry} from 'support/pageObjects';
import {fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('useAudioFocus', () => {
  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component({contentElementId, configuration}) {
        const [isPlaying, setIsPlaying] = useState(false);

        useAudioFocus({
          key: contentElementId,
          request: isPlaying,
          onLost() {
            setIsPlaying(false);
          }
        });

        return (
          <button data-testid={configuration.testId}
                  onClick={() => setIsPlaying(true)}>
            {isPlaying ? 'Playing' : 'Paused'}
          </button>
        )
      }
    });
  });

  it('invokes callback for playing component when other component starts playing', () => {
    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'test', configuration: {testId: 'one'}},
          {typeName: 'test', configuration: {testId: 'two'}}
        ]
      }
    });

    fireEvent.click(getByTestId('one'));
    expect(getByTestId('one')).toHaveTextContent('Playing');

    fireEvent.click(getByTestId('two'));
    expect(getByTestId('two')).toHaveTextContent('Playing');
    expect(getByTestId('one')).toHaveTextContent('Paused');
  });
});
