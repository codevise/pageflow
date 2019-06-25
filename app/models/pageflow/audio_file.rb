module Pageflow
  class AudioFile < ApplicationRecord
    include UploadableFile
    include MediaEncodingStateMachine

    belongs_to :confirmed_by, class_name: 'User', optional: true

    def attachment_s3_url
      "s3://#{File.join(attachment.bucket_name, attachment.path)}"
    end

    def m4a
      ZencoderAttachment.new(self, "audio.m4a")
    end

    def mp3
      ZencoderAttachment.new(self, "audio.mp3")
    end

    def ogg
      ZencoderAttachment.new(self, "audio.ogg")
    end

    def output_definition
      ZencoderAudioOutputDefinition.new(self)
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format, :duration_in_ms)
    end
  end
end
