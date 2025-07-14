module Pageflow
  class ZencoderMetaDataOutputDefinition < ZencoderOutputDefinition
    attr_reader :file

    def initialize(file, options = {})
      super(options)
      @file = file
    end

    def input_s3_url
      @file.attachment_s3_url
    end

    def outputs
      [
        {
          label: 'stub',
          clip_length: 1
        }
      ]
    end
  end
end
