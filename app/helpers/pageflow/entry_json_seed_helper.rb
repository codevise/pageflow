module Pageflow
  # Render seed data for published entries.
  #
  # @api private
  module EntryJsonSeedHelper
    include RenderJsonHelper
    include CommonEntrySeedHelper

    def entry_json_seed(entry)
      sanitize_json(render_json_partial('pageflow/entry_json_seed/entry',
                                        entry: entry)).html_safe
    end

    def entry_theming_seed(entry)
      {
        change_to_parent_page_at_storyline_boundary: entry.theming.theme.change_to_parent_page_at_storyline_boundary?,
        page_change_by_scrolling: entry.theming.theme.page_change_by_scrolling?,
        hide_text_on_swipe: entry.theming.theme.hide_text_on_swipe?
      }
    end

    def entry_storylines_seed(entry)
      attributes = [:id, :configuration]
      entry.storylines.as_json(only: attributes)
    end

    def entry_chapters_seed(entry)
      attributes = [:id, :storyline_id, :title, :configuration]
      entry.chapters.as_json(only: attributes)
    end

    def entry_pages_seed(entry)
      attributes = [:id, :perma_id, :chapter_id, :template, :configuration]
      entry.pages.as_json(only: attributes)
    end

    def entry_file_ids_seed(entry)
      Pageflow.config.file_types.with_thumbnail_support.each_with_object({}) do |file_type, result|
        result[file_type.collection_name] = entry.find_files(file_type.model).map(&:id)
      end
    end

    def entry_audio_files_json_seed(entry)
      seed = entry.audio_files.each_with_object({}) do |audio_file, result|
        result[audio_file.id] = audio_file_sources(audio_file)
      end

      sanitize_json(seed.to_json).html_safe
    end
  end
end
