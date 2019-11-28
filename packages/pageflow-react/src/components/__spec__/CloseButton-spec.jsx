import CloseButton from '../CloseButton';

import {stubI18n, mockContext} from 'support';
import {mount} from 'enzyme';

describe('CloseButton', () => {
  stubI18n();

  it('renders ok', () => {
    const wrapper = mount(<CloseButton />, {context: mockContext(['i18n'])});

    expect(wrapper).toContainMatchingElement('.close_button');
  });
});
