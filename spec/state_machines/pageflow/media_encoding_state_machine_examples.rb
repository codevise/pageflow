require 'spec_helper'

shared_examples 'media encoding state machine' do |model|
  let(:zencoder_options) do
    Pageflow.config.zencoder_options
  end

  describe '#publish event', perform_jobs: true, stub_paperclip: true do
    context 'with disabled confirm_encoding_jobs option' do
      before do
        stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
          .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
      end

      it 'creates zencoder job for file' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.publish!

        expect(Pageflow::ZencoderApi.instance).to have_received(:create_job).with(file.reload.output_definition)
      end

      it 'polls zencoder' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.once_pending_then_finished)

        file.publish!

        expect(Pageflow::ZencoderApi.instance).to have_received(:get_info).with(file.reload.job_id).twice
      end

      it 'sets state to encoded after job has finished' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.publish!

        expect(file.reload.state).to eq('encoded')
      end

      it 'invokes file_encoded hook' do
        file = create(model, :uploading)
        subscriber = double('subscriber', :call => nil)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        Pageflow.config.hooks.on(:file_encoded, subscriber)
        file.publish!

        expect(subscriber).to have_received(:call).with({file: file})
      end

      context 'when encoding fails' do
        it 'invokes file_encoding_failed hook' do
          file = create(model, :uploading)
          subscriber = double('subscriber', :call => nil)

          allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished_but_failed)

          Pageflow.config.hooks.on(:file_encoding_failed, subscriber)
          file.publish!

          expect(subscriber).to have_received(:call).with({file: file})
        end
      end
    end

    context 'with enabled confirm_encoding_jobs option' do
      before do
        Pageflow.config.confirm_encoding_jobs = true
      end

      it 'creates zencoder job for file meta data' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.publish!

        expect(Pageflow::ZencoderApi.instance).to have_received(:create_job).with(Pageflow::ZencoderMetaDataOutputDefinition.new(file.reload))
      end

      it 'polls zencoder' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.once_pending_then_finished)

        file.publish!

        expect(Pageflow::ZencoderApi.instance).to have_received(:get_info).with(file.reload.job_id).twice
      end

      it 'sets state to waiting_for_confirmation' do
        file = create(model, :uploading)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.publish!

        expect(file.reload.state).to eq('waiting_for_confirmation')
      end
    end
  end

  describe '#confirm_encoding event', perform_jobs: true, stub_paperclip: true do
    before do
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
    end

    context 'when waiting for confirmation' do
      it 'sets state to encoded after job has finished' do
        file = create(model, :waiting_for_confirmation)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        file.confirm_encoding!

        expect(file.reload.state).to eq('encoded')
      end

      it 'invokes file_encoding_confirmed hook' do
        file = create(model, :waiting_for_confirmation)
        user = create(:user)
        subscriber = double('subscriber', :call => nil)

        allow(Pageflow::ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

        Pageflow.config.hooks.on(:file_encoding_confirmed, subscriber)
        file.confirm_encoding!

        expect(subscriber).to have_received(:call).with({file: file})
      end
    end
  end

  describe '#retry_encoding event', perform_jobs: true, stub_paperclip: true do
    before do
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
    end

    context 'when encoding failed' do
      context 'with disabled confirm_encoding_jobs option' do
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

          file.retry!

          expect(file.reload.state).to eq('encoded')
        end
      end

      context 'with enabled confirm_encoding_jobs option' do
        before do
          Pageflow.config.confirm_encoding_jobs = true
        end

        it 'sets state to waiting_for_confirmation' do
          file = create(model, :encoding_failed)

          file.retry!

          expect(file.reload.state).to eq('waiting_for_confirmation')
        end
      end
    end

    describe '#retryable?' do
      it 'returns true if failed' do
        file = create(model, :encoding_failed)

        expect(file).to be_retryable
      end

      it 'returns false if encoded' do
        file = create(model, :encoded)

        expect(file).not_to be_retryable
      end
    end

    describe '#failed?' do
      it 'returns false if file is uploading' do
        file = build(model, :uploading)

        expect(file).not_to be_failed
      end

      it 'returns false if file is encoded' do
        file = build(model, :encoded)

        expect(file).not_to be_failed
      end

      it 'returns true if upload failed' do
        file = build(model, :uploading_failed)

        expect(file).to be_failed
      end

      it 'returns true if fetching metadata failed' do
        file = build(model, :fetching_meta_data_failed)

        expect(file).to be_failed
      end

      it 'returns true if encoding failed' do
        file = build(model, :encoding_failed)

        expect(file).to be_failed
      end
    end
  end
end
