import pickAttributes from '../pickAttributes';

import {expect} from 'support/chai';

describe('loadFromSeed', () => {
  it('camelized attribute', () => {
    const post = {long_title: 'News'};

    const result = pickAttributes(['long_title'], post);

    expect(result).to.eql({longTitle: 'News'});
  });

  it('supports mapping attribute names', () => {
    const post = {post_type: 'gallery'};

    const result = pickAttributes([{type: 'post_type'}], post);

    expect(result).to.eql({type: 'gallery'});
  });

  it('supports including additional attributes', () => {
    const post = {title: 'News'};
    const additional = {some_setting: 'value'};

    const result = pickAttributes(['title'], post, additional);

    expect(result).to.eql({title: 'News', someSetting: 'value'});
  });
});
