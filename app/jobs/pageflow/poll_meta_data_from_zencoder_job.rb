module Pageflow
  class PollMetaDataFromZencoderJob < PollZencoderJob
    def perform_with_result(file, _options)
      super(file, skip_thumbnail: true)
    end
  end
end
