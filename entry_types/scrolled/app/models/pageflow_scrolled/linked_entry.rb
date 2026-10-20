module PageflowScrolled
  # Entry that links point to along with the chapters links point to.
  #
  # @api private
  class LinkedEntry
    attr_reader :entry, :chapters

    delegate :id, :title, :publication_state, to: :entry

    class << self
      def all(scope, chapter_perma_ids_by_entry_id)
        return [] if chapter_perma_ids_by_entry_id.empty?

        entries = scope
                  .where(id: chapter_perma_ids_by_entry_id.keys)
                  .preload(:published_revision, :draft)
                  .order(:id)
                  .to_a
        chapter_loader = ChapterLoader.new(entries)

        entries.map do |entry|
          new(entry,
              chapters: chapter_loader.for(entry, chapter_perma_ids_by_entry_id[entry.id]))
        end
      end
    end

    def initialize(entry, chapters: [])
      @entry = entry
      @chapters = chapters
    end

    def published_entry
      Pageflow::PublishedEntry.new(entry, entry.published_revision || entry.draft)
    end
  end
end
