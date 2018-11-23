require 'spec_helper'

module Pageflow
  describe ProcessedFileStateMachine, perform_jobs: true do
    describe '#process event' do
      let(:broken_file) { File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg')) }
      context 'for unprocessed file' do
        it 'processes attachment' do
          file = create(:image_file, :uploaded)

          file.process

          expect(file.reload.attachment.exists?(:thumbnail)).to be true
        end

        it 'sets state to processed' do
          file = create(:image_file, :uploaded)

          file.process

          expect(file.reload.state).to eq('processed')
        end

        it 'sets state to error if attachment cannot be processed' do
          file = create(:image_file, :uploaded, attachment: broken_file)

          file.process

          expect(file.reload.state).to eq('processing_failed')
        end
      end

      context 'for failed file' do
        it 'processes attachment image file' do
          file = create(:image_file, :processing_failed)

          file.process

          expect(file.reload.attachment.exists?(:thumbnail)).to be true
        end

        it 'sets state to processed' do
          file = create(:image_file, :processing_failed)

          file.process

          expect(file.reload.state).to eq('processed')
        end

        it 'sets state to error if attachment cannot be processed' do
          file = create(:image_file, :processing_failed, attachment: broken_file)

          file.process

          expect(file.reload.state).to eq('processing_failed')
        end
      end
    end

    describe '#retryable?' do
      it 'returns true if failed' do
        file = create(:image_file, :processing_failed)

        expect(file).to be_retryable
      end

      it 'returns false if processed' do
        file = create(:image_file)

        expect(file).not_to be_retryable
      end
    end
  end
end
