require 'spec_helper'

module Pageflow
  describe PollMetaDataFromZencoderJob do
    let(:zencoder_options) do
      Pageflow.config.zencoder_options
    end

    it 'passes job id of file to zencoder api' do
      video_file = build(:video_file, job_id: 43)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.pending)

      PollMetaDataFromZencoderJob.new.perform_with_result(video_file, {})

      expect(ZencoderApi.instance).to have_received(:get_info).with(43)
    end

    it 'assigns meta data' do
      video_file = build(:video_file, job_id: 43)
      zencoder_api = ZencoderApiDouble.finished
      meta_data = {}

      allow(ZencoderApi).to receive(:instance).and_return(zencoder_api)
      allow(zencoder_api).to receive(:get_details).and_return(meta_data)
      allow(video_file).to receive(:meta_data_attributes=)

      PollMetaDataFromZencoderJob.new.perform_with_result(video_file, {})

      expect(video_file).to have_received(:meta_data_attributes=).with(meta_data)
    end
  end
end
