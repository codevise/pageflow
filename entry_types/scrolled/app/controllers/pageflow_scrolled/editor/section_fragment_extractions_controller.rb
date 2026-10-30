module PageflowScrolled
  module Editor
    # @api private
    class SectionFragmentExtractionsController < ActionController::Base
      include Pageflow::EditorController

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def create
        library = FragmentLibrary.shared_for_account(@entry.account)

        authorize!(:update, library)
        library.extract_sections_from(entry: @entry,
                                      sections: find_sections,
                                      title: params[:title])

        head :created
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      private

      def find_sections
        ids = Array(params[:section_ids]).map(&:to_i).uniq
        sections = Section.all_for_revision(@entry.draft).where(id: ids).to_a

        raise ActiveRecord::RecordNotFound if ids.empty? || sections.size < ids.size

        sections
      end
    end
  end
end
