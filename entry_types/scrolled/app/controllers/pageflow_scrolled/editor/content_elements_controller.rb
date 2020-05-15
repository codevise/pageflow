module PageflowScrolled
  module Editor
    # @api private
    class ContentElementsController < ActionController::Base
      include Pageflow::EditorController

      def create
        section = Section.all_for_revision(@entry.draft).find(params[:section_id])
        content_element = section.content_elements.create(content_element_params)

        render partial: 'pageflow_scrolled/content_elements/content_element',
               locals: {content_element: content_element},
               status: :created
      end

      def batch
        section = Section.all_for_revision(@entry.draft).find(params[:section_id])

        items = params.require(:content_elements).map do |item|
          item.transform_keys(&:underscore).permit(:id, :type_name, :_delete, configuration: {})
        end

        @content_elements = ContentElement::Batch.new(section, items).save!
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def update
        content_element = ContentElement.all_for_revision(@entry.draft).find(params[:id])
        content_element.update_attributes(content_element_params)

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def destroy
        content_element = ContentElement.all_for_revision(@entry.draft).find(params[:id])
        content_element.destroy

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def order
        section = Section.all_for_revision(@entry.draft).find(params[:section_id])
        storyline = section.chapter.storyline

        params.require(:ids).each_with_index do |id, index|
          storyline.content_elements.update(id,
                                            section_id: section.id,
                                            position: index)
        end

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def content_element_params
        configuration = params.require(:content_element)[:configuration].try(:permit!) || {}
        params.require(:content_element)
              .transform_keys(&:underscore)
              .permit(:type_name, :position)
              .merge(configuration: configuration)
      end
    end
  end
end
