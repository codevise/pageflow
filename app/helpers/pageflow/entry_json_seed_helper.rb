module Pageflow
  # Render seed data for published entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include RenderJsonHelper

    def entry_json_seed(entry)
      seed = {
        theming: entry_theming_seed(entry),
        chapter_configurations: entry_chapter_configurations_seed(entry),
        pages: entry_pages_seed(entry)
      }

      sanitize_json(seed.to_json).html_safe
    end

    def entry_theming_seed(entry)
      {
        page_change_by_scrolling: entry.theming.theme.page_change_by_scrolling?
      }
    end

    def entry_chapter_configurations_seed(entry)
      entry.chapters.each_with_object({}) do |chapter, result|
        result[chapter.id] = chapter.configuration
      end
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
