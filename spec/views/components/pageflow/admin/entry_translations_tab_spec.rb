require 'spec_helper'

module Pageflow
  describe Admin::EntryTranslationsTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      helper.extend(Pageflow::Admin::EntryTranslationsHelper)
    end

    it 'renders table with translations of entry' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)

      allow(helper).to receive(:authorized?).and_return(true)

      detect_n_plus_one_queries do
        render(de_entry)
      end

      expect(rendered).to have_selector('table td a', text: 'My story EN')
      expect(rendered).to have_selector('table td', text: 'English')
      expect(rendered).to have_selector('table td a', text: 'Remove')
      expect(rendered).to have_selector('a', text: 'Link translation')
      expect(rendered).to have_selector('a', text: 'Mark as default')
    end

    it 'renders a link to entry translator url' do
      pageflow_configure do |config|
        config.entry_translator_url = lambda do |entry|
          "http://example.com?entry_id=#{entry.id}"
        end
      end

      de_entry = create(:entry, draft_attributes: {locale: 'de'})

      allow(helper).to receive(:authorized?).and_return(true)

      render(de_entry)

      expect(rendered).to have_selector('a', text: 'Generate translation')
      expect(rendered).to have_selector("a[href='http://example.com?entry_id=#{de_entry.id}']")
    end

    it 'includes self in table without link' do
      de_entry = create(:entry, title: 'My story DE', draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)

      allow(helper).to receive(:authorized?).and_return(true)

      render(de_entry)

      expect(rendered).to have_selector('table td', text: 'My story DE')
      expect(rendered).not_to have_selector('table td a', text: 'My story DE')
    end

    it 'hides mark as default for default translation' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)
      en_entry.mark_as_default_translation

      allow(helper).to receive(:authorized?).and_return(true)

      render(de_entry)

      expect(rendered).to have_selector('a', text: 'Mark as default').once
    end

    it 'renders table with translations of entry' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)

      allow(helper).to receive(:authorized?).and_return(true)

      render(de_entry)

      expect(rendered).to have_selector('table td a', text: 'My story EN')
      expect(rendered).to have_selector('table td', text: 'English')
      expect(rendered).to have_selector('table td a', text: 'Remove')
      expect(rendered).to have_selector('a', text: 'Link translation')
      expect(rendered).to have_selector('a', text: 'Mark as default')
    end

    it 'hides generate link by default' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})

      allow(helper).to receive(:authorized?).and_return(true)

      render(de_entry)

      expect(rendered).not_to have_selector('a', text: 'Generate translation')
    end

    it 'hides generate link if user cannot manage translations' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})

      allow(helper).to receive(:authorized?).and_return(true)
      allow(helper)
        .to receive(:authorized?).with(:manage_translations, de_entry).and_return(false)

      render(de_entry)

      expect(rendered).not_to have_selector('a', text: 'Generate translation')
    end

    it 'hides remove and add links if user cannot manage translations' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)

      allow(helper).to receive(:authorized?).and_return(true)
      allow(helper)
        .to receive(:authorized?).with(:manage_translations, de_entry).and_return(false)

      render(de_entry)

      expect(rendered).not_to have_selector('table td a', text: 'Remove')
      expect(rendered).not_to have_selector('table td a', text: 'Mark as default')
      expect(rendered).not_to have_selector('a', text: 'Link translation')
    end

    it 'does not link to entry the user cannot read' do
      de_entry = create(:entry, draft_attributes: {locale: 'de'})
      en_entry = create(:entry, title: 'My story EN', draft_attributes: {locale: 'en'})
      de_entry.mark_as_translation_of(en_entry)

      allow(helper).to receive(:authorized?).and_return(true)
      allow(helper)
        .to receive(:authorized?).with(:read, en_entry).and_return(false)

      render(de_entry)

      expect(rendered).to have_selector('table td', text: 'My story EN')
      expect(rendered).not_to have_selector('table td a', text: 'My story EN')
    end
  end
end
