module ZencoderApiDouble
  extend self

  def creating_job_with_id(id)
    api = double

    api.stub(:create_job).and_return(id)

    api
  end

  def finished
    api = double

    api.stub(:create_job).and_return(1)
    api.stub(:get_info).and_return(finished_info_result)
    api.stub(:get_input_details).and_return(input_details)

    api
  end

  def finished_but_failed
    api = double

    api.stub(:create_job).and_return(1)
    api.stub(:get_info).and_return(failed_info_result)
    api.stub(:get_input_details).and_return(input_details)

    api
  end

  def once_pending_then_finished
    api = double

    api.stub(:create_job).and_return(1)
    api.stub(:get_info).and_return(pending_info_result, finished_info_result)
    api.stub(:get_input_details).and_return(input_details)

    api
  end

  def pending(options = {})
    api = double

    api.stub(:create_job).and_return(1)
    api.stub(:get_info).and_return(pending_info_result(options))
    api.stub(:get_input_details).and_return(input_details)

    api
  end

  def recoverably_failing
    api = double

    api.stub(:get_info).and_raise(Pageflow::ZencoderApi::RecoverableError)

    api
  end

  def unrecoverably_failing
    api = double

    api.stub(:get_info).and_raise(Pageflow::ZencoderApi::UnrecoverableError)

    api
  end

  private

  def double
    RSpec::Mocks::Mock.new('zencoder api')
  end

  def pending_info_result(options = {})
    { :state => 'encoding',
      :progress => options.fetch(:progress, 20),
      :finished => false }
  end

  def finished_info_result
    { :state => 'finished',
      :progress => 100,
      :finished => true }
  end

  def failed_info_result
    { :state => 'failed',
      :finished => false }
  end

  def input_details
    { :format => 'ogg',
      :width => 200,
      :height => 100,
      :duration_in_ms => 5000 }
  end
end
