import {StyleListInputView} from './StyleListInputView';
import {Style} from '../../models/Style';

export const ImageModifierListInputView = function(options) {
  return new StyleListInputView({
    ...options,
    types: Style.getImageModifierTypes({entry: options.entry}),
    translationKeyPrefix: 'pageflow_scrolled.editor.image_modifier_list_input'
  });
};
