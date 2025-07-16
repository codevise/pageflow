require 'rspec/mocks'

module ZencoderApiDouble
  extend self

  def creating_job_with_id(id)
    api = double

    allow(api).to receive(:create_job).and_return(id)

    api
  end

  def finished(file_details: {})
    api = double

    allow(api).to receive(:create_job).and_return(1)
    allow(api).to receive(:get_info).and_return(finished_info_result)
    allow(api).to receive(:get_details).and_return(details(**file_details))

    api
  end

  def finished_but_failed
    api = double

    allow(api).to receive(:create_job).and_return(1)
    allow(api).to receive(:get_info).and_return(failed_info_result)
    allow(api).to receive(:get_details).and_return(details)

    api
  end

  def once_pending_then_finished
    api = double

    allow(api).to receive(:create_job).and_return(1)
    allow(api).to receive(:get_info).and_return(pending_info_result, finished_info_result)
    allow(api).to receive(:get_details).and_return(details)

    api
  end

  def pending(options = {})
    api = double

    allow(api).to receive(:create_job).and_return(1)
    allow(api).to receive(:get_info).and_return(pending_info_result(options))
    allow(api).to receive(:get_details).and_return(details)

    api
  end

  def recoverably_failing
    api = double

    allow(api).to receive(:get_info).and_raise(Pageflow::ZencoderApi::RecoverableError)

    api
  end

  def unrecoverably_failing
    api = double

    allow(api).to receive(:get_info).and_raise(Pageflow::ZencoderApi::UnrecoverableError)

    api
  end

  private

  def double
    RSpec::Mocks::Double.new('zencoder api')
  end

  def pending_info_result(options = {})
    {state: 'encoding',
     progress: options.fetch(:progress, 20),
     finished: false}
  end

  def finished_info_result
    {state: 'finished',
     progress: 100,
     finished: true}
  end

  def failed_info_result
    {state: 'failed',
     finished: false}
  end

  def details(duration_in_ms: 5000)
    {format: 'ogg',
     width: 200,
     height: 100,
     duration_in_ms:,
     output_presences: {avi: 'finished', gif: 'skipped'}}
  end
end

RSpec::Mocks::Syntax.enable_expect(ZencoderApiDouble)
