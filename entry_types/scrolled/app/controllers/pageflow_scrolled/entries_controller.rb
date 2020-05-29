module PageflowScrolled
  # @api private
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    helper Pageflow::WidgetsHelper

    def show
      @entry = get_published_entry_from_env
      @widget_scope = get_entry_mode_from_env
    end
  end
end
