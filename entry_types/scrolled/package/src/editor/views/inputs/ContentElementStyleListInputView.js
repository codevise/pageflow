import {StyleListInputView} from './StyleListInputView';
import {Style} from '../../models/Style';

export const ContentElementStyleListInputView = function(options) {
  return new StyleListInputView({
    ...options,
    types: Style.getTypesForContentElement({entry: options.entry, contentElement: options.contentElement}),
    translationKeyPrefix: 'pageflow_scrolled.editor.content_element_style_list_input'
  });
};
