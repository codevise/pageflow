require 'spec_helper'

module Pageflow
  describe EntryJsonSeedHelper do
    describe '#entry_json_seed' do
      it 'escapes illegal characters' do
        revision = create(:revision, :published)
        chapter = create(:chapter, revision: revision)
        create(:page, chapter: chapter, configuration: {text: "some\u2028text"})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_json_seed(entry)

        expect(result).to include('some\\u2028text')
      end
    end

    describe '#entry_theming_seed' do
      it 'includes page_change_by_scrolling theme option' do
        Pageflow.config.themes.register(:custom, no_page_change_by_scrolling: true)
        theming = create(:theming, theme_name: 'custom')
        entry = PublishedEntry.new(create(:entry, theming: theming))

        result = helper.entry_theming_seed(entry)

        expect(result[:page_change_by_scrolling]).to eq(false)
      end
    end

    describe '#entry_chapter_configurations_seed' do
      it 'indexed configurations by id' do
        revision = create(:revision, :published)
        chapter = create(:chapter, revision: revision, configuration: {text: 'some text'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_chapter_configurations_seed(entry)

        expect(result[chapter.id]['text']).to eq('some text')
      end
    end

    describe '#entry_pages_seed' do
      it 'includes id, perma_id and configuration' do
        revision = create(:revision, :published)
        chapter = create(:chapter, revision: revision)
        page = create(:page, chapter: chapter, configuration: {text: 'some text'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_pages_seed(entry)

        expect(result[0]['id']).to eq(page.id)
        expect(result[0]['perma_id']).to eq(page.perma_id)
        expect(result[0]['configuration']['text']).to eq('some text')
      end
    end

    describe '#entry_audio_files_json_seed' do
      before { helper.extend(AudioFilesHelper) }

      it 'indexes sources of entries audio files by id' do
        revision = create(:revision, :published)
        audio_file = create(:audio_file, used_in: revision)
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = JSON.parse(helper.entry_audio_files_json_seed(entry))
        result[audio_file.id]

        expect(result[audio_file.id.to_s].first['type']).to be_present
        expect(result[audio_file.id.to_s].first['src']).to be_present
      end
    end
  end
end
