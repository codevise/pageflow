module Pageflow
  class UsedFile < SimpleDelegator
    def initialize(file, usage = nil)
      super(file)
      @file = file
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

    def perma_id
      @usage.perma_id
    end

    # Not delegated by default. Required to allow using instances in
    # Active Record conditions.

    def is_a?(klass)
      @file.is_a?(klass)
    end

    def class
      @file.class
    end
  end
end
