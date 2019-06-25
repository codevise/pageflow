require 'spec_helper'

module Pageflow
  describe ImageAndTextTrackProcessingStateMachine, perform_jobs: true do
    describe '#process event' do
      context 'for uploaded file' do
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
          file = create(:image_file, :uploaded, file_name: 'broken.jpg')

          file.process

          expect(file.reload.state).to eq('processing_failed')
        end

        it 'saves image width and height of original attachment' do
          file = create(:image_file, :uploaded, file_name: '7x15.png')

          file.process

          expect(file.reload.width).to eq(7)
          expect(file.reload.height).to eq(15)
        end

        it 'sets width and height to nil if image cannot be identified' do
          file = create(:image_file, :uploaded, file_name: 'broken.jpg')

          file.process

          expect(file.reload.width).to be_nil
          expect(file.reload.height).to be_nil
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
          file = create(:image_file,
                        :processing_failed,
                        attachment: nil,
                        file_name: 'broken.jpg')

          FileUtils.mkdir_p(File.dirname(file.attachment.path))
          FileUtils.cp(Engine.root.join('spec', 'fixtures', 'broken.jpg'), file.attachment.path)

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
        file = create(:image_file, :processed)

        expect(file).not_to be_retryable
      end
    end

    describe '#failed?' do
      it 'returns false if file is uploading' do
        image_file = build(:image_file, :uploading)

        expect(image_file).not_to be_failed
      end

      it 'returns false if file is processed' do
        image_file = build(:image_file, :processed)

        expect(image_file).not_to be_failed
      end

      it 'returns true if upload failed' do
        image_file = build(:image_file, :uploading_failed)

        expect(image_file).to be_failed
      end

      it 'returns true if processing failed' do
        image_file = build(:image_file, :processing_failed)

        expect(image_file).to be_failed
      end
    end
  end
end
