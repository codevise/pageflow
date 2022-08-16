import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {MotifArea} from 'frontend/v2/MotifArea';
import {MotifAreaVisibilityProvider} from 'frontend/MotifAreaVisibilityProvider';
import styles from 'frontend/MotifArea.module.css';

describe('MotifArea', () => {
  it('calls onUpdate callback with DOM element', () => {
    const callback = jest.fn();
    const {container} =
      renderInEntry(
        <MotifArea onUpdate={callback} />,
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      );

    expect(callback).toHaveBeenCalledWith(container.firstChild);
  });

  it('makes motif area visible if rendered inside MotifAreaVisibilityProvider', () => {
    const {container} =
      renderInEntry(
        <MotifArea />,
        {
          wrapper: ({children}) => (
            <MotifAreaVisibilityProvider visible={true}>
              {children}
            </MotifAreaVisibilityProvider>
          ),
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveClass(styles.visible);
  });
});
