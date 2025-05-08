module PageflowPaged
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('paged_entry_type') do |feature_config|
        feature_config.entry_types.register(PageflowPaged.entry_type)
      end

      config.features.enable_by_default('paged_entry_type')

      config.for_entry_type(PageflowPaged.entry_type) do |c|
        c.revision_components.register(Pageflow::Storyline, create_defaults: true)
      end
    end
  end
end
