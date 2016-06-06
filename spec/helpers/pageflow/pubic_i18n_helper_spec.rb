require 'spec_helper'

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
  end
end
