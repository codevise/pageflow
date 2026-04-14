import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {AddCommentHint} from 'frontend/commenting/AddCommentHint';

describe('AddCommentHint', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.select_text_to_comment': 'Select text to comment'
  });

  it('renders hint text', () => {
    const {getByText} = render(<AddCommentHint />);

    expect(getByText('Select text to comment')).toBeInTheDocument();
  });
});
