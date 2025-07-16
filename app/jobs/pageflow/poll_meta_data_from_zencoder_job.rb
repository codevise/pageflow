module Pageflow
  # @api private
  class PollMetaDataFromZencoderJob < PollZencoderJob
    def perform_with_result(file, _options)
      super(file, skip_post_processing: true)
    end
  end
end
