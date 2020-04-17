import getCueOffsetClassName from '../getCueOffsetClassName';


describe('getCueOffsetClassName', () => {
  it('returns css class for offset', () => {
    const videoDimensions = {height: 130, top: -10};
    const wrapperDimensions = {height: 100};

    const result = getCueOffsetClassName(videoDimensions, wrapperDimensions);

    expect(result).toContain('cue_offset ');
    expect(result).toContain('cue_offset_2');
  });

  it('returns css class for margins', () => {
    const videoDimensions = {width: 130, left: -10};
    const wrapperDimensions = {width: 100};

    const result = getCueOffsetClassName(videoDimensions, wrapperDimensions);

    expect(result).toContain('cue_margin_left_1');
    expect(result).toContain('cue_margin_right_2');
  });
});
