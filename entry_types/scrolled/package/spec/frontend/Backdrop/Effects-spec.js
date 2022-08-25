import {getFilter} from 'frontend/Backdrop/Effects';

describe('Backdrop Effects getFilter', () => {
  it('uses normalized range for brightness, contrast and saturate', () => {
    const result = getFilter([
      {name: 'brightness', value: -100},
      {name: 'contrast', value: 20},
      {name: 'saturate', value: 50}
    ]);

    expect(result).toEqual('brightness(40%) contrast(120%) saturate(150%)');
  });

  it('uses pixel unit for blur', () => {
    const result = getFilter([
      {name: 'blur', value: 50}
    ]);

    expect(result).toEqual('blur(5px)');
  });

  it('uses percent for grayscale and sepia', () => {
    const result = getFilter([
      {name: 'sepia', value: 70},
      {name: 'grayscale', value: 20}
    ]);

    expect(result).toEqual('sepia(70%) grayscale(20%)');
  });
});
