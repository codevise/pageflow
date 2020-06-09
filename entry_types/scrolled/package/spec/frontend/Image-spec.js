import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {Image} from 'frontend/Image';

describe('Image', () => {
  it('renders nothing by default', () => {
    const {queryByRole} =
      renderInEntry(<Image id={100} />, {
        seed: {}
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('uses large variant of image given by id', () => {
    const {getByRole} =
      renderInEntry(<Image id={100} />, {
        seed: {
          imageFileUrlTemplates: {
            large: ':id_partition/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      });

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/image.jpg');
  });

  it('does not render image if isPrepared is false', () => {
    const {queryByRole} =
      renderInEntry(<Image id={100} isPrepared={false} />, {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('uses centered object position by default', () => {
    const {getByRole} =
      renderInEntry(<Image id={100} />, {
        seed: {
          imageFiles: [
            {permaId: 100}
          ]
        }
      });

    expect(getByRole('img')).toHaveStyle('object-position: 50% 50%');
  });

  it('uses focus from image configuration for object position', () => {
    const {getByRole} =
      renderInEntry(<Image id={100} />, {
        seed: {
          imageFiles: [
            {permaId: 100, configuration: {focusX: 20, focusY: 60}}
          ]
        }
      });

    expect(getByRole('img')).toHaveStyle('object-position: 20% 60%');
  });
});
