require 'spec_helper'

module Pageflow
  describe HostedFile, perform_jobs: true do
    describe '#publish' do
      it 'transitions to uploaded_to_s3 state' do
        hosted_file = create(:hosted_file, :on_filesystem)

        hosted_file.publish!

        expect(hosted_file.reload.state).to eq('uploaded_to_s3')
      end

      it 'transitions to uploading_to_s3_failed state on result :error' do
        hosted_file = create(:hosted_file)

        allow_any_instance_of(UploadFileToS3Job).to receive(:perform_with_result).and_return(:error)

        hosted_file.publish!

        expect(hosted_file.reload.state).to eq('uploading_to_s3_failed')
      end

      it 're-schedules the job on result :pending', perform_jobs: :except_enqued_at do
        hosted_file = create(:hosted_file)

        allow_any_instance_of(UploadFileToS3Job)
          .to receive(:perform_with_result).and_return(:pending)

        hosted_file.publish!

        expect(UploadFileToS3Job).to have_been_enqueued.at(30.seconds.from_now)
      end
    end

    describe '#retry' do
      it 'transitions to uploaded_to_s3 state from failed' do
        hosted_file = create(:hosted_file, :uploading_to_s3_failed)

        hosted_file.retry!

        expect(hosted_file.reload.state).to eq('uploaded_to_s3')
      end
    end

    describe '#retryable?' do
      it 'returns true if failed' do
        hosted_file = create(:hosted_file, :uploading_to_s3_failed)

        expect(hosted_file).to be_retryable
      end

      it 'returns false if uploaded to s3' do
        hosted_file = create(:hosted_file, :uploaded_to_s3)

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
          hosted_file = ProcessedTestHostedFile.create!(attributes_for(:hosted_file,
                                                                       :on_filesystem))

          hosted_file.publish!

          expect(hosted_file.reload.state).to eq('processing')
        end
      end
    end
  end

  describe 'basename' do
    it 'returns the original file name without extention' do
      hosted_file = create(:hosted_file, attachment_on_s3_file_name: 'video.mp4')

      expect(hosted_file.basename).to eq('video')
    end
  end
end
