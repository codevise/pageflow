module PageflowScrolled
  module Editor
    # @api private
    class ChaptersController < ActionController::Base
      include Pageflow::EditorController
      skip_before_action :verify_edit_lock, only: :show
      respond_to :json

      def create
        entry = Pageflow::DraftEntry.find(params[:entry_id])
        chapter = Chapter.create(chapter_params.merge(revision: entry.draft))

        render json: chapter, status: :created
      end

      def update
        chapter = Chapter.find(params[:id])
        chapter.update_attributes(chapter_params)

        render json: chapter
      end

      def destroy
        chapter = Chapter.find(params[:id])
        chapter.destroy

        render json: chapter
      end

      def order
        entry = Pageflow::DraftEntry.find(params[:entry_id])
        storyline = Storyline.all_for_revision(entry.draft).first

        params.require(:ids).each_with_index do |id, index|
          storyline.chapters.update(id, position: index)
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
