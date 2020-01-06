module PageflowPaged
  # Configuration options for paged entry type
  class Configuration
    include Pageflow::EntryTypeConfiguration

    # Register new types of pages.
    # @return {Pageflow::PageTypes}
    attr_reader :page_types

    # @api private
    def initialize(*)
      super
      @page_types = Pageflow::PageTypes.new
    end
  end
end
