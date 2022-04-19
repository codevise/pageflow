import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('textBlock', {
  pictogram,
  supportedPositions: ['inline'],

  configurationEditor({entry, contentElement}) {
    this.listenTo(contentElement.transientState,
                  'change:currentNodeType',
                  () => this.refresh());

    this.tab('general', function() {
      const currentNodeType = contentElement.transientState.get('currentNodeType');

      this.group('ContentElementTypographyVariant', {
        entry,
        model: contentElement.transientState,
        prefix: currentNodeType || 'none',

        fallback() {
          this.view(NoOptionsHintView);
        }
      });
    });
  },

  split(configuration, insertIndex) {
    const value = getValue(configuration);

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
    const value = getValue(configurationA).concat(getValue(configurationB));

    return {
      ...configurationA,
      value,
    };
  },

  getLength(configuration) {
    return getValue(configuration).length;
  },

  handleDestroy(contentElement) {
    const transientState = contentElement.get('transientState') || {};

    if (!transientState.editableTextIsSingleBlock) {
      contentElement.postCommand({type: 'REMOVE'});
      return false;
    }
  }
});

function getValue(configuration) {
  // Value might still be empty if text block has not been edited
  return configuration.value || [{type: 'paragraph', children: [{text: ''}]}];
}
