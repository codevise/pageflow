module Pageflow
  # @api private
  class ProcessImageOrTextTrackJob < ApplicationJob
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
      file_name = file.file_name
      file.attachment = nil
      file.file_name = file_name
    end
  end
end
