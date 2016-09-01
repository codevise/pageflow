module Pageflow
  class TextTrackFile < ActiveRecord::Base
    include HostedFile

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:label, :kind, :srclang)
    end
  end
end
