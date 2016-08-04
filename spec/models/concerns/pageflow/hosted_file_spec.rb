require 'spec_helper'

module Pageflow
  describe HostedFile, inline_resque: true do
    class TestHostedFile < ActiveRecord::Base
      self.table_name = :test_hosted_files
      include HostedFile
    end

    describe '#publish' do
      it 'performs UploadFileToS3Job' do
        hosted_file = TestHostedFile.create!

        expect(UploadFileToS3Job).to receive(:perform_with_result).and_return(:ok)

        hosted_file.publish!
      end

      it 'transitions to uploaded_to_s3 state on result :ok' do
        hosted_file = TestHostedFile.create!

        allow(UploadFileToS3Job).to receive(:perform_with_result).and_return(:ok)

        hosted_file.publish!

        expect(hosted_file.reload.state).to eq('uploaded_to_s3')
      end

      it 'transitions to uploading_to_s3_failed state on result :error' do
        hosted_file = TestHostedFile.create!

        allow(UploadFileToS3Job).to receive(:perform_with_result).and_return(:error)

        hosted_file.publish!

        expect(hosted_file.reload.state).to eq('uploading_to_s3_failed')
      end

      it 're-schedules the job on result :pending' do
        hosted_file = TestHostedFile.create!

        allow(UploadFileToS3Job).to receive(:perform_with_result).and_return(:pending)
        expect(UploadFileToS3Job).to receive(:scheduled)

        hosted_file.publish!
      end
    end

    describe '#retry' do
      it 'performs UploadFileToS3Job if failed' do
        hosted_file = TestHostedFile.create!

        expect(UploadFileToS3Job).to receive(:perform_with_result).twice.and_return(:error)

        hosted_file.publish!
        hosted_file.reload.retry!
      end
    end

    describe '#retryable?' do
      it 'returns true if failed' do
        hosted_file = TestHostedFile.create!(state: 'uploading_to_s3_failed')

        expect(hosted_file).to be_retryable
      end

      it 'returns false if uploaded to s3' do
        hosted_file = TestHostedFile.create!(state: 'uploaded_to_s3')

        expect(hosted_file).not_to be_retryable
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
          hosted_file = ProcessedTestHostedFile.create!

          allow(UploadFileToS3Job).to receive(:perform_with_result).and_return(:ok)

          hosted_file.publish!

          expect(hosted_file.reload.state).to eq('processing')
        end
      end
    end
  end

  describe 'basename' do
    it 'returns the original file name without extention' do
      hosted_file = TestHostedFile.new(attachment_on_s3_file_name: 'video.mp4')

      expect(hosted_file.basename).to eq('video')
    end
  end
end
