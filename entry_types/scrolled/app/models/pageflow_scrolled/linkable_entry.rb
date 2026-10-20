module PageflowScrolled
  # Entry that editors can link to.
  #
  # @api private
  class LinkableEntry
    attr_reader :entry

    delegate :id, :title, :type_name, :publication_state, :draft, to: :entry

    class << self
      def all(scope, except:)
        linkable(scope, except).map { |entry| new(entry) }
      end

      def find(scope, id, except:)
        entry = linkable(scope, except).find_by(id:, type_name: 'scrolled')
        entry && new(entry)
      end

      private

      def linkable(scope, except)
        scope.where(fragment_library: nil).where.not(id: except.id)
      end
    end

    def initialize(entry)
      @entry = entry
    end

    def published_entry
      Pageflow::PublishedEntry.new(entry, entry.published_revision || entry.draft)
    end

    def content
      @content ||= RevisionContent.new(draft, include_hidden: true)
    end
  end
end
