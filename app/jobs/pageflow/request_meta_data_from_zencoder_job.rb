module Pageflow
  class RequestMetaDataFromZencoderJob
    @queue = :default

    extend StateMachineJob

    def self.perform_with_result(file, options, api = ZencoderApi.instance)
      file.job_id = api.create_job(ZencoderMetaDataOutputDefinition.new(file))
      file.save!

      :ok
    end
  end
end
