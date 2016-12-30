require 'spec_helper'

module Pageflow
  describe TextTrackFile, inline_resque: true do
    describe '#process' do
      it 'sets state to processed' do
        text_track_file = create(:text_track_file)

        text_track_file.process!

        expect(text_track_file.reload.state).to eq('processed')
      end

      it 'creates vtt variant for vtt file' do
        text_track_file = create(:text_track_file)

        text_track_file.process!

        expect(text_track_file.reload.processed_attachment.path(:vtt)).to match(/\.vtt$/)
        expect(text_track_file.reload.processed_attachment.exists?(:vtt)).to eq(true)
      end

      it 'creates vtt variant for srt file' do
        text_track_file = create(:text_track_file, :from_srt_file)

        text_track_file.process!

        expect(text_track_file.reload.processed_attachment.path(:vtt)).to match(/\.vtt$/)
        expect(text_track_file.reload.processed_attachment.exists?(:vtt)).to eq(true)
      end
    end
  end
end
