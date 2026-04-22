module PageflowScrolled
  module Editor
    # @api private
    class ContentElementsController < ActionController::Base
      include Pageflow::EditorController

      def create
        section = Section.all_for_revision(@entry.draft).find(params[:section_id])
        content_element = section.content_elements.create(content_element_params)

        render partial: 'pageflow_scrolled/content_elements/content_element',
               locals: {content_element:},
               status: :created
      end

      def batch
        section = Section.all_for_revision(@entry.draft).find(params[:section_id])

        items = params.require(:content_elements).map do |item|
          item.transform_keys(&:underscore).permit(:id, :type_name, :_delete,
                                                   configuration: {},
                                                   migrate_comment_threads: [])
        end

        @content_elements = ContentElement::Batch.new(
          section, items,
          comment_thread_subject_ranges: permitted_subject_ranges
        ).save!
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def update
        content_element = ContentElement.all_for_revision(@entry.draft).find(params[:id])

        ContentElement.transaction do
          content_element.update(content_element_params)
          update_comment_thread_subject_ranges(content_element)
        end

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
          storyline.content_elements.find(id).update(section_id: section.id,
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
              .merge(configuration:)
      end

      def update_comment_thread_subject_ranges(content_element)
        ranges = permitted_subject_ranges
        return if ranges.blank?

        Pageflow::CommentThread.update_subject_ranges_for(
          revision: @entry.draft,
          subject_type: 'ContentElement',
          subject_id: content_element.perma_id,
          ranges:
        )
      end

      def permitted_subject_ranges
        ranges = params[:comment_thread_subject_ranges]
        return nil if ranges.blank?

        ranges.to_unsafe_h.transform_values do |range|
          range.is_a?(Hash) ? range.slice('anchor', 'focus') : {}
        end
      end
    end
  end
end
