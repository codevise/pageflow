import I18n from 'i18n-js';
import {Node, Point} from 'slate';

import {utils} from 'pageflow-scrolled/frontend';
import {editor} from 'pageflow-scrolled/editor';
import {InfoBoxView} from 'pageflow/editor';
import {SeparatorView, SelectInputView} from 'pageflow/ui'

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('textBlock', {
  pictogram,
  supportedPositions: ['inline'],

  configurationEditor({entry, contentElement}) {
    let lastExampleNodeType = contentElement.transientState.get('exampleNode')?.type;

    this.listenTo(
      contentElement.transientState,
      'change:exampleNode',
      () => {
        const exampleNodeType = contentElement.transientState.get('exampleNode')?.type;

        if (exampleNodeType !== lastExampleNodeType) {
          lastExampleNodeType = exampleNodeType;
          this.refresh();
        }
      }
    );

    this.tab('general', function() {
      const exampleNode = contentElement.transientState.get('exampleNode');

      const modelDelegator = entry.createLegacyTypographyVariantDelegator({
        model: contentElement.transientState,
        paletteColorPropertyName: 'color'
      })

      const getPreviewConfiguration = (configuration, properties) => {
        const currentExampleNode = ensureTextContent(
          contentElement.transientState.get('exampleNode')
        );

        return currentExampleNode ? {
          ...configuration,
          value: [
            {
              ...currentExampleNode,
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
        previewConfigurationBindingModel: contentElement.transientState,
        previewConfigurationBinding: 'exampleNode',
        getPreviewConfiguration(configuration, variant) {
          return getPreviewConfiguration(configuration, {variant})
        }
      });
      this.group('ContentElementTypographySize', {
        entry,
        model: modelDelegator,
        prefix: exampleNode ? utils.camelize(exampleNode.type) : 'none',
        previewConfigurationBindingModel: contentElement.transientState,
        previewConfigurationBinding: 'exampleNode',
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

  split(configuration, at, {ranges}) {
    const value = getValue(configuration);
    const beforeValue = value.slice(0, at);
    const afterValue = value.slice(at);

    const beforeRanges = {};
    const afterRanges = {};

    Object.entries(ranges).forEach(([id, range]) => {
      const startPath = Math.min(range.anchor.path[0], range.focus.path[0]);
      const endPath = Math.max(range.anchor.path[0], range.focus.path[0]);

      if (endPath < at) {
        beforeRanges[id] = range;
      }
      else if (startPath >= at) {
        afterRanges[id] = shiftRange(range, -at);
      }
      else {
        const start = Point.isBefore(range.anchor, range.focus) ?
                      range.anchor : range.focus;
        beforeRanges[id] = {
          anchor: start,
          focus: endOfBlock(beforeValue, at - 1)
        };
      }
    });

    return {
      before: {
        configuration: {...configuration, value: beforeValue},
        ranges: beforeRanges
      },
      after: {
        configuration: {...configuration, value: afterValue},
        ranges: afterRanges
      }
    };
  },

  merge(configurationA, configurationB, {rangesA, rangesB}) {
    const valueA = getValue(configurationA);
    const valueB = getValue(configurationB);

    const ranges = {...rangesA};
    Object.entries(rangesB).forEach(([id, range]) => {
      ranges[id] = shiftRange(range, valueA.length);
    });

    return {
      configuration: {...configurationA, value: valueA.concat(valueB)},
      ranges
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
  },

  handleDuplicate(contentElement) {
    contentElement.postCommand({type: 'DUPLICATE'});
  },

  handleMove(contentElement, to) {
    contentElement.postCommand({
      type: 'MOVE_TO',
      payload: {to}
    });
  }
});

function getValue(configuration) {
  // Value might still be empty if text block has not been edited
  return configuration.value || [{type: 'paragraph', children: [{text: ''}]}];
}

function shiftRange(range, delta) {
  return {
    anchor: shiftPoint(range.anchor, delta),
    focus: shiftPoint(range.focus, delta)
  };
}

function shiftPoint(point, delta) {
  return {...point, path: [point.path[0] + delta, ...point.path.slice(1)]};
}

function endOfBlock(value, blockIndex) {
  const [lastNode, lastPath] = Node.last({children: value}, [blockIndex]);
  return {path: lastPath, offset: lastNode.text.length};
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
