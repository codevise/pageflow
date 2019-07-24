module Pageflow
  class TextTrackFile < ApplicationRecord
    include UploadableFile
    include ImageAndTextTrackProcessingStateMachine

    # used in paperclip initializer to interpolate the storage path
    # needs to be "processed_attachments" for text tracks for legacy reasons
    def attachments_path_name
      'processed_attachments'
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:label, :kind, :srclang)
    end

    # UploadableFile-overrides ->
    def attachment_styles(_attachment)
      {
        vtt: {
          format: 'vtt',
          processors: [:pageflow_vtt],
          s3_headers: {
            'Content-Type' => 'text/vtt'
          }
        }
      }
    end
  end
end
