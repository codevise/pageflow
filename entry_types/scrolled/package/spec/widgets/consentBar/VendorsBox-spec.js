import React from 'react';

import {VendorsBox} from 'widgets/consentBar/VendorsBox';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import {fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('VendorsBox', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.consent_save': 'Save'
  });

  it('renders vendors with initial state', () => {
    const vendors = [
      {
        name: 'xyAnalytics',
        displayName: 'XY Analytics',
        state: 'accepted'
      },
      {
        name: 'yzAnalytics',
        displayName: 'YZ Analytics',
        state: 'undecided'
      }
    ];

    const {getByLabelText} = renderInEntry(<VendorsBox vendors={vendors} />);

    expect(getByLabelText('XY Analytics')).toBeChecked();
    expect(getByLabelText('YZ Analytics')).not.toBeChecked();
  });

  it('allows changing vendor state via toggle', () => {
    const vendors = [
      {
        name: 'yzAnalytics',
        displayName: 'YZ Analytics',
        state: 'undecided'
      }
    ];

    const {getByLabelText} = renderInEntry(<VendorsBox vendors={vendors} />);
    fireEvent.click(getByLabelText('YZ Analytics'));

    expect(getByLabelText('YZ Analytics')).toBeChecked();
  });

  it('passes vendors states to save', () => {
    const vendors = [
      {
        name: 'xyAnalytics',
        displayName: 'XY Analytics',
        state: 'undecided'
      },
      {
        name: 'yzAnalytics',
        displayName: 'YZ Analytics',
        state: 'undecided'
      }
    ];
    const save = jest.fn();

    const {getByLabelText, getByRole} =
      renderInEntry(<VendorsBox vendors={vendors} save={save} />);
    fireEvent.click(getByLabelText('YZ Analytics'));
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(save).toHaveBeenCalledWith({xyAnalytics: false, yzAnalytics: true});
  });
});
