require 'spec_helper'

module Pageflow
  describe HostedFile, perform_jobs: true do
    it 'is invalid if attachment is missing' do
      hosted_file = build(:hosted_file, attachment: nil)

      hosted_file.valid?

      expect(hosted_file).to have(1).errors_on(:attachment)
    end

    it 'is valid if attachment is present' do
      hosted_file = build(:hosted_file, :uploaded)

      expect(hosted_file).to be_valid
    end

    describe '#publish' do
      it 'transitions to uploaded state' do
        hosted_file = create(:hosted_file, :uploading)

        hosted_file.publish!

        expect(hosted_file.reload.state).to eq('uploaded')
      end
    end

    context 'with processing_state_machine' do
      class ProcessedTestHostedFile < ActiveRecord::Base
        self.table_name = :test_hosted_files
        include HostedFile

        processing_state_machine do
          event :process do
            transition any => 'processing'
          end
        end
      end

      describe '#publish' do
        it 'triggers process event' do
          hosted_file = ProcessedTestHostedFile.create!(attributes_for(:hosted_file, :uploading))

          hosted_file.publish!

          expect(hosted_file.reload.state).to eq('processing')
        end
      end
    end
  end

  describe 'basename' do
    it 'returns the original file name without extention' do
      hosted_file = create(:hosted_file, attachment_file_name: 'video.mp4')

      expect(hosted_file.basename).to eq('video')
    end
  end
end
