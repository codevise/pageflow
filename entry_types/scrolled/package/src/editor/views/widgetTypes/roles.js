import {editor} from 'pageflow/editor';

editor.widgetTypes.registerRole('header', {
  isOptional: false
});

editor.widgetTypes.registerRole('footer', {
  isOptional: true
});

editor.widgetTypes.registerRole('inlineFileRights', {
  isOptional: false
});
