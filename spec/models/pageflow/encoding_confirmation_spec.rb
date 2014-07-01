require 'spec_helper'

module Pageflow
  describe EncodingConfirmation do
    describe '#exceeding?' do
      it 'passes files to quotas #assume method' do
        entry = create(:entry)
        audio_file = create(:audio_file, :waiting_for_confirmation, used_in: entry.draft)
        video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)
        quota = TestQuota.new(entry.account, 'available')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [video_file.id],
                                             audio_file_ids: [audio_file.id]
                                           }, quota)

        expect(quota).to receive(:assume).with(files: [video_file, audio_file]).and_return(quota)

        encoding_confirmation.exceeding?
      end

      it 'returns true if assumed quota is exceeded' do
        entry = create(:entry)
        quota = TestQuota.new(entry.account, 'available')
        assumed_quota = TestQuota.new(entry.account, 'exceeded')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [],
                                             audio_file_ids: []
                                           }, quota)

        allow(quota).to receive(:assume).and_return(assumed_quota)

        expect(encoding_confirmation).to be_exceeding
      end

      it 'returns false if assumed quota is exhausted' do
        entry = create(:entry)
        quota = TestQuota.new(entry.account, 'available')
        assumed_quota = TestQuota.new(entry.account, 'exhausted')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [],
                                             audio_file_ids: []
                                           }, quota)

        allow(quota).to receive(:assume).and_return(assumed_quota)

        expect(encoding_confirmation).not_to be_exceeding
      end

      it 'returns false if assumed quota is available' do
        entry = create(:entry)
        quota = TestQuota.new(entry.account, 'available')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [],
                                             audio_file_ids: []
                                           }, quota)

        expect(encoding_confirmation).not_to be_exceeding
      end

      it 'raises RecordNotFound exceptions for files not used in entry' do
        entry = create(:entry)
        audio_file = create(:audio_file, :waiting_for_confirmation)
        quota = TestQuota.new(entry.account, 'available')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             audio_file_ids: [audio_file.id]
                                           }, quota)

        expect {
          encoding_confirmation.exceeding?
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    describe '#save!' do
      it 'passes files to quotas #assume method' do
        entry = create(:entry)
        audio_file = create(:audio_file, :waiting_for_confirmation, used_in: entry.draft)
        video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)
        quota = TestQuota.new(entry.account, 'available')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [video_file.id],
                                             audio_file_ids: [audio_file.id]
                                           }, quota)

        expect(quota).to receive(:assume).with(files: [video_file, audio_file]).and_return(quota)

        encoding_confirmation.save!
      end

      it 'confirms encoding of files' do
        entry = create(:entry)
        audio_file = create(:audio_file, :waiting_for_confirmation, used_in: entry.draft)
        video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)
        quota = TestQuota.new(entry.account, 'available')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {
                                             video_file_ids: [video_file.id],
                                             audio_file_ids: [audio_file.id]
                                           }, quota)

        encoding_confirmation.save!

        expect(video_file.reload.state).to eq('waiting_for_encoding')
        expect(audio_file.reload.state).to eq('waiting_for_encoding')
      end

      it 'raises QuotaExceededError if assumed quota is exceeded' do
        entry = create(:entry)
        quota = TestQuota.new(entry.account, 'available')
        assumed_quota = TestQuota.new(entry.account, 'exceeded')
        encoding_confirmation = EncodingConfirmation.new(DraftEntry.new(entry), {}, quota)

        allow(quota).to receive(:assume).and_return(assumed_quota)

        expect {
          encoding_confirmation.save!
        }.to raise_error(EncodingConfirmation::QuotaExceededError)
      end
    end
  end
end
