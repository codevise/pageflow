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

    def scrolled_entry_json_seed_script_tag(scrolled_entry, options = {})
      seed_json = render_json do |json|
        scrolled_entry_json_seed(json, scrolled_entry, options)
      end

      content_tag(:script, <<-JS.html_safe)
        pageflowScrolledRender(#{sanitize_json(seed_json)});
      JS
    end

    def scrolled_entry_json_seed(json, scrolled_entry, options = {})
      revision = scrolled_entry.revision
      sections = scrolled_entry_json_seed_sections(scrolled_entry, options)

      json.partial!('pageflow_scrolled/entry_json_seed/entry',
                    entry: scrolled_entry,
                    entry_config: Pageflow.config_for(scrolled_entry),
                    storylines: scrolled_entry_json_seed_storylines(revision),
                    chapters: scrolled_entry_json_seed_chapters(revision, options),
                    sections:,
                    content_elements: scrolled_entry_json_seed_content_elements(revision, sections),
                    widgets: scrolled_entry.resolve_widgets(insert_point: :react),
                    options:)
    end

    private

    def scrolled_entry_json_seed_storylines(revision)
      Storyline.all_for_revision(revision)
    end

    def scrolled_entry_json_seed_sections(scrolled_entry, options)
      main_storyline = Storyline.all_for_revision(scrolled_entry.revision).first || Storyline.new

      sections =
        if scrolled_entry.cutoff_mode_enabled_for?(request)
          main_storyline.sections_before_cutoff_section
        else
          Section.all_for_revision(scrolled_entry.revision)
        end

      return sections if options[:include_hidden_sections]

      sections.reject { |section| section.configuration['hidden'] }
    end

    def scrolled_entry_json_seed_chapters(revision, options)
      chapters = Chapter.all_for_revision(revision)
      return chapters if options[:include_hidden_sections]

      has_visible_sections, has_hidden_sections =
        scrolled_entry_json_seed_chapter_section_visibilites(revision)

      chapters.reject do |chapter|
        has_hidden_sections[chapter.id] && !has_visible_sections[chapter.id]
      end
    end

    def scrolled_entry_json_seed_chapter_section_visibilites(revision)
      has_visible_sections = {}
      has_hidden_sections = {}

      Section.all_for_revision(revision).each do |section|
        if section.configuration['hidden']
          has_hidden_sections[section.chapter_id] = true
        else
          has_visible_sections[section.chapter_id] = true
        end
      end

      [has_visible_sections, has_hidden_sections]
    end

    def scrolled_entry_json_seed_content_elements(revision, sections)
      ContentElement.all_for_revision(revision).where(section: sections)
    end
  end
end
