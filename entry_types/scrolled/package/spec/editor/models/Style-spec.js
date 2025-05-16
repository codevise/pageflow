import {Style} from 'editor/models/Style';

import {useFakeTranslations} from 'pageflow/testHelpers';

describe('Style', () => {
  const exampleTypes = {
    blur: {
      minValue: 0,
      maxValue: 100,
      defaultValue: 50,
      kind: 'filter'
    },
    frame: {
      kind: 'decoration',
      inputType: 'color',
      defaultValue: '#ffffff'
    }
  };

  useFakeTranslations({
    'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur'
  });

  it('has label based on translation', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.label()).toEqual('Blur');
  });

  it('has min and max values', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.minValue()).toEqual(0);
    expect(style.maxValue()).toEqual(100);
  });

  it('sets default value', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.get('value')).toEqual(50);
  });

  it('defaults to slider inputType', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.inputType()).toEqual('slider');
  });

  it('supports colors inputType', () => {
    const style = new Style({name: 'frame'}, {types: exampleTypes});

    expect(style.inputType()).toEqual('color');
  });
});
