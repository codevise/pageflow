module PageflowScrolled
  module Editor
    # @api private
    class FragmentExtractionsController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def create
        chapter = Chapter.all_for_revision(@entry.draft).find(params[:chapter_id])
        library = FragmentLibrary.shared_for_account(@entry.account)

        authorize!(:update, library)
        library.extract_fragment_from(entry: @entry, chapter:, title: params[:title])

        head :created
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end
    end
  end
end
