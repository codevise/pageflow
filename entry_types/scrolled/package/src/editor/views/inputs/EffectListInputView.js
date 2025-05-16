import {StyleListInputView} from './StyleListInputView';
import {Style} from '../../models/Style';

export const EffectListInputView = function(options) {
  return new StyleListInputView({
    ...options,
    types: Style.effectTypes,
    translationKeyPrefix: 'pageflow_scrolled.editor.effect_list_input'
  });
};
