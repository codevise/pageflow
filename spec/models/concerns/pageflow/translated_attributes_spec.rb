require 'spec_helper'

module Pageflow
  describe TranslatedAttributes do
    let(:model) do
      Class.new(ActiveRecord::Base) do
        self.table_name = 'pageflow_sites'

        def self.name
          'Pageflow::Site'
        end

        include TranslatedAttributes

        translated_attributes :imprint_link_label, :imprint_link_url
      end
    end

    describe '#attribute_translations' do
      it 'defaults to empty hash' do
        expect(model.new.attribute_translations).to eq({})
      end
    end

    describe '#translated' do
      let(:model_with_reader_override) do
        Class.new(model) do
          def imprint_link_label
            super.presence || 'Computed'
          end
        end
      end

      it 'returns attribute value if there are no translations' do
        record = model.new(imprint_link_label: 'Impressum')

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Impressum')
      end

      it 'returns translation for locale' do
        record = model.new(imprint_link_label: 'Impressum',
                           attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Legal notice')
      end

      it 'falls back to attribute value if locale has no translation' do
        record = model.new(imprint_link_label: 'Impressum',
                           attribute_translations: {
                             'fr' => {'imprint_link_label' => 'Mentions légales'}
                           })

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Impressum')
      end

      it 'falls back to attribute value if translation is blank' do
        record = model.new(imprint_link_label: 'Impressum',
                           attribute_translations: {'en' => {'imprint_link_label' => ''}})

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Impressum')
      end

      it 'falls back to translation for base locale of regional locale' do
        record = model.new(imprint_link_label: 'Impressum',
                           attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        expect(record.translated(:imprint_link_label, locale: 'en-GB')).to eq('Legal notice')
      end

      it 'prefers translation for regional locale over base locale' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'},
                             'en-GB' => {'imprint_link_label' => 'Legal notice (GB)'}
                           })

        expect(record.translated(:imprint_link_label, locale: 'en-GB'))
          .to eq('Legal notice (GB)')
      end

      it 'resolves attributes independently' do
        record = model.new(imprint_link_label: 'Impressum',
                           imprint_link_url: 'https://example.com/impressum',
                           attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Legal notice')
        expect(record.translated(:imprint_link_url, locale: 'en'))
          .to eq('https://example.com/impressum')
      end

      it 'accepts symbol locale' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        expect(record.translated(:imprint_link_label, locale: :en)).to eq('Legal notice')
      end

      it 'falls back to overridden attribute reader' do
        record = model_with_reader_override.new

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Computed')
      end

      it 'prefers translation over overridden attribute reader' do
        record = model_with_reader_override.new(attribute_translations: {
                                                  'en' => {
                                                    'imprint_link_label' => 'Legal notice'
                                                  }
                                                })

        expect(record.translated(:imprint_link_label, locale: 'en')).to eq('Legal notice')
      end
    end

    describe 'generated reader' do
      it 'maps locales to values of the attribute' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'},
                             'fr' => {'imprint_link_label' => 'Mentions légales'}
                           })

        expect(record.imprint_link_label_translations).to eq('en' => 'Legal notice',
                                                             'fr' => 'Mentions légales')
      end

      it 'ignores translations of other attributes' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_url' => 'https://example.com/en'}
                           })

        expect(record.imprint_link_label_translations).to eq({})
      end

      it 'defaults to empty hash' do
        expect(model.new.imprint_link_label_translations).to eq({})
      end
    end

    describe 'generated writer' do
      it 'stores translations of the attribute' do
        record = model.new

        record.imprint_link_label_translations = {'en' => 'Legal notice'}

        expect(record.attribute_translations)
          .to eq('en' => {'imprint_link_label' => 'Legal notice'})
      end

      it 'preserves translations of other attributes in same locale' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_url' => 'https://example.com/en'}
                           })

        record.imprint_link_label_translations = {'en' => 'Legal notice'}

        expect(record.attribute_translations).to eq(
          'en' => {
            'imprint_link_url' => 'https://example.com/en',
            'imprint_link_label' => 'Legal notice'
          }
        )
      end

      it 'preserves translations of other attributes in other locales' do
        record = model.new(attribute_translations: {
                             'fr' => {'imprint_link_url' => 'https://example.com/fr'}
                           })

        record.imprint_link_label_translations = {'en' => 'Legal notice'}

        expect(record.attribute_translations).to eq(
          'fr' => {'imprint_link_url' => 'https://example.com/fr'},
          'en' => {'imprint_link_label' => 'Legal notice'}
        )
      end

      it 'removes translations of the attribute that are not passed' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'},
                             'fr' => {'imprint_link_label' => 'Mentions légales'}
                           })

        record.imprint_link_label_translations = {'fr' => 'Mentions légales'}

        expect(record.attribute_translations)
          .to eq('fr' => {'imprint_link_label' => 'Mentions légales'})
      end

      it 'skips blank values' do
        record = model.new

        record.imprint_link_label_translations = {'en' => '', 'fr' => 'Mentions légales'}

        expect(record.attribute_translations)
          .to eq('fr' => {'imprint_link_label' => 'Mentions légales'})
      end

      it 'accepts symbol locales' do
        record = model.new

        record.imprint_link_label_translations = {en: 'Legal notice'}

        expect(record.attribute_translations)
          .to eq('en' => {'imprint_link_label' => 'Legal notice'})
      end

      it 'does not leave empty locales behind' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        record.imprint_link_label_translations = {}

        expect(record.attribute_translations).to eq({})
      end
    end

    describe 'validation' do
      it 'is valid for known locale and attribute' do
        record = model.new(attribute_translations: {
                             'en' => {'imprint_link_label' => 'Legal notice'}
                           })

        record.valid?
        expect(record.errors).not_to include(:attribute_translations)
      end

      it 'is invalid for unknown locale' do
        record = model.new(attribute_translations: {
                             'xx' => {'imprint_link_label' => 'Legal notice'}
                           })

        record.valid?
        expect(record.errors).to include(:attribute_translations)
      end

      it 'is invalid for attribute that is not translatable' do
        record = model.new(attribute_translations: {
                             'en' => {'cname' => 'other.example.com'}
                           })

        record.valid?
        expect(record.errors).to include(:attribute_translations)
      end
    end
  end
end
