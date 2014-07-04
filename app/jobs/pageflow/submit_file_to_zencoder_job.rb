module Pageflow
  class SubmitFileToZencoderJob
    @queue = :default

    extend StateMachineJob

    def self.perform_with_result(file, options, api = ZencoderApi.instance)
      file.job_id = api.create_job(file.output_definition)
      file.save!

      :ok
    end
  end
end
