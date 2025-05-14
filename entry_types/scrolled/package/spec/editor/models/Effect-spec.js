import {Effect} from 'editor/models/Effect';

import {useFakeTranslations} from 'pageflow/testHelpers';

describe('Effect', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur'
  });

  it('has label based on translation', () => {
    const effect = new Effect({name: 'blur'});

    expect(effect.label()).toEqual('Blur');
  });

  it('has min and max values', () => {
    const effect = new Effect({name: 'blur'});

    expect(effect.minValue()).toEqual(0);
    expect(effect.maxValue()).toEqual(100);
  });

  it('sets default value', () => {
    const effect = new Effect({name: 'blur'});

    expect(effect.get('value')).toEqual(50);
  });

  it('defaults to slider inputType', () => {
    const effect = new Effect({name: 'blur'});

    expect(effect.inputType()).toEqual('slider');
  });

  it('supports colors inputType', () => {
    const effect = new Effect({name: 'frame'});

    expect(effect.inputType()).toEqual('color');
  });
});
