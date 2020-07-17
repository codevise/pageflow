import {withInlineEditingAlternative} from './inlineEditing';

export const EditableInlineText = withInlineEditingAlternative(
  'EditableInlineText',
  function EditableInlineText({value, defaultValue = ''}) {
    return value ? value[0]?.children[0]?.text : defaultValue;
  }
);
