module Pageflow
  class TextTrackFile < ApplicationRecord
    include HostedFile
    include ProcessedFileStateMachine

    has_attached_file(:attachment_on_s3,
                      Pageflow.config.paperclip_s3_default_options
                        .merge(styles: {
                                 vtt: {
                                   format: 'vtt',
                                   processors: [:pageflow_vtt],
                                   s3_headers: {
                                     'Content-Type' => 'text/vtt'
                                   }
                                 }
                               }))

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:label, :kind, :srclang)
    end
  end
end
