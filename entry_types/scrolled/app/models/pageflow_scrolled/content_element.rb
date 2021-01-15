module PageflowScrolled
  # @api private
  class ContentElement < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::AutoGeneratedPermaId
    include Pageflow::NestedRevisionComponent

    belongs_to :section

    def self.all_for_revision(revision)
      joins(section: {chapter: {storyline: :revision}})
        .where(pageflow_scrolled_storylines: {revision_id: revision})
    end

    # @api private
    class Batch
      def initialize(section, items)
        @section = section
        @storyline = section.chapter.storyline
        @items = items
      end

      def save!
        ContentElement.transaction do
          @items.map.with_index { |item, index|
            if item[:_delete]
              @section.content_elements.delete(item[:id])
              nil
            else
              create_or_update(item, index)
            end
          }.compact
        end
      end

      private

      def create_or_update(item, index)
        attributes = {
          section_id: @section.id,
          position: index
        }.merge(item.slice(:type_name, :configuration))

        if item[:id]
          @storyline.content_elements.update(item[:id], attributes)
        else
          @section.content_elements.create(attributes)
        end
      end
    end
  end
end
