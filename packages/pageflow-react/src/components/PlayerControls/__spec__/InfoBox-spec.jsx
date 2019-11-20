import InfoBox, {isEmpty} from '../InfoBox';

import {mount} from 'enzyme';

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

describe('isEmpty', () => {
  it('returns true if all props are blank', () => {
    const result = isEmpty({title: '', description: '<b></b>'});

    expect(result).to.eq(true);
  });

  it('returns false if at least one prop is present', () => {
    const result = isEmpty({title: 'Some title'});

    expect(result).to.eq(false);
  });
});
