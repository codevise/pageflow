require 'tempfile'

module Pageflow
  # Import the list of file(s),
  # It includes fetching of the file data from its source
  # and uploading the file to s3
  class FileImportJob < ApplicationJob
    queue_as :file_upload

    def perform(import_model, credentials)
      file_record = find_file_record import_model
      download_options = JSON.parse import_model.download_options
      file_source = download_file_source download_options, credentials
      temp_file = save_to_tempfile(file_source)
      attachment = file_record.attachment
      attachment.assign(temp_file)
      file_record.restore_attributes
      attachment.flush_writes
      file_record.publish!
    end

    def find_file_record(import_model)
      import_model.file_type.constantize.find(import_model.file_id)
    end

    def download_file_source(download_options, credentials)
      importer = Pageflow.config.file_importers.find_by_name!(download_options['importer'])
      importer.download_file credentials, download_options
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
