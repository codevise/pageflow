module PageflowScrolled
  class LinkedEntry
    # Chapter of a linked entry that links point to.
    #
    # @api private
    Chapter = Struct.new(:perma_id, :slug, :preview_slug, :title, keyword_init: true)
  end
end
