module PageflowScrolled
  # @api private
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    helper Pageflow::WidgetsHelper
    helper Pageflow::SocialShareHelper
    helper Pageflow::MetaTagsHelper
    helper Pageflow::StructuredDataHelper

    def show
      @entry = get_published_entry_from_env
      @widget_scope = get_entry_mode_from_env

      I18n.locale = @entry.locale
    end
  end
end
