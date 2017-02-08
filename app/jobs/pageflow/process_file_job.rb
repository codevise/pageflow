module Pageflow
  class ProcessFileJob
    @queue = :resizing

    extend StateMachineJob

    def self.perform_with_result(file, _options)
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
