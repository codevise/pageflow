require 'spec_helper'

module Pageflow
  describe DraftEntry do
    describe '#translations' do
      it 'returns published entries for translations of entry' do
        entry = create(:entry)
        translation = create(:entry)
        entry.mark_as_translation_of(translation)
        draft_entry = DraftEntry.new(entry)

        result = draft_entry.translations

        expect(result.length).to eq(2)
        expect(result[0]).to be_kind_of(PublishedEntry)
        expect(result[0].title).to eq(entry.title)
        expect(result[1]).to be_kind_of(PublishedEntry)
        expect(result[1].title).to eq(translation.title)
      end

      it 'allows modifying the entries scope' do
        entry = create(:entry)
        translation = create(:entry, permalink_attributes: {slug: 'some-slug'})
        entry.mark_as_translation_of(translation)
        draft_entry = DraftEntry.new(entry)

        result = draft_entry.translations(-> { preload(:permalink) })

        expect(result[0].entry.association(:permalink).loaded?).to eq(true)
      end

      it 'ignores include_noindex argument' do
        entry = create(:entry)
        translation = create(:entry)
        entry.mark_as_translation_of(translation)
        draft_entry = DraftEntry.new(entry)

        result = draft_entry.translations(include_noindex: true)

        expect(result.length).to eq(2)
        expect(result[0].title).to eq(entry.title)
        expect(result[1].title).to eq(translation.title)
      end
    end

    describe '#find_files' do
      it 'returns files of given type' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        result = draft_entry.find_files(Pageflow::ImageFile)

        expect(result).to eq([image_file])
      end
    end

    describe '#create_file!' do
      it 'prevents perma_id clashes when called concurrently', multithread: true do
        entry = DraftEntry.new(create(:entry))

        perma_ids = Array.new(3) {
          Thread.new do
            entry.create_file!(BuiltInFileType.image, attachment: fixture_file)
          end
        }.map(&:join).map(&:value).map(&:perma_id)

        expect(perma_ids.uniq).to have(3).items
      end

      it 'creates image_file on draft' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)

        draft_entry.create_file!(BuiltInFileType.image, attachment: fixture_file)

        expect(entry.draft.reload).to have(1).image_file
      end

      it 'sets usage_id on created image_file' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)

        image_file = draft_entry.create_file!(BuiltInFileType.image, attachment: fixture_file)

        expect(image_file.usage_id).to be_present
      end

      it 'raises exception if record is invalid' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)

        expect {
          draft_entry.create_file!(BuiltInFileType.image, {})
        }.to raise_error(ActiveRecord::RecordInvalid)
      end

      it 'raises exception if foreign key custom attribute references file not ' \
         'used in revision' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                custom_attributes: {
                                  related_image_file_id: {
                                    model: 'Pageflow::ImageFile'
                                  }
                                })
        end
        test_file_type = Pageflow.config.file_types.find_by_model!(TestUploadableFile)

        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)
        image_file = create(:image_file)

        expect {
          draft_entry.create_file!(test_file_type,
                                   attachment: fixture_file,
                                   related_image_file_id: image_file.id)
        }.to raise_error(DraftEntry::InvalidForeignKeyCustomAttributeError)
      end

      it 'does not raise exception if foreign key custom attribute references file ' \
         'used in revision' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                custom_attributes: {
                                  related_image_file_id: {
                                    model: 'Pageflow::ImageFile'
                                  }
                                })
        end
        test_file_type = Pageflow.config.file_types.find_by_model!(TestUploadableFile)

        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)
        image_file = create(:image_file, used_in: entry.draft)

        expect {
          draft_entry.create_file!(test_file_type,
                                   attachment: fixture_file,
                                   related_image_file_id: image_file.id)
        }.not_to raise_error
      end

      def fixture_file
        File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))
      end
    end

    describe '#use_file' do
      it 'creates usage for given file' do
        entry = DraftEntry.new(create(:entry))
        other_entry = DraftEntry.new(create(:entry))
        video_file = create(:video_file, used_in: other_entry.draft)

        used_file = other_entry.find_file(VideoFile, video_file.id)
        entry.use_file(used_file)
        video_files = entry.find_files(VideoFile)

        expect(video_files).to include(video_file)
      end

      it 'copies configuration from source usage' do
        entry = DraftEntry.new(create(:entry))
        other_entry = DraftEntry.new(create(:entry))
        file = create(:video_file,
                      used_in: other_entry.draft,
                      with_configuration: {some: 'value'})

        used_file = other_entry.find_file(VideoFile, file.id)
        entry.use_file(used_file)
        new_used_file = entry.find_file(VideoFile, file.id)

        expect(new_used_file.configuration).to eq('some' => 'value')
      end
    end

    describe '#remove_file' do
      it 'removes file from files used by draft' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        draft_entry.remove_file(image_file)

        expect(entry.draft).to have(0).image_files
      end

      it 'removes file if no usages are left' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        expect {
          draft_entry.remove_file(image_file)
        }.to change { ImageFile.count }.by(-1)
      end

      it 'does not remove file from other revisions ' do
        entry = create(:entry)
        other_revision = create(:revision, :published, entry:)
        image_file = create(:image_file)
        other_revision.image_files << image_file
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        draft_entry.remove_file(image_file)

        expect(other_revision).to have(1).image_file
      end

      it 'removes usages of nested files in draft' do
        entry = create(:entry)
        video_file = create(:video_file, used_in: entry.draft)
        create(:text_track_file, used_in: entry.draft, parent_file: video_file)
        draft_entry = DraftEntry.new(entry)

        draft_entry.remove_file(video_file)

        expect(draft_entry.find_files(TextTrackFile)).to be_empty
      end
    end

    describe '.accessible_by' do
      it 'delegates to Entry.accessible_by' do
        ability = double('Ability')
        action = :read

        allow(Entry).to receive(:accessible_by).and_return([])

        DraftEntry.accessible_by(ability, action)

        expect(Entry).to have_received(:accessible_by).with(ability, action)
      end

      it 'decorates entries with DraftEntry' do
        draft = build_stubbed(:revision)
        entry = build_stubbed(:entry, draft:)

        allow(Entry).to receive(:accessible_by).and_return([entry])

        result = DraftEntry.accessible_by(double('Ability'), :read)

        expect(result.first).to be_a(DraftEntry)
        expect(result.first.entry).to be(entry)
        expect(result.first.draft).to be(draft)
      end
    end
  end
end
