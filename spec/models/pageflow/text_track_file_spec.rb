require 'spec_helper'

module Pageflow
  describe TextTrackFile, perform_jobs: true do
    describe '#process' do
      it 'sets state to processed' do
        text_track_file = create(:text_track_file, :uploaded)

        text_track_file.process!

        expect(text_track_file.reload.state).to eq('processed')
      end

      it 'creates vtt variant for vtt file' do
        text_track_file = create(:text_track_file, :uploaded)

        text_track_file.process!

        expect(text_track_file.reload.attachment.path(:vtt)).to match(/\.vtt$/)
        expect(text_track_file.reload.attachment.exists?(:vtt)).to eq(true)
      end

      it 'creates vtt variant for srt file' do
        text_track_file = create(:text_track_file, :uploaded, :from_srt_file)

        text_track_file.process!

        expect(text_track_file.reload.attachment.path(:vtt)).to match(/\.vtt$/)
        expect(text_track_file.reload.attachment.exists?(:vtt)).to eq(true)
      end
    end
  end
end
