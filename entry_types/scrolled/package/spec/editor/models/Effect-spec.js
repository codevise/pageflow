import {Effect} from 'editor/models/Effect';

import {useFakeTranslations} from 'pageflow/testHelpers';

describe('Effect', () => {
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
    const effect = new Effect({name: 'blur'}, {types: exampleTypes});

    expect(effect.label()).toEqual('Blur');
  });

  it('has min and max values', () => {
    const effect = new Effect({name: 'blur'}, {types: exampleTypes});

    expect(effect.minValue()).toEqual(0);
    expect(effect.maxValue()).toEqual(100);
  });

  it('sets default value', () => {
    const effect = new Effect({name: 'blur'}, {types: exampleTypes});

    expect(effect.get('value')).toEqual(50);
  });

  it('defaults to slider inputType', () => {
    const effect = new Effect({name: 'blur'}, {types: exampleTypes});

    expect(effect.inputType()).toEqual('slider');
  });

  it('supports colors inputType', () => {
    const effect = new Effect({name: 'frame'}, {types: exampleTypes});

    expect(effect.inputType()).toEqual('color');
  });
});
