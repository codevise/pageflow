import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('textBlock', {
  supportedPositions: ['inline'],

  configurationEditor() {
    this.tab('general', function() {
      this.view(NoOptionsHintView);
    });
  },

  split(configuration, insertIndex) {
    const value = configuration.value || [{type: 'paragraph', children: [{text: ''}]}];

    return  [
      {
        ...configuration,
        value: value.slice(0, insertIndex),
      },
      {
        ...configuration,
        value: value.slice(insertIndex),
      }
    ];
  },

  merge(configurationA, configurationB) {
    // Value might still be empty if text block has not been edited
    const value = (configurationA.value || []).concat(configurationB.value || []);

    return {
      ...configurationA,
      // Slate.js does not like empty arrays as value.
      // `inlineEditing/EditableText` sets default value, but only if
      // `value` is falsy.
      value: value.length ? value : undefined,
    };
  },

  getLength(configuration) {
    return configuration.value?.length || 0;
  },

  handleDestroy(contentElement) {
    const transientState = contentElement.get('transientState') || {};

    if (!transientState.editableTextIsSingleBlock) {
      contentElement.postCommand({type: 'REMOVE'});
      return false;
    }
  }
});
