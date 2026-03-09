import {splitOverlayStyle} from 'frontend/splitOverlayStyle';

describe('splitOverlayStyle', () => {
  it('sets backgroundColor from color', () => {
    expect(splitOverlayStyle({color: '#ff0000'}))
      .toEqual({backgroundColor: '#ff0000'});
  });

  it('sets backdropFilter when color is translucent and backdropBlur is set', () => {
    expect(splitOverlayStyle({color: '#ff000080', backdropBlur: 50}))
      .toEqual({backgroundColor: '#ff000080', backdropFilter: 'blur(5px)'});
  });

  it('does not set backdropFilter when color is opaque', () => {
    expect(splitOverlayStyle({color: '#ff0000', backdropBlur: 50}))
      .toEqual({backgroundColor: '#ff0000'});
  });

  it('does not set backdropFilter when backdropBlur is 0', () => {
    expect(splitOverlayStyle({color: '#ff000080', backdropBlur: 0}))
      .toEqual({backgroundColor: '#ff000080'});
  });

  it('scales blur value to max 10px', () => {
    expect(splitOverlayStyle({color: '#ff000080', backdropBlur: 100}))
      .toEqual({backgroundColor: '#ff000080', backdropFilter: 'blur(10px)'});
  });

  it('defaults backdropFilter for translucent color', () => {
    expect(splitOverlayStyle({color: '#ff000080'}))
      .toEqual({backgroundColor: '#ff000080', backdropFilter: 'blur(10px)'});
  });

  it('defaults backdropFilter when no color is set', () => {
    expect(splitOverlayStyle({}))
      .toEqual({backdropFilter: 'blur(10px)'});
  });

  it('does not default backdropFilter for opaque color', () => {
    expect(splitOverlayStyle({color: '#ff0000'}))
      .toEqual({backgroundColor: '#ff0000'});
  });
});
