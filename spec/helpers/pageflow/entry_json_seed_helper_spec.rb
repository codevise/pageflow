require 'spec_helper'

module Pageflow
  describe EntryJsonSeedHelper do
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

      it 'renders ids of files' do
        entry = PublishedEntry.new(create(:entry, :published))
        video_file = create(:video_file, used_in: entry.revision)

        result = helper.entry_json_seed(entry)

        expect(json_get(result, path: %w(files video_files * id))).to eq([video_file.id])
      end

      it 'renders configurations of files' do
        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision, with_configuration: {some: 'value'})

        result = helper.entry_json_seed(entry)
        value = json_get(result, path: ['files', 'video_files', 0, 'configuration', 'some'])

        expect(value).to eq('value')
      end

      it 'renders parent file info of files' do
        entry = create(:entry, :published)
        published_entry = PublishedEntry.new(entry)
        video_file = create(:video_file, used_in: entry.published_revision)
        create(:text_track_file, used_in: entry.published_revision, parent_file: video_file)

        result = helper.entry_json_seed(published_entry)
        id = json_get(result, path: ['files', 'text_track_files', 0, 'parent_file_id'])
        type = json_get(result, path: ['files', 'text_track_files', 0, 'parent_file_model_type'])

        expect(id).to eq(video_file.id)
        expect(type).to eq(video_file.class.name)
      end

      it 'renders basenames of files' do
        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision, attachment_on_s3_file_name: 'some-video.mp4')

        result = helper.entry_json_seed(entry)
        value = json_get(result, path: ['files', 'video_files', 0, 'basename'])

        expect(value).to eq('some-video')
      end

      it 'renders file type partial, for example variant property for video file' do
        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision, output_presences: {fullhd: true})

        result = helper.entry_json_seed(entry)
        variants = json_get(result, path: ['files', 'video_files', 0, 'variants'])

        expect(variants).to include('fullhd')
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

    describe '#entry_file_ids_seed' do
      it 'indexes list of ids by collection name' do
        revision = create(:revision, :published)
        image_file = create(:image_file, used_in: revision)
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = helper.entry_file_ids_seed(entry)

        expect(result['image_files']).to eq([image_file.id])
      end
    end

    describe '#entry_audio_files_json_seed' do
      before { helper.extend(AudioFilesHelper) }

      it 'indexes sources of entries audio files by id' do
        revision = create(:revision, :published)
        audio_file = create(:audio_file, used_in: revision)
        entry = PublishedEntry.new(create(:entry, published_revision: revision))

        result = JSON.parse(helper.entry_audio_files_json_seed(entry))

        expect(result[audio_file.id.to_s].first['type']).to be_present
        expect(result[audio_file.id.to_s].first['src']).to be_present
      end
    end
  end
end
