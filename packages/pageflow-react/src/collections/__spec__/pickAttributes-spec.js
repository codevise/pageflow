import pickAttributes from '../pickAttributes';


describe('loadFromSeed', () => {
  it('camelized attribute', () => {
    const post = {long_title: 'News'};

    const result = pickAttributes(['long_title'], post);

    expect(result).toEqual({longTitle: 'News'});
  });

  it('supports mapping attribute names', () => {
    const post = {post_type: 'gallery'};

    const result = pickAttributes([{type: 'post_type'}], post);

    expect(result).toEqual({type: 'gallery'});
  });

  it('supports including additional attributes', () => {
    const post = {title: 'News'};
    const additional = {some_setting: 'value'};

    const result = pickAttributes(['title'], post, additional);

    expect(result).toEqual({title: 'News', someSetting: 'value'});
  });
});
