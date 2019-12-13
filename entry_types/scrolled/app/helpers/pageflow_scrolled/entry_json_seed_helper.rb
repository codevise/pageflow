module PageflowScrolled
  # Render seed data for published scrolled entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include Pageflow::RenderJsonHelper

    def entry_json_seed(entry)
      sanitize_json(render_json_partial('pageflow_scrolled/entry_json_seed/entry',
                                        entry: entry)).html_safe
    end

    def sections_seed(section)
      section.configuration
    end

    def section_content_elements_seed(section)
      {
        foreground: section.content_elements.map do |content_element|
          {
            type: content_element.type_name,
            props: content_element.configuration
          }
        end
      }
    end
  end
end
