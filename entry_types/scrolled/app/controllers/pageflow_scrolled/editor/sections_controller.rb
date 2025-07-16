module PageflowScrolled
  module Editor
    # @api private
    class SectionsController < ActionController::Base
      include Pageflow::EditorController

      def create
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])
        section = chapter.create_section(section_params)

        render partial: 'pageflow_scrolled/editor/sections/section_with_content_elements',
               locals: {section:},
               status: :created
      end

      def duplicate
        section = Section.all_for_revision(@entry.draft).find(params[:id])

        render partial: 'pageflow_scrolled/editor/sections/section_with_content_elements',
               locals: {section: section.chapter.duplicate_section(section)},
               status: :created
      end

      def update
        section = Section.all_for_revision(@entry.draft).find(params[:id])
        section.update(section_params)

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def destroy
        section = Section.all_for_revision(@entry.draft).find(params[:id])
        section.destroy

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def order
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])
        storyline = chapter.storyline

        params.require(:ids).each_with_index do |id, index|
          storyline.sections.find(id).update(chapter_id: chapter.id,
                                             position: index)
        end

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def section_params
        configuration = params.require(:section)[:configuration].try(:permit!) || {}
        params.require(:section)
              .permit(:position)
              .merge(configuration:)
      end
    end
  end
end
