module Pageflow
  class ProcessFileJob < ApplicationJob
    queue_as :resizing

    include StateMachineJob

    def perform_with_result(file, _options)
      file.attachment.reprocess!

      if file.valid?
        :ok
      else
        reset_invalid_attachment(file)
        :error
      end
    rescue ActiveRecord::RecordInvalid, Errno::ENAMETOOLONG
      reset_invalid_attachment(file)

      :error
    end

    def reset_invalid_attachment(file)
      file_name = file.attachment_on_s3_file_name
      file.attachment = nil
      file.attachment_on_s3_file_name = file_name
    end
  end
end
