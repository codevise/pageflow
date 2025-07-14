module Pageflow
  class AudioFile < ApplicationRecord
    include UploadableFile
    include MediaEncodingStateMachine

    belongs_to :confirmed_by, class_name: 'User', optional: true

    has_attached_file(:peak_data,
                      Pageflow.config.paperclip_s3_default_options
                        .merge(styles: {
                                 original: {
                                   processors: [:pageflow_audio_waveform],
                                   format: 'json'
                                 }
                               }))

    do_not_validate_attachment_file_type :peak_data

    def attachment_s3_url
      "s3://#{File.join(attachment.bucket_name, attachment.path)}"
    end

    def m4a
      ZencoderAttachment.new(self, 'audio.m4a')
    end

    def mp3
      ZencoderAttachment.new(self, 'audio.mp3')
    end

    def ogg
      ZencoderAttachment.new(self, 'audio.ogg')
    end

    def output_definition
      ZencoderAudioOutputDefinition.new(self)
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format, :duration_in_ms)
    end

    def post_process_encoded_files
      self.peak_data = URI.parse(ogg.url(default_protocol: 'https'))
    rescue OpenURI::HTTPError
      throw(:halt, :pending)
    end
  end
end
