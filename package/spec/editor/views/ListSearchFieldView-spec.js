import {ListSearchFieldView, Search} from 'pageflow/editor';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ListSearchFieldView', () => {
  it('focuses input via hotkey if enabled', async () => {
    const user = userEvent.setup();

    const {getByLabelText} = render(new ListSearchFieldView({
      search: new Search(),
      label: 'Filter',
      hotkey: true
    }));
    await user.keyboard('/');

    expect(getByLabelText('Filter')).toHaveFocus();
  });

  it('ignores hotkey by default', async () => {
    const user = userEvent.setup();

    const {getByLabelText} = render(new ListSearchFieldView({
      search: new Search(),
      label: 'Filter'
    }));
    await user.keyboard('/');

    expect(getByLabelText('Filter')).not.toHaveFocus();
  });
});
