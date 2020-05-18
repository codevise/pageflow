import {editor} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('textBlock', {
  configurationEditor() {
    this.tab('general', function() {
    });
  },

  split(configuration, insertIndex) {
    return  [
      {
        ...configuration,
        value: configuration.value.slice(0, insertIndex),
      },
      {
        ...configuration,
        value: configuration.value.slice(insertIndex),
      }
    ];
  },

  merge(configurationA, configurationB) {
    return {
      ...configurationA,
      value: configurationA.value.concat(configurationB.value),
    };
  }
});
