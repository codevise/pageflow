module PageflowScrolled
  # @api private
  class FragmentLibrary
    attr_reader :entry

    delegate :id, to: :entry

    def self.all
      Query.new(Pageflow::Entry.where(fragment_library: 'shared'))
    end

    def self.where(...)
      all.where(...)
    end

    def initialize(entry)
      @entry = entry
    end

    def title
      entry.entry_title
    end

    def storylines
      Storyline.all_for_revision(entry.draft)
    end

    def chapters
      Chapter.all_for_revision(entry.draft)
    end

    def sections
      Section.all_for_revision(entry.draft)
    end

    def content_elements
      ContentElement.all_for_revision(entry.draft)
    end

    def copy_fragment_to(fragment_perma_id:, entry:, chapter:)
      SectionsCopy
        .new(source_entry: self.entry, destination_entry: entry)
        .perform(chapters.find_by!(perma_id: fragment_perma_id).sections, chapter:)
    end

    # @api private
    class Query
      include Enumerable

      def initialize(entries)
        @entries = entries
      end

      def model
        FragmentLibrary
      end

      def all
        self
      end

      def none
        Query.new(@entries.none)
      end

      def where(...)
        Query.new(@entries.where(...))
      end

      def merge(entries)
        Query.new(@entries.merge(entries))
      end

      def find(id)
        library(@entries.find(id))
      end

      def each(&)
        @entries.order(:id).map { |entry| library(entry) }.each(&)
      end

      private

      def library(entry)
        FragmentLibrary.new(Pageflow::DraftEntry.new(entry))
      end
    end
  end
end
