module PageflowPaged
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.entry_types.register(entry_type)
    end

    private

    def entry_type
      Pageflow::EntryType.new(name: 'paged',
                              frontend_app: Pageflow::PagedEntriesController.action(:show))
    end
  end
end
