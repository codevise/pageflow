require 'tempfile'

module Pageflow
  # Import the list of file(s),
  # It includes fetching of the file data from its source
  # and uploading the file to s3
  class FileImportJob < ApplicationJob
    queue_as :slow

    def perform(import_model_id, credentials)
      import_model = FileImport.find(import_model_id)
      file_record = import_model.file
      download_options = JSON.parse import_model.download_options
      file_source = import_model.file_importer.download_file credentials, download_options
      temp_file = save_to_tempfile(file_source)
      upload_attachment file_record, temp_file
      file_record.publish!
    ensure
      temp_file.delete
    end

    def upload_attachment(file_record, temp_file)
      attachment = file_record.attachment
      attachment.assign(temp_file)
      file_record.restore_attributes
      attachment.flush_writes
    end

    def save_to_tempfile(data)
      file = Tempfile.new('foo')
      file.binmode
      file.write(data)
      file.flush
      file
    end
  end
end
