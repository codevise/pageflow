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
    include Pageflow::PublicI18n::LocalesHelper
    include PageflowScrolled::I18nHelper
    include PageflowScrolled::ThemesHelper
    include PageflowScrolled::LinkedEntriesHelper

    def scrolled_entry_json_seed_script_tag(scrolled_entry, options = {})
      seed_json = render_json do |json|
        scrolled_entry_json_seed(json, scrolled_entry, options)
      end

      content_tag(:script,
                  sanitize_json(seed_json).html_safe,
                  type: 'application/json',
                  data: {pageflow_scrolled_seed: true})
    end

    def scrolled_entry_json_seed(json, scrolled_entry, options = {})
      content = RevisionContent.new(scrolled_entry.revision,
                                    include_hidden: options[:include_hidden_sections],
                                    cutoff: scrolled_entry.cutoff_mode_enabled_for?(request))
      widgets = scrolled_entry.resolve_widgets(insert_point: :react)
      entry_config = Pageflow.config_for(scrolled_entry)
      file_reference_locations = EntryFileReferenceLocations.new(entry_config)

      json.partial!('pageflow_scrolled/entry_json_seed/entry',
                    entry: scrolled_entry,
                    entry_config:,
                    content:,
                    file_reference_locations:,
                    referenced_files: scrolled_entry_json_seed_referenced_files(
                      scrolled_entry, entry_config, content, file_reference_locations
                    ),
                    widgets:,
                    options:)
    end

    private

    def scrolled_entry_json_seed_referenced_files(scrolled_entry, entry_config,
                                                  content, locations)
      return unless entry_config.features.enabled?('file_rights_from_references')

      ReferencedFiles.new(scrolled_entry,
                          sections: content.sections,
                          content_elements: content.content_elements,
                          locations:)
    end
  end
end
