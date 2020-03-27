module PageflowScrolled
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('scrolled_entry_type') do |feature_config|
        feature_config.entry_types.register(PageflowScrolled.entry_type)
      end

      config.for_entry_type(PageflowScrolled.entry_type) do |c|
        c.file_types.register(Pageflow::BuiltInFileType.image)
        c.file_types.register(Pageflow::BuiltInFileType.video)
        c.file_types.register(Pageflow::BuiltInFileType.audio)

        c.revision_components.register(Storyline)
      end
    end
  end
end
