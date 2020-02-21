require 'spec_helper'
require 'pageflow/shared_contexts/fake_translations'

module PageflowScrolled
  RSpec.describe I18nHelper, type: :helper do
    describe '#scrolled_i18n_translations' do
      include_context 'fake translations'

      it 'includes public scrolled translations in entry locale' do
        translation(:de, 'pageflow_scrolled.public.some', 'text')
        entry = create(:published_entry, revision_attributes: {locale: 'de'})

        result = helper.scrolled_i18n_translations(entry)

        expect(result).to include_json(de: {
                                         pageflow_scrolled: {
                                           public: {some: 'text'}
                                         }
                                       })
      end

      it 'does not include non public translations by default' do
        translation(:de, 'pageflow_scrolled.other', 'text')
        entry = create(:published_entry, revision_attributes: {locale: 'de'})

        result = helper.scrolled_i18n_translations(entry)

        expect(result).not_to include_json(de: {
                                             pageflow_scrolled: {other: 'text'}
                                           })
      end

      it 'falls back to default locale for missing keys' do
        translation(:es, 'pageflow_scrolled.public.some', 'es_text')
        translation(I18n.default_locale, 'pageflow_scrolled.public.some', 'default_text')
        translation(I18n.default_locale, 'pageflow_scrolled.public.some_new', 'new')
        entry = create(:published_entry, revision_attributes: {locale: 'es'})

        result = helper.scrolled_i18n_translations(entry)

        expect(result).to include_json(es: {
                                         pageflow_scrolled: {
                                           public: {
                                             some: 'es_text',
                                             some_new: 'new'
                                           }
                                         }
                                       })
      end

      it 'falls back to default locale for missing keys' do
        translation(:es, 'pageflow_scrolled.public.some', 'es_text')
        translation(I18n.default_locale, 'pageflow_scrolled.public.some', 'default_text')
        translation(I18n.default_locale, 'pageflow_scrolled.public.some_new', 'new')
        entry = create(:published_entry, revision_attributes: {locale: 'es'})

        result = helper.scrolled_i18n_translations(entry)

        expect(result).to include_json(es: {
                                         pageflow_scrolled: {
                                           public: {
                                             some: 'es_text',
                                             some_new: 'new'
                                           }
                                         }
                                       })
      end

      it 'ignores nils in translations' do
        translation(:es, 'pageflow_scrolled.public.some.key', nil)
        translation(I18n.default_locale, 'pageflow_scrolled.public.some.key', 'default_text')
        entry = create(:published_entry, revision_attributes: {locale: 'es'})

        result = helper.scrolled_i18n_translations(entry)

        expect(result).to include_json(es: {
                                         pageflow_scrolled: {
                                           public: {
                                             some: {
                                               key: 'default_text'
                                             }
                                           }
                                         }
                                       })
      end

      it 'supports including inline_editing translations in current locale' do
        translation(I18n.locale, 'pageflow_scrolled.inline_editing.some', 'text')
        entry = create(:published_entry, revision_attributes: {locale: 'fr'})

        result = helper.scrolled_i18n_translations(entry, include_inline_editing: true)

        expect(result).to include_json(I18n.locale => {
                                         pageflow_scrolled: {
                                           inline_editing: {some: 'text'}
                                         }
                                       })
      end

      it 'performs deep merge if entry locale matches current locale' do
        translation(I18n.locale, 'pageflow_scrolled.public.some', 'text')
        translation(I18n.locale, 'pageflow_scrolled.inline_editing.some', 'text')
        entry = create(:published_entry, revision_attributes: {locale: I18n.locale})

        result = helper.scrolled_i18n_translations(entry, include_inline_editing: true)

        expect(result).to include_json(I18n.locale => {
                                         pageflow_scrolled: {
                                           inline_editing: {some: 'text'},
                                           public: {some: 'text'}
                                         }
                                       })
      end
    end
  end
end
