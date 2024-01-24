require 'spec_helper'

module Pageflow
  describe HreflangLinksHelper do
    describe '#hreflang_link_tags_for_entry' do
      it 'is blank if entry does not have translations' do
        entry = create(:published_entry)

        result = hreflang_link_tags_for_entry(entry)

        expect(result).to be_blank
      end

      it 'renders hreflang hreflang links if entry has translations' do
        en_entry = create(:published_entry,
                          title: 'entry-one',
                          permalink_attributes: {
                            slug: 'custom-slug',
                            directory_path: 'en/'
                          },
                          revision_attributes: {locale: 'en'})
        de_entry = create(:published_entry,
                          title: 'entry-two',
                          permalink_attributes: {
                            slug: 'custom-slug',
                            directory_path: 'de/'
                          },
                          revision_attributes: {locale: 'de'})
        en_entry.entry.mark_as_translation_of(de_entry.entry)

        result = detect_n_plus_one_queries do
          hreflang_link_tags_for_entry(en_entry)
        end

        expect(result)
          .to have_selector('link[rel=alternate][hreflang=en][href="http://test.host/en/custom-slug"]',
                            visible: false)
        expect(result)
          .to have_selector('link[rel=alternate][hreflang=de][href="http://test.host/de/custom-slug"]',
                            visible: false)
        expect(result)
          .to have_selector('link[rel=alternate][hreflang=x-default][href="http://test.host/en/custom-slug"]',
                            visible: false)
      end
    end
  end
end
