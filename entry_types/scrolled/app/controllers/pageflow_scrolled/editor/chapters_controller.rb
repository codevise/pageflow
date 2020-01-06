module PageflowScrolled
  module Editor
    # @api private
    class ChaptersController < ActionController::Base
      include Pageflow::EditorController

      def create
        chapter = Chapter.create(chapter_params.merge(revision: @entry.draft))

        render json: chapter, status: :created
      end

      def update
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:id])
        chapter.update_attributes(chapter_params)

        render json: chapter
      end

      def destroy
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:id])
        chapter.destroy

        render json: chapter
      end

      def order
        storyline = Storyline.all_for_revision(@entry.draft).find(params[:storyline_id])
        chapters = Chapter.all_for_revision(@entry.draft)

        params.require(:ids).each_with_index do |id, index|
          chapters.update(id, storyline_id: storyline.id, position: index)
        end

        head :no_content
      end

      private

      def chapter_params
        configuration = params.require(:chapter)[:configuration].try(:permit!) || {}
        params.require(:chapter)
              .permit(:position)
              .merge(configuration: configuration)
      end
    end
  end
end
