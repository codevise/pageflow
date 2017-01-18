module Pageflow
  class TextTrackFile < ActiveRecord::Base
    include HostedFile

    processing_state_machine do
      state 'processing'
      state 'processed'
      state 'processing_failed'

      event :process do
        transition any => 'processing'
      end

      job ProcessFileJob do
        on_enter 'processing'
        result :ok, state: 'processed'
        result :error, state: 'processing_failed'
      end
    end

    has_attached_file(:processed_attachment,
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

    def ready?
      processed?
    end

    def unprocessed_attachment
      attachment_on_s3
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:label, :kind, :srclang)
    end
  end
end
