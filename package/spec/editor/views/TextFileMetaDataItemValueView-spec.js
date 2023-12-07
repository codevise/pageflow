import {TextFileMetaDataItemValueView} from 'pageflow/editor';

import I18n from 'i18n-js';
import * as support from '$support';

describe('TextFileMetaDataItemValueView', () => {
  describe('#getText', () => {
    support.useFakeTranslations({
      'pageflow.file_licenses.cc_by_sa_4.name': 'CC-BY-SA 4.0',
      'pageflow.editor.views.file_meta_data_item_value_view.blank': '(Blank)'
    });

    it('reads value from attribute by default', () => {
      var view = new TextFileMetaDataItemValueView({
        model: support.factories.imageFile({rights: 'Some author'}),
        name: 'rights'
      });

      view.render();

      expect(view.$el.text()).toContain('Some author');
    });

    it('supports reading value from configuration', () => {
      var view = new TextFileMetaDataItemValueView({
        model: support.factories.imageFile({configuration: {alt: 'A tree'}}),
        fromConfiguration: true,
        name: 'alt'
      });

      view.render();

      expect(view.$el.text()).toContain('A tree');
    });

    it('displays placeholder if blank', () => {
      var view = new TextFileMetaDataItemValueView({
        model: support.factories.imageFile({rights: ''}),
        name: 'rights'
      });

      view.render();

      expect(view.$el.text()).toContain('(Blank)');
    });

    it('supports formatting value', () => {
      var view = new TextFileMetaDataItemValueView({
        model: support.factories.imageFile({configuration: {license: 'cc_by_sa_4'}}),
        fromConfiguration: true,
        formatValue: value => I18n.t(`pageflow.file_licenses.${value}.name`),
        name: 'license'
      });

      view.render();

      expect(view.$el.text()).toContain('CC-BY-SA 4.0');
    });

    it('only formats non-blank value', () => {
      var view = new TextFileMetaDataItemValueView({
        model: support.factories.imageFile({configuration: {license: ''}}),
        fromConfiguration: true,
        formatValue: value => I18n.t(`pageflow.file_licenses.${value}.name`),
        name: 'license'
      });

      view.render();

      expect(view.$el.text()).toContain('(Blank)');
    });
  });
});
