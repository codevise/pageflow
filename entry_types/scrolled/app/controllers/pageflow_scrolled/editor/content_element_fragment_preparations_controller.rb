module PageflowScrolled
  module Editor
    # @api private
    class ContentElementFragmentPreparationsController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def create
        @content_elements =
          authorized_scope(:read, FragmentLibrary)
          .find(fragment_params[:entry_id])
          .prepare_content_elements_for(fragment_perma_id: fragment_params[:chapter_perma_id],
                                        entry: @entry)

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
