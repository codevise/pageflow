import InfoBox from '../InfoBox';

import {mount} from 'enzyme';
import {expect} from 'support/chai';

describe('InfoBox', () => {
  it('renders header for title', () => {
    const result = mount(<InfoBox title="Some title" />);

    expect(result.find('h3')).to.have.text('Some title');
  });

  it('renders description', () => {
    const result = mount(<InfoBox description="Some text" />);

    expect(result.find('p')).to.have.text('Some text');
  });

  it('supports HTML in description', () => {
    const result = mount(<InfoBox description="Some <b>text</b>" />);

    expect(result.html()).to.contain('<b>text</b>');
  });
});
