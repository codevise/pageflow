module Pageflow
  class UsedFile < SimpleDelegator # rubocop:todo Style/Documentation
    def initialize(file, usage = nil)
      super(file)
      @file = file
      @usage = usage || file.usages.first
    end

    def configuration
      @usage.configuration
    end

    USAGE_ATTRIBUTES = [:configuration, :display_name, :folder_perma_id].freeze

    def update!(attributes)
      super(attributes.except(*USAGE_ATTRIBUTES))
      @usage.update!(attributes.slice(*USAGE_ATTRIBUTES))
    end

    def usage_id
      @usage.id
    end

    def perma_id
      @usage.perma_id
    end

    def display_name
      @usage.display_name
    end

    def folder_perma_id
      @usage.folder_perma_id
    end

    def cache_key
      [@file.cache_key, @usage.cache_key].join('-')
    end

    def cache_key_with_version
      [@file.cache_key_with_version, @usage.cache_key_with_version].join('-')
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
