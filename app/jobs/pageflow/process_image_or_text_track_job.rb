module Pageflow
  # @api private
  class ProcessImageOrTextTrackJob < ApplicationJob
    queue_as do
      bulk_processing?(arguments.first) ? Pageflow.config.bulk_file_processing_queue : :resizing
    end

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

    private

    def bulk_processing?(file)
      return false unless Pageflow.config.bulk_file_processing_queue && file.entry_id

      threshold = Pageflow.config.bulk_file_processing_threshold

      file.class
          .where(entry_id: file.entry_id, state: 'processing')
          .limit(threshold + 1)
          .count > threshold
    end
  end
end
