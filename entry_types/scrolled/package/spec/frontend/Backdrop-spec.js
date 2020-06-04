import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {Backdrop} from 'frontend/Backdrop';

describe('Backdrop', () => {
  it('supports rendering image given by id', () => {
    const {queryAllByRole} =
      renderInEntry(
        <Backdrop image={100}>
          {children => children}
        </Backdrop>,
        {
          seed: {
            imageFiles: [
              {permaId: 100}
            ]
          }
        }
      );

    expect(queryAllByRole('img').length).toBe(1);
  });

  it('supports rendering mobile image given by id', () => {
    const {queryAllByRole} =
      renderInEntry(
        <Backdrop image={100} imageMobile={200}>
          {children => children}
        </Backdrop>,
        {
          seed: {
            imageFiles: [
              {permaId: 100},
              {permaId: 200},
            ]
          }
        }
      )

    expect(queryAllByRole('img').length).toBe(1);
  });
});
