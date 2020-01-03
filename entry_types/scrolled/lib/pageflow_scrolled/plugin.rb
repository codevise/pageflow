module PageflowScrolled
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.entry_types.register(PageflowScrolled.entry_type)
    end

    class ScrolledConfiguration
      include Pageflow::Configuration::EntryTypeConfiguration
    end
  end
end
