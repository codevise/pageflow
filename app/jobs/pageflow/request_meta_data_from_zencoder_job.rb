module Pageflow
  # @api private
  class RequestMetaDataFromZencoderJob < ApplicationJob
    queue_as :default

    include StateMachineJob

    def perform_with_result(file, _options, api = ZencoderApi.instance)
      file.job_id = api.create_job(ZencoderMetaDataOutputDefinition.new(file))
      file.save!

      :ok
    end
  end
end
