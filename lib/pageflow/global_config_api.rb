module Pageflow
  module GlobalConfigApi
    # The global configuration.
    #
    # Note that all features have been activated for this
    # configuration object.
    #
    # Use #config_for to build a configuration object with only
    # certain features enabled.
    #
    # @return [Configuration]
    def config(options = {})
      unless @config
        if options[:ignore_not_configured]
          return Configuration.new
        else
          raise('Pageflow has not been configured yet')
        end
      end
      @config
    end

    # Returns true if pageflow has already been configures.
    #
    # @return [Boolean]
    # @since 0.9
    def configured?
      !!@config
    end

    # Register a block to be invoked each time a pageflow
    # configuration is created. The block is passed the config object.
    #
    # @yieldparam [Configuration] config  Current configuration object.
    def configure(&block)
      @configure_blocks ||= []
      @configure_blocks << block
    end

    # Build configuration object for which certain features have been
    # enabled.
    #
    # @param target [#enabled_feature_names]
    # @return [Configuration]
    # @since 0.9
    def config_for(target)
      config = build_config(
        target.respond_to?(:entry_type) && target.entry_type.name
      ) do |c|
        c.enable_features(target.enabled_feature_names(c))
      end

      if target.respond_to?(:entry_type)
        config = Configuration::ConfigView.new(config, target.entry_type)
      end

      config
    end

    # Register a block which shall be called after any configuration
    # object has been built. The passed configuration already includes
    # any enabled features.
    #
    # Use this hook to finalize configuration objects i.e. registering
    # help topics for registered page types.
    #
    # @yieldparam config [Configuration]
    def after_configure(&block)
      @after_configure_blocks ||= []
      @after_configure_blocks << block
    end

    # Register a block which shall be called after the global
    # configuration has been built. All features are enabled in the
    # passed configuration. For example, this hook can be used to
    # perform actions for any page type that might be enabled at some
    # point in the application.
    #
    # @yieldparam config [Configuration]
    # @since 0.9
    def after_global_configure(&block)
      @after_global_configure_blocks ||= []
      @after_global_configure_blocks << block
    end

    # Call from the pageflow initializer to indicate that the
    # coniguration is now complete.
    def finalize!
      @finalized = true
      configure!
      @config.lint!
    end

    # @api private
    def configure!
      return unless @finalized

      @config = build_config do |config|
        config.enable_all_features
      end

      @after_global_configure_blocks ||= []
      @after_global_configure_blocks.each do |block|
        block.call(@config)
      end
    end

    private

    def build_config(target_type_name = nil)
      Configuration.new(target_type_name).tap do |config|
        @configure_blocks ||= []
        @after_configure_blocks ||= []

        @configure_blocks.each do |block|
          block.call(config)
        end

        yield(config) if block_given?

        @after_configure_blocks.each do |block|
          block.call(config)
        end
      end
    end
  end
end
