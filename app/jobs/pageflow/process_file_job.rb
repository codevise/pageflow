module Pageflow
  class ProcessFileJob < ApplicationJob
    queue_as :resizing

    include StateMachineJob

    def perform_with_result(file, _options)
      file.attachment.reprocess!

      if file.valid?
        :ok
      else
        raise ActiveRecord::RecordInvalid
      end
    rescue ActiveRecord::RecordInvalid, Errno::ENAMETOOLONG
      file.attachment = nil
      file.attachment_file_name = 'error'
      :error
    end
  end
end
