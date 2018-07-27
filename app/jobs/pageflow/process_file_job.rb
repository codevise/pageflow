module Pageflow
  class ProcessFileJob < ApplicationJob
    queue_as :resizing

    include StateMachineJob

    def perform_with_result(file, _options)
      file.processed_attachment = file.unprocessed_attachment
      file.save!

      :ok
    rescue ActiveRecord::RecordInvalid, Errno::ENAMETOOLONG
      file.processed_attachment = nil
      file.save!
      :error
    end
  end
end
