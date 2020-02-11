module PageflowScrolled
  # @api private
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @entry = get_published_entry_from_env
      I18n.locale = @entry.locale
    end
  end
end
