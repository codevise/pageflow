RSpec.configure do |config|
  config.before(:each) do |example|
    ActiveJob::Base.queue_adapter = :test
    queue_adapter = ActiveJob::Base.queue_adapter

    queue_adapter.perform_enqueued_jobs = !!example.metadata[:perform_jobs]

    queue_adapter.perform_enqueued_at_jobs = (example.metadata[:perform_jobs] &&
                                              example.metadata[:perform_jobs] != :except_enqued_at)
  end
end
