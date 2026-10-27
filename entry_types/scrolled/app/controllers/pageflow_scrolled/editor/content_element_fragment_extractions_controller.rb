module PageflowScrolled
  module Editor
    # @api private
    class ContentElementFragmentExtractionsController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def create
        library = FragmentLibrary.shared_for_account(@entry.account)

        authorize!(:update, library)
        library.extract_content_elements_from(entry: @entry,
                                              content_elements: find_content_elements,
                                              title: params[:title])

        head :created
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def find_content_elements
        ids = Array(params[:content_element_ids]).map(&:to_i).uniq
        content_elements = ContentElement.all_for_revision(@entry.draft).where(id: ids).to_a

        raise ActiveRecord::RecordNotFound if ids.empty? || content_elements.size < ids.size

        content_elements
      end
    end
  end
end
