require 'spec_helper'

module Pageflow
  describe LegalInfo do
    describe '#imprint' do
      it 'returns label and url of site' do
        site = build(:site,
                     imprint_link_label: 'Impressum',
                     imprint_link_url: 'https://example.com/impressum')

        legal_info = LegalInfo.new(site, 'de')

        expect(legal_info.imprint.label).to eq('Impressum')
        expect(legal_info.imprint.url).to eq('https://example.com/impressum')
      end

      it 'returns translations for locale' do
        site = build(:site,
                     imprint_link_label: 'Impressum',
                     imprint_link_url: 'https://example.com/impressum',
                     attribute_translations: {
                       'en' => {
                         'imprint_link_label' => 'Legal notice',
                         'imprint_link_url' => 'https://example.com/en/legal-notice'
                       }
                     })

        legal_info = LegalInfo.new(site, 'en')

        expect(legal_info.imprint.label).to eq('Legal notice')
        expect(legal_info.imprint.url).to eq('https://example.com/en/legal-notice')
      end

      it 'falls back to site attributes per attribute' do
        site = build(:site,
                     imprint_link_label: 'Impressum',
                     imprint_link_url: 'https://example.com/impressum',
                     attribute_translations: {'en' => {'imprint_link_label' => 'Legal notice'}})

        legal_info = LegalInfo.new(site, 'en')

        expect(legal_info.imprint.label).to eq('Legal notice')
        expect(legal_info.imprint.url).to eq('https://example.com/impressum')
      end
    end

    describe '#copyright' do
      it 'returns label and url of site' do
        site = build(:site,
                     copyright_link_label: '&copy; Example',
                     copyright_link_url: 'https://example.com/copyright')

        legal_info = LegalInfo.new(site, 'de')

        expect(legal_info.copyright.label).to eq('&copy; Example')
        expect(legal_info.copyright.url).to eq('https://example.com/copyright')
      end

      it 'returns translations for locale' do
        site = build(:site,
                     copyright_link_label: '&copy; Example',
                     attribute_translations: {
                       'en' => {'copyright_link_label' => '&copy; Example Inc.'}
                     })

        legal_info = LegalInfo.new(site, 'en')

        expect(legal_info.copyright.label).to eq('&copy; Example Inc.')
      end
    end

    describe '#privacy_url' do
      it 'returns url of site' do
        site = build(:site, privacy_link_url: 'https://example.com/datenschutz')

        legal_info = LegalInfo.new(site, 'de')

        expect(legal_info.privacy_url).to eq('https://example.com/datenschutz')
      end

      it 'returns translation for locale' do
        site = build(:site,
                     privacy_link_url: 'https://example.com/datenschutz',
                     attribute_translations: {
                       'en' => {'privacy_link_url' => 'https://example.com/en/privacy'}
                     })

        legal_info = LegalInfo.new(site, 'en')

        expect(legal_info.privacy_url).to eq('https://example.com/en/privacy')
      end
    end
  end
end
