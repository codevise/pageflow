require 'spec_helper'

module Pageflow
  describe EntryJsonSeedHelper do
    include UsedFileTestHelper

    describe '#entry_json_seed' do
      it 'escapes illegal characters' do
        revision = create(:revision, :published)
        storyline = create(:storyline, revision: revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, chapter: chapter, configuration: {text: "some\u2028text"})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_json_seed(entry)

        expect(result).to include('some\\u2028text')
      end

      it 'escapes closing tags' do
        revision = create(:revision, :published)
        storyline = create(:storyline, revision: revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, chapter: chapter, configuration: {text: '</script>'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_json_seed(entry)

        # Changed in jbuilder 2.9
        expect(result).to include('<\/script>').or include('\\u003c/script\\u003e')
      end

      it 'contains entry slug' do
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          title: 'My Entry'))

        result = helper.entry_json_seed(entry)

        expect(json_get(result, path: %w(entry slug))).to eq('my-entry')
      end

      it 'contains entry title' do
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          title: 'My Entry'))

        result = helper.entry_json_seed(entry)

        expect(json_get(result, path: %w(entry title))).to eq('My Entry')
      end

      it 'renders files' do
        entry = PublishedEntry.new(create(:entry, :published))
        video_file = create(:video_file, used_in: entry.revision)

        result = helper.entry_json_seed(entry)

        expect(json_get(result, path: %w[files video_files * id])).to eq([video_file.id])
      end
    end

    describe '#entry_theme_seed' do
      it 'includes page_change_by_scrolling theme option' do
        pageflow_configure do |config|
          config.themes.register(:custom, no_page_change_by_scrolling: true)
        end
        entry = PublishedEntry.new(create(:entry, :published,
                                          published_revision_attributes: {
                                            theme_name: 'custom'
                                          }))

        result = helper.entry_theme_seed(entry)

        expect(result[:page_change_by_scrolling]).to eq(false)
      end
    end

    describe '#entry_storylines_seed' do
      it 'includes id and configuration' do
        revision = create(:revision, :published)
        storyline = create(:storyline, revision: revision, configuration: {text: 'some text'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_storylines_seed(entry)

        expect(result[0]['id']).to eq(storyline.id)
        expect(result[0]['configuration']['text']).to eq('some text')
      end
    end

    describe '#entry_chapters_seed' do
      it 'includes id and configuration' do
        revision = create(:revision, :published)
        storyline = create(:storyline, revision: revision)
        chapter = create(:chapter,
                         storyline: storyline,
                         title: 'Chapter 1',
                         configuration: {text: 'some text'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_chapters_seed(entry)

        expect(result[0]['id']).to eq(chapter.id)
        expect(result[0]['storyline_id']).to eq(storyline.id)
        expect(result[0]['title']).to eq(chapter.title)
        expect(result[0]['configuration']['text']).to eq('some text')
      end
    end

    describe '#entry_pages_seed' do
      it 'includes id, perma_id and configuration' do
        revision = create(:revision, :published)
        storyline = create(:storyline, revision: revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: {text: 'some text'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_pages_seed(entry)

        expect(result[0]['id']).to eq(page.id)
        expect(result[0]['perma_id']).to eq(page.perma_id)
        expect(result[0]['configuration']['text']).to eq('some text')
      end
    end

    describe '#entry_widgets_seed' do
      it 'includes type_name, role and configuration' do
        revision = create(:revision, :published)
        widget_type = TestWidgetType.new(name: 'fancy_bar', roles: 'navigation')
        create(:widget,
               subject: revision,
               type_name: 'fancy_bar',
               role: 'navigation',
               configuration: {some: 'setting'})
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        result = helper.entry_widgets_seed(entry)

        expect(result[0]['type_name']).to eq('fancy_bar')
        expect(result[0]['role']).to eq('navigation')
        expect(result[0]['configuration']['some']).to eq('setting')
      end
    end

    describe '#entry_file_ids_seed' do
      it 'indexes list of ids by collection name' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry)

        result = helper.entry_file_ids_seed(entry)

        expect(result['image_files']).to eq([image_file.perma_id])
      end
    end

    describe '#entry_audio_files_json_seed' do
      before { helper.extend(AudioFilesHelper) }

      it 'indexes sources of entries audio files by id' do
        entry = PublishedEntry.new(create(:entry, :published))
        audio_file = create_used_file(:audio_file, entry: entry)

        result = JSON.parse(helper.entry_audio_files_json_seed(entry))

        expect(result[audio_file.perma_id.to_s].first['type']).to be_present
        expect(result[audio_file.perma_id.to_s].first['src']).to be_present
      end
    end
  end
end
