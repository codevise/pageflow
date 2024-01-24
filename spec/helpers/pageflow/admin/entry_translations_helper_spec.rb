require 'spec_helper'

module Pageflow
  module Admin
    describe EntryTranslationsHelper do
      describe '#entry_translation_display_locale' do
        it 'renders locale for unplublished entry' do
          entry = create(:entry, draft_attributes: {locale: 'de'})

          result = helper.entry_translation_display_locale(entry)

          expect(result).to eq('Deutsch')
        end

        it 'prefers locale of published revision' do
          entry = create(:entry,
                         :published,
                         draft_attributes: {locale: 'de'},
                         published_revision_attributes: {locale: 'en'})

          result = helper.entry_translation_display_locale(entry)

          expect(result).to eq('English')
        end

        it 'marks default translation' do
          entry = create(:entry,
                         :published,
                         draft_attributes: {locale: 'de'},
                         published_revision_attributes: {locale: 'en'})
          translation = create(:entry)
          entry.mark_as_translation_of(translation)
          entry.mark_as_default_translation

          result = helper.entry_translation_display_locale(entry)

          expect(result).to eq('English (Standard)')
        end
      end
    end
  end
end
