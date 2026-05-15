import {StyleListInputView} from './StyleListInputView';
import {Style} from '../../models/Style';

export const EffectListInputView = function(options) {
  const types = Style.getEffectTypes({entry: options.entry});
  const filteredTypes = options.kinds
    ? Object.fromEntries(
        Object.entries(types).filter(([, type]) => options.kinds.includes(type.kind))
      )
    : types;

  return new StyleListInputView({
    ...options,
    hideLabel: true,
    types: filteredTypes,
    translationKeyPrefix: 'pageflow_scrolled.editor.effect_list_input'
  });
};
