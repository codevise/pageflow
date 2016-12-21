module Pageflow
  class UsedFile < SimpleDelegator
    def initialize(file, usage = nil)
      super(file)
      @usage = usage || file.usages.first
    end

    def configuration
      @usage.configuration
    end

    def update_attributes!(attributes)
      super(attributes.except(:configuration))
      @usage.update_attributes!(attributes.slice(:configuration))
    end

    def usage_id
      @usage.id
    end
  end
end
