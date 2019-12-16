module PageflowScrolled
  # Render seed data for published scrolled entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include Pageflow::RenderJsonHelper

    def scrolled_entry_json_seed(scrolled_entry)
      sections = Section.all_for_revision(scrolled_entry.revision)

      sanitize_json(render_json_partial('pageflow_scrolled/entry_json_seed/entry',
                                        sections: sections)).html_safe
    end
  end
end
