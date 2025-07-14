module Pageflow
  class ZencoderAudioOutputDefinition < ZencoderOutputDefinition
    attr_reader :audio_file

    def initialize(audio_file, options = {})
      super(options)
      @audio_file = audio_file
    end

    def input_s3_url
      @audio_file.attachment_s3_url
    end

    def outputs
      [
        transferable(m4a_definition),
        transferable(mp3_definition),
        transferable(ogg_definition)
      ].flatten
    end

    private

    def m4a_definition
      {
        label: 'm4a',
        format: 'm4a',
        path: audio_file.m4a.path,
        public: 1,
        headers: {
          'Content-Type' => 'audio/mp4'
        }
      }
    end

    def mp3_definition
      {
        label: 'mp3',
        format: 'mp3',
        path: audio_file.mp3.path,
        public: 1
      }
    end

    def ogg_definition
      {
        label: 'ogg',
        format: 'ogg',
        path: audio_file.ogg.path,
        public: 1
      }
    end
  end
end
