module PageflowScrolled
  # Entry that editors can link to.
  #
  # @api private
  class LinkableEntry
    attr_reader :entry

    delegate :id, :title, :type_name, :publication_state, :draft, to: :entry

    class << self
      def all(scope, except:)
        scope
          .where(fragment_library: nil)
          .where.not(id: except.id)
          .map { |entry| new(entry) }
      end
    end

    def initialize(entry)
      @entry = entry
    end

    def published_entry
      Pageflow::PublishedEntry.new(entry, entry.published_revision || entry.draft)
    end
  end
end
