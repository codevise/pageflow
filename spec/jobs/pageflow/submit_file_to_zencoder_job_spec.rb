require 'spec_helper'

module Pageflow
  describe SubmitFileToZencoderJob do
    it 'saves job id on file' do
      file = create(:video_file)

      allow(ZencoderApi).to receive(:instance)
        .and_return(ZencoderApiDouble.creating_job_with_id(43))

      SubmitFileToZencoderJob.new.perform_with_result(file, {})

      expect(file.reload.job_id).to eq(43)
    end
  end
end
