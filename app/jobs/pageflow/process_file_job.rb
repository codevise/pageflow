module Pageflow
  class ProcessFileJob < ApplicationJob
    queue_as :resizing

    include StateMachineJob

    def perform_with_result(file, _options)
      file.attachment.reprocess!

      :ok
    rescue ActiveRecord::RecordInvalid, Errno::ENAMETOOLONG
      file.attachment_on_s3 = nil
      file.save!
      :error
    end
  end
end
