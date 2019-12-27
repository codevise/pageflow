module PageflowScrolled
  module Editor
    # @api private
    class SectionsController < ActionController::Base
      include Pageflow::EditorController
      skip_before_action :verify_edit_lock, only: :show
      respond_to :json

      def create
        chapter = Chapter.find(params[:chapter_id])
        section = chapter.sections.create(section_params)

        render json: section, status: :created
      end

      def update
        section = Section.find(params[:id])
        section.update_attributes(section_params)

        render json: section
      end

      def destroy
        section = Section.find(params[:id])
        section.destroy

        render json: section
      end

      def order
        chapter = Chapter.find(params[:chapter_id])
        storyline = chapter.storyline

        params.require(:ids).each_with_index do |id, index|
          storyline.sections.update(id,
                                    chapter_id: chapter.id,
                                    position: index)
        end

        head :no_content
      rescue ActiveRecord::RecordNotFound
        # section not in storyline of chapter
        head :not_found
      end

      private

      def section_params
        {configuration: params.dig(:section, :configuration).try(:permit!)}
      end
    end
  end
end
