module PageflowScrolled
  module Editor
    # @api private
    class SectionsController < ActionController::Base
      include Pageflow::EditorController

      def create
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])
        section = chapter.sections.create(section_params)

        render json: section, status: :created
      end

      def update
        section = Section.all_for_revision(@entry.draft).find(params[:id])
        section.update_attributes(section_params)

        render json: section
      end

      def destroy
        section = Section.all_for_revision(@entry.draft).find(params[:id])
        section.destroy

        render json: section
      end

      def order
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])
        storyline = chapter.storyline

        params.require(:ids).each_with_index do |id, index|
          storyline.sections.update(id,
                                    chapter_id: chapter.id,
                                    position: index)
        end

        head :no_content
      end

      private

      def section_params
        configuration = params.require(:section)[:configuration].try(:permit!) || {}
        params.require(:section)
              .permit(:position)
              .merge(configuration: configuration)
      end
    end
  end
end
