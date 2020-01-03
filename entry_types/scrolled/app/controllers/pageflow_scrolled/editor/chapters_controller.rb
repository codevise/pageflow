module PageflowScrolled
  module Editor
    # @api private
    class ChaptersController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        @storyline = Storyline.all_for_revision(@entry.draft).first
      end

      def create
        chapter = Chapter.create(chapter_params.merge(revision: @entry.draft))

        render json: chapter, status: :created
      end

      def update
        chapter = @storyline.chapters.find(params[:id])
        chapter.update_attributes(chapter_params)

        render json: chapter
      end

      def destroy
        chapter = @storyline.chapters.find(params[:id])
        chapter.destroy

        render json: chapter
      end

      def order
        params.require(:ids).each_with_index do |id, index|
          @storyline.chapters.update(id, position: index)
        end

        head :no_content
      end

      private

      def chapter_params
        {configuration: params.dig(:chapter, :configuration).try(:permit!)}
      end
    end
  end
end
