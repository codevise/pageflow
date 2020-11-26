import {textColorForBackgroundColor} from 'frontend/textColorForBackgroundColor';

describe('textColorForBackgroundColor', () => {
  it('returns white for dark background color', () => {
    expect(textColorForBackgroundColor('#303030')).toEqual('#ffffff');
  });

  it('returns black for light background color', () => {
    expect(textColorForBackgroundColor('#eeeeee')).toEqual('#000000');
  });
});
