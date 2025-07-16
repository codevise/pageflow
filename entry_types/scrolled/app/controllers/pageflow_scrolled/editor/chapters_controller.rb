module PageflowScrolled
  module Editor
    # @api private
    class ChaptersController < ActionController::Base
      include Pageflow::EditorController

      def create
        chapter = find_storyline.chapters.create(chapter_params)

        render partial: 'pageflow_scrolled/chapters/chapter',
               locals: {chapter:},
               status: :created
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def update
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:id])
        chapter.update(chapter_params)

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def destroy
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:id])
        chapter.destroy

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def order
        storyline = find_storyline
        chapters = Chapter.all_for_revision(@entry.draft)

        params.require(:ids).each_with_index do |id, index|
          chapters.find(id).update(storyline_id: storyline.id, position: index)
        end

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def chapter_params
        configuration = params.require(:chapter)[:configuration].try(:permit!) || {}
        params.require(:chapter)
              .permit(:position)
              .merge(configuration:)
      end

      def find_storyline
        if params[:storyline_id]
          Storyline.all_for_revision(@entry.draft).find(params[:storyline_id])
        else
          Storyline.all_for_revision(@entry.draft).first
        end
      end
    end
  end
end
