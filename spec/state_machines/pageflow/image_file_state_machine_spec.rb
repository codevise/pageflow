require 'spec_helper'

module Pageflow
  describe ImageFileStateMachine, :inline_resque => true do
    describe '#process event' do
      context 'for unprocessed file' do
        it 'processes attachment' do
          file = create(:image_file, :unprocessed)

          file.process

          expect(file.reload.attachment.exists?(:thumbnail)).to be_true
        end

        it 'sets state to processed' do
          file = create(:image_file, :unprocessed)

          file.process

          expect(file.reload.state).to eq('processed')
        end

        it 'sets state to error if attachment cannot be processed' do
          file = create(:image_file, :unprocessed, :unprocessed_attachment => File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg')))

          file.process

          expect(file.reload.state).to eq('processing_failed')
        end
      end

      context 'for failed file' do
        it 'processes attachment image file' do
          file = create(:image_file, :failed)

          file.process

          expect(file.reload.attachment.exists?(:thumbnail)).to be_true
        end

        it 'sets state to processed' do
          file = create(:image_file, :failed)

          file.process

          expect(file.reload.state).to eq('processed')
        end

        it 'sets state to error if attachment cannot be processed' do
          file = create(:image_file, :failed, :unprocessed_attachment => File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg')))

          file.process

          expect(file.reload.state).to eq('processing_failed')
        end
      end
    end

    describe '#retryable?' do
      it 'returns true if failed' do
        file = create(:image_file, :failed)

        expect(file).to be_retryable
      end

      it 'returns false if processed' do
        file = create(:image_file)

        expect(file).not_to be_retryable
      end
    end
  end
end
