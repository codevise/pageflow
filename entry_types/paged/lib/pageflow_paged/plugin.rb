module PageflowPaged
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('paged_entry_type') do |feature_config|
        feature_config.entry_types.register(PageflowPaged.entry_type)
      end

      config.features.enable_by_default('paged_entry_type')
    end
  end
end
