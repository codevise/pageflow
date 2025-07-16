module Pageflow
  # @api private
  class SubmitFileToZencoderJob < ApplicationJob
    queue_as :default

    include StateMachineJob

    def perform_with_result(file, _options, api = ZencoderApi.instance)
      file.job_id = api.create_job(file.output_definition)
      file.save!

      :ok
    end
  end
end
