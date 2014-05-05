module Pageflow
  class ProcessImageFileJob
    @queue = :resizing

    extend StateMachineJob

    def self.perform_with_result(image_file, options)
      image_file.processed_attachment = image_file.unprocessed_attachment
      image_file.save!

      :ok
    rescue ActiveRecord::RecordInvalid, Errno::ENAMETOOLONG
      image_file.processed_attachment = nil
      image_file.save!
      :error
    end
  end
end
