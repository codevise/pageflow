module Pageflow
  # Render seed data for published entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include RenderJsonHelper

    def entry_json_seed(entry)
      seed = {
        theming: entry_theming_seed(entry),
        storyline_configurations: entry_storyline_configurations_seed(entry),
        chapters: entry_chapters_seed(entry),
        pages: entry_pages_seed(entry)
      }

      sanitize_json(seed.to_json).html_safe
    end

    def entry_theming_seed(entry)
      {
        change_to_parent_page_at_storyline_boundary: entry.theming.theme.change_to_parent_page_at_storyline_boundary?,
        page_change_by_scrolling: entry.theming.theme.page_change_by_scrolling?,
        hide_text_on_swipe: entry.theming.theme.hide_text_on_swipe?
      }
    end

    def entry_storyline_configurations_seed(entry)
      entry.storylines.each_with_object({}) do |storyline, result|
        result[storyline.id] = storyline.configuration
      end
    end

    def entry_chapters_seed(entry)
      attributes = [:id, :storyline_id, :configuration]
      entry.chapters.as_json(only: attributes)
    end

    def entry_pages_seed(entry)
      attributes = [:id, :perma_id, :chapter_id, :configuration]
      entry.pages.as_json(only: attributes)
    end

    def entry_audio_files_json_seed(entry)
      seed = entry.audio_files.each_with_object({}) do |audio_file, result|
        result[audio_file.id] = audio_file_sources(audio_file)
      end

      sanitize_json(seed.to_json).html_safe
    end
  end
end
