require 'spec_helper'

shared_examples 'encoded file state machine' do |model|
  let(:zencoder_options) do
    Pageflow.config.zencoder_options
  end

  describe '#publish event', :inline_resque => true do
    before do
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
    end

    it 'creates zencoder job for file' do
      file = create(model, :on_filesystem)

      allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

      file.publish

      expect(Pageflow::ZencoderApi.instance).to have_received(:create_job).with(file.reload.output_definition)
    end

    it 'polls zencoder' do
      file = create(model, :on_filesystem)

      allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.once_pending_then_finished)

      file.publish

      expect(Pageflow::ZencoderApi.instance).to have_received(:get_info).with(file.reload.job_id).twice
    end

    it 'sets state to encoded after job has finished' do
      file = create(model, :on_filesystem)

      allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

      file.publish

      expect(file.reload.state).to eq('encoded')
    end
  end

  describe '#retry event', :inline_resque => true do
    before do
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
    end

    context 'when upload to s3 failed' do
      it 'sets state to encoded after job has finished' do
        file = create(model, :upload_to_s3_failed)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.retry

        expect(file.reload.state).to eq('encoded')
      end
    end

    context 'when encoding failed' do
      it 'creates zencoder job for file' do
        file = create(model, :encoding_failed)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.retry!

        expect(Pageflow::ZencoderApi.instance).to have_received(:create_job).with(file.reload.output_definition)
      end

      it 'polls zencoder' do
        file = create(model, :encoding_failed)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.once_pending_then_finished)

        file.retry!

        expect(Pageflow::ZencoderApi.instance).to have_received(:get_info).with(file.reload.job_id).twice
      end

      it 'sets state to encoded after job has finished' do
        file = create(model, :encoding_failed)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.retry

        expect(file.reload.state).to eq('encoded')
      end
    end
  end
end
