module PageflowScrolled
  class Trash
    # @api private
    class Item
      delegate :id, :sections, to: :@chapter

      def initialize(chapter, revision)
        @chapter = chapter
        @revision = revision
      end

      def kind
        metadata['kind']
      end

      def origin_perma_id
        metadata['originPermaId']
      end

      def origin_position
        metadata['originPosition']
      end

      def trashed_at
        metadata['trashedAt']
      end

      private

      def metadata
        @chapter.configuration['trash']
      end
    end
  end
end
