module PageflowScrolled
  module Editor
    # @api private
    class FragmentInsertionsController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def create
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])

        @sections = authorized_scope(:read, FragmentLibrary)
                    .find(fragment_params[:entry_id])
                    .copy_fragment_to(fragment_perma_id: fragment_params[:chapter_perma_id],
                                      entry: @entry,
                                      chapter:)

        render :create, status: :created
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def fragment_params
        params.require(:fragment).permit(:entry_id, :chapter_perma_id)
      end
    end
  end
end
