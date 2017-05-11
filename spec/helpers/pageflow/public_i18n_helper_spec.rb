require 'spec_helper'
require 'support/shared_contexts/fake_translations'

module Pageflow
  describe PublicI18nHelper do
    describe '#public_i18n_javascript_tag' do
      it 'includes js to set I18n.locale' do
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          published_revision_attributes: {locale: 'fr'}))

        html = helper.public_i18n_javascript_tag(entry)

        expect(html).to include('I18n.locale = "fr"')
      end

      it 'includes js to load translations' do
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          published_revision_attributes: {locale: 'de'}))

        html = helper.public_i18n_javascript_tag(entry)

        expect(html).to include('I18n.translations["de"] = {')
      end
    end

    describe '#public_i18n_translations' do
      include_context 'fake translations'

      it 'includes pageflow.public namespace for entry locale' do
        translation(:de, 'pageflow.public.some', 'text')

        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          published_revision_attributes: {locale: 'de'}))

        result = helper.public_i18n_translations(entry)

        expect(result[:pageflow][:public][:some]).to eq('text')
      end

      it 'falls back to default locale for missing keys' do
        translation(:es, 'pageflow.public.some', 'text')
        translation(I18n.default_locale, 'pageflow.public.some', 'text')
        translation(I18n.default_locale, 'pageflow.public.some_new', 'new')

        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          published_revision_attributes: {locale: 'es'}))

        result = helper.public_i18n_translations(entry)

        expect(result[:pageflow][:public][:some_new]).to eq('new')
      end
    end
  end
end
