module PageflowPaged
  module Editor
    # @api private
    class EntriesController < PageflowPaged::ApplicationController
      include Pageflow::EditorController

      skip_before_action :verify_edit_lock, only: :partials

      helper_method :render_to_string

      def partials
        I18n.locale = @entry.locale
        render action: 'partials', layout: false
      end
    end
  end
end
