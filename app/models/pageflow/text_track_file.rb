module Pageflow
  class TextTrackFile < ApplicationRecord
    include HostedFile
    include ProcessedFileStateMachine

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

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:label, :kind, :srclang)
    end
  end
end
