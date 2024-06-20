module PageflowScrolled
  # Render seed data for published scrolled entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include Pageflow::ConfigHelper
    include Pageflow::RenderJsonHelper
    include Pageflow::FilesHelper
    include Pageflow::EntriesHelper
    include Pageflow::MetaTagsHelper
    include Pageflow::SocialShareLinksHelper
    include PageflowScrolled::I18nHelper
    include PageflowScrolled::ThemesHelper

    def scrolled_entry_json_seed_script_tag(scrolled_entry, options = {})
      seed_json = render_json do |json|
        scrolled_entry_json_seed(json, scrolled_entry, options)
      end

      content_tag(:script, <<-JS.html_safe)
        pageflowScrolledRender(#{sanitize_json(seed_json)});
      JS
    end

    def scrolled_entry_json_seed(json, scrolled_entry, options = {})
      main_storyline = Storyline.all_for_revision(scrolled_entry.revision).first || Storyline.new
      sections = scrolled_entry_json_seed_sections(scrolled_entry, main_storyline)

      json.partial!('pageflow_scrolled/entry_json_seed/entry',
                    entry: scrolled_entry,
                    entry_config: Pageflow.config_for(scrolled_entry),
                    chapters: main_storyline.chapters,
                    sections:,
                    content_elements: main_storyline.content_elements.where(section: sections),
                    widgets: scrolled_entry.resolve_widgets(insert_point: :react),
                    options:)
    end

    private

    def scrolled_entry_json_seed_sections(scrolled_entry, main_storyline)
      if scrolled_entry.cutoff_mode_enabled_for?(request)
        main_storyline.sections_before_cutoff_section
      else
        main_storyline.sections
      end
    end
  end
end
