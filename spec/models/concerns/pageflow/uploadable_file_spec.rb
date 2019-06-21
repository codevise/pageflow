require 'spec_helper'

module Pageflow
  describe UploadableFile, perform_jobs: true do
    it 'is invalid if attachment is missing' do
      uploadable_file = build(:uploadable_file, attachment: nil)

      uploadable_file.valid?

      expect(uploadable_file).to have(1).errors_on(:attachment_on_s3)
    end

    it 'is valid if attachment is present' do
      uploadable_file = build(:uploadable_file, :uploaded)

      expect(uploadable_file).to be_valid
    end

    describe '#publish' do
      it 'transitions to uploaded state' do
        uploadable_file = create(:uploadable_file, :uploading)

        uploadable_file.publish!

        expect(uploadable_file.reload.state).to eq('uploaded')
      end
    end

    context 'with processing_state_machine' do
      class ProcessedTestUploadableFile < ActiveRecord::Base
        self.table_name = :test_uploadable_files
        include UploadableFile

        processing_state_machine do
          event :process do
            transition any => 'processing'
          end
        end
      end

      describe '#publish' do
        it 'triggers process event' do
          uploadable_file = ProcessedTestUploadableFile.create!(attributes_for(:uploadable_file,
                                                                               :uploading))
          uploadable_file.publish!

          expect(uploadable_file.reload.state).to eq('processing')
        end
      end
    end

    describe 'basename' do
      it 'returns the original file name without extention' do
        uploadable_file = create(:uploadable_file, file_name: 'video.mp4')

        expect(uploadable_file.basename).to eq('video')
      end
    end

    describe '#failed?' do
      it 'returns false if file is uploading' do
        uploadable_file = build(:uploadable_file, :uploading)

        expect(uploadable_file).not_to be_failed
      end

      it 'returns false if file is uploaded' do
        uploadable_file = build(:uploadable_file, :uploaded)

        expect(uploadable_file).not_to be_failed
      end

      it 'returns true if upload failed' do
        uploadable_file = build(:uploadable_file, :uploading_failed)

        expect(uploadable_file).to be_failed
      end
    end
  end
end
