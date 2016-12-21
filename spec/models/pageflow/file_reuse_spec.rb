require 'spec_helper'

module Pageflow
  describe FileReuse do
    describe '#save!' do
      it 'adds usage for file to destination entry' do
        source_entry = DraftEntry.new(create(:entry))
        video_file = create(:video_file, used_in: source_entry.draft)
        destination_entry = DraftEntry.new(create(:entry))

        FileReuse.new(destination_entry, source_entry, BuiltInFileType.video, video_file.id).save!
        video_files = destination_entry.find_files(VideoFile)

        expect(video_files).to include(video_file)
      end

      it 'copies configuration from source usage' do
        source_entry = DraftEntry.new(create(:entry))
        file = create(:video_file,
                      used_in: source_entry.draft,
                      with_configuration: {some: 'value'})
        destination_entry = DraftEntry.new(create(:entry))

        FileReuse.new(destination_entry, source_entry, BuiltInFileType.video, file.id).save!
        used_file_in_destination_entry = destination_entry.find_file(VideoFile, file.id)

        expect(used_file_in_destination_entry.configuration).to eq('some' => 'value')
      end

      it 'creates usages for nested files' do
        source_entry = DraftEntry.new(create(:entry))
        video_file = create(:video_file,
                            used_in: source_entry.draft)
        text_track_file = create(:text_track_file,
                                 parent_file: video_file,
                                 used_in: source_entry.draft)
        destination_entry = DraftEntry.new(create(:entry))

        FileReuse.new(destination_entry, source_entry, BuiltInFileType.video, video_file.id).save!
        text_track_files_in_destination = destination_entry.find_files(TextTrackFile)

        expect(text_track_files_in_destination).to include(text_track_file)
      end

      it 'creates does not add usages for nested files of other files in source revision' do
        source_entry = DraftEntry.new(create(:entry))
        video_file = create(:video_file,
                            used_in: source_entry.draft)
        other_video_file = create(:video_file,
                                  used_in: source_entry.draft)
        text_track_file = create(:text_track_file,
                                 parent_file: other_video_file,
                                 used_in: source_entry.draft)
        destination_entry = DraftEntry.new(create(:entry))

        FileReuse.new(destination_entry, source_entry, BuiltInFileType.video, video_file.id).save!
        text_track_files_in_destination = destination_entry.find_files(TextTrackFile)

        expect(text_track_files_in_destination).not_to include(text_track_file)
      end
    end
  end
end
