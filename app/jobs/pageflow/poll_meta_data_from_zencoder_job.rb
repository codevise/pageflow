module Pageflow
  class PollMetaDataFromZencoderJob < PollZencoderJob
    @queue = :resizing

    def self.perform_with_result(file, options)
      super(file, :skip_thumbnail => true)
    end
  end
end
