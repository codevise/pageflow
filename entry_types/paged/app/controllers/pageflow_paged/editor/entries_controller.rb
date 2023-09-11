module PageflowPaged
  module Editor
    # @api private
    class EntriesController < PageflowPaged::ApplicationController
      include Pageflow::EditorController

      skip_before_action :verify_edit_lock, only: :partials

      def partials
        I18n.locale = @entry.locale
        render action: 'partials', layout: false
      end
    end
  end
end
