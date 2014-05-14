require 'spec_helper'

module Pageflow
  describe SubmitFileToZencoderJob do
    it 'saves job id on file' do
      file = create(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.creating_job_with_id(43))

      SubmitFileToZencoderJob.perform_with_result(file, {})

      expect(file.reload.job_id).to eq(43)
    end

    it 'invokes :file_submitted hook' do
      file = create(:video_file)
      subscriber = double('subscriber', :call => nil)

      Pageflow.config.on(:file_submitted, subscriber)
      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.creating_job_with_id(43))

      SubmitFileToZencoderJob.perform_with_result(file, {})

      expect(subscriber).to have_received(:call).with({file: file})
    end
  end
end
