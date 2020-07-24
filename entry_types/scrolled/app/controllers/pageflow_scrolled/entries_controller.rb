module PageflowScrolled
  # @api private
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    helper Pageflow::WidgetsHelper
    helper Pageflow::PublicI18nHelper
    helper Pageflow::SocialShareHelper
    helper Pageflow::MetaTagsHelper

    def show
      @entry = get_published_entry_from_env
      @widget_scope = get_entry_mode_from_env

      I18n.locale = @entry.locale
    end
  end
end
