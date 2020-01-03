module PageflowScrolled
  # Render seed data for published scrolled entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include Pageflow::RenderJsonHelper

    def scrolled_entry_json_seed_script_tag(scrolled_entry)
      seed_json = render_json do |json|
        scrolled_entry_json_seed(json, scrolled_entry)
      end

      content_tag(:script, <<-JS.html_safe)
        var pageflowScrolledSeed = #{sanitize_json(seed_json)};
      JS
    end

    def scrolled_entry_json_seed(json, scrolled_entry)
      storyline = Storyline.all_for_revision(scrolled_entry.revision).first
      sections = storyline.sections

      content_elements = ContentElement.all_for_revision(scrolled_entry.revision)
                                       .order(position: :asc)

      json.partial!('pageflow_scrolled/entry_json_seed/entry',
                    sections: sections,
                    content_elements: content_elements)
    end
  end
end
