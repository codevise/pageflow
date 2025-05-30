import I18n from 'i18n-js';
import {utils} from 'pageflow-scrolled/frontend';
import {editor} from 'pageflow-scrolled/editor';
import {InfoBoxView} from 'pageflow/editor';
import {SeparatorView, SelectInputView} from 'pageflow/ui'

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('textBlock', {
  pictogram,
  supportedPositions: ['inline'],

  configurationEditor({entry, contentElement}) {
    let pendingRefresh;

    this.listenTo(
      contentElement.transientState,
      'change:exampleNode',
      () => {
        // This is a terrible hack to prevent closing the minicolors
        // dropdown while adjusting colors. Calling refresh is needed
        // to update typography drop downs. Delay until color picker
        // is closed.
        if (document.activeElement &&
            document.activeElement.tagName === 'INPUT' &&
            document.activeElement.className === 'minicolors-input') {

          if (!pendingRefresh) {
            document.activeElement.addEventListener('blur', () => {
              pendingRefresh = false;
              this.refresh()
            }, {once: true});

            pendingRefresh = true;
          }

          return;
        }

        this.refresh()
      }
    );

    this.tab('general', function() {
      const exampleNode = ensureTextContent(
        contentElement.transientState.get('exampleNode')
      );

      const modelDelegator = entry.createLegacyTypographyVariantDelegator({
        model: contentElement.transientState,
        paletteColorPropertyName: 'color'
      })

      const getPreviewConfiguration = (configuration, properties) => {
        return exampleNode ? {
          ...configuration,
          value: [
            {
              ...exampleNode,
              // Ensure size in preview is not overridden by legacy variant
              variant: modelDelegator.get('typographyVariant'),
              ...properties
            },
            // Ensure content spans whole preview viewport if
            // section uses "cards" appearance.
            {type: 'paragraph', children: [{text: ''}]},
            {type: 'paragraph', children: [{text: ''}]}
          ]
        } : configuration;
      };

      this.group('ContentElementTypographyVariant', {
        entry,
        model: modelDelegator,
        prefix: exampleNode ? utils.camelize(exampleNode.type) : 'none',
        getPreviewConfiguration(configuration, variant) {
          return getPreviewConfiguration(configuration, {variant})
        }
      });
      this.group('ContentElementTypographySize', {
        entry,
        model: modelDelegator,
        prefix: exampleNode ? utils.camelize(exampleNode.type) : 'none',
        getPreviewConfiguration(configuration, size) {
          return getPreviewConfiguration(configuration, {size})
        }
      });

      this.group('PaletteColor', {
        entry,
        model: modelDelegator,
        propertyName: 'color'
      });
      this.input('textAlign', SelectInputView, {
        model: contentElement.transientState,
        values: ['ragged', 'justify']
      });

      this.view(SeparatorView);

      this.view(InfoBoxView, {
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.textBlock.help_texts.shortcuts'
        ),
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

function ensureTextContent(node) {
  if (node &&
      node.children.length === 1 &&
      node.children[0].text === '') {
    return {
      ...node,
      children: [{text: 'Lorem ipsum dolor sit amet'}]
    };
  }
  else {
    return node;
  }
}
