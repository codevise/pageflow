import Backbone from 'backbone';

import {
  TypographyVariantSelectInputView
} from 'editor/views/inputs/TypographyVariantSelectInputView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {frontend} from 'frontend';

import {act} from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {
  factories,
  normalizeSeed,
  editableTextValue
} from 'support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('TypographyVariantSelectInputView', () => {
  it('renders items with previews', async () => {
    frontend.contentElementTypes.register('test', {
      component: function({configuration}) {
        return `This element uses variant ${configuration.variant}.`;
      }
    });
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1}
          ],
          contentElements: [
            {
              id: 5,
              sectionId: 1,
              typeName: 'test',
              configuration: {
                variant: 'default'
              }
            }
          ]
        })
      }
    );
    const contentElement = entry.contentElements.get(5);

    const inputView = new TypographyVariantSelectInputView({
      entry,
      contentElement,
      model: contentElement.configuration,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],

      getPreviewConfiguration(configuration, variant) {
        return {
          ...configuration,
          variant
        }
      }
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Default'}));

    expect(getByRole('option', {name: 'Default'}))
      .toHaveTextContent('This element uses variant default.');
    expect(getByRole('option', {name: 'Large'}))
      .toHaveTextContent('This element uses variant large.');
  });

  it('re-renders previews when previewConfigurationBinding attribute changes', async () => {
    frontend.contentElementTypes.register('test', {
      component: function({configuration}) {
        return configuration.value?.[0]?.children?.[0]?.text || 'No text';
      }
    });
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1}
          ],
          contentElements: [
            {
              id: 5,
              sectionId: 1,
              typeName: 'test',
              configuration: {
                variant: 'default'
              }
            }
          ]
        })
      }
    );
    const contentElement = entry.contentElements.get(5);
    const bindingModel = new Backbone.Model({exampleNode: 'first'});

    const inputView = new TypographyVariantSelectInputView({
      entry,
      contentElement,
      model: contentElement.configuration,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],
      previewConfigurationBindingModel: bindingModel,
      previewConfigurationBinding: 'exampleNode',

      getPreviewConfiguration(configuration, variant) {
        return {
          ...configuration,
          variant,
          value: editableTextValue(bindingModel.get('exampleNode'))
        }
      }
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Default'}));

    expect(getByRole('option', {name: 'Default'}))
      .toHaveTextContent('first');

    act(() => { bindingModel.set('exampleNode', 'second') });

    expect(getByRole('option', {name: 'Default'}))
      .toHaveTextContent('second');
  });
});
