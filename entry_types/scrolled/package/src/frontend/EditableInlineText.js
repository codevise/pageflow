import {withInlineEditingAlternative} from './inlineEditing';

export const EditableInlineText = withInlineEditingAlternative(
  'EditableInlineText',
  function EditableInlineText({value}) {
    return value[0]?.children[0]?.text || '';
  }
);
