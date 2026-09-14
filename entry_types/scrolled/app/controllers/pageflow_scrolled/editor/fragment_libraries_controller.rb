module PageflowScrolled
  module Editor
    # @api private
    class FragmentLibrariesController < ActionController::Base
      include Pageflow::EditorController

      helper Pageflow::FilesHelper

      before_action do
        head :not_found unless @entry.feature_state('fragments')
      end

      def index
        @libraries = authorized_scope(:read, FragmentLibrary.where(account: @entry.account))
      end
    end
  end
end
