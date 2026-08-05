module PageflowScrolled
  # @api private
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    helper Pageflow::EntriesHelper
    helper Pageflow::FeedsHelper
    helper Pageflow::HreflangLinksHelper
    helper Pageflow::WidgetsHelper
    helper Pageflow::SocialShareHelper
    helper Pageflow::MetaTagsHelper
    helper Pageflow::StructuredDataHelper
    helper Pageflow::TextDirectionHelper
    helper FaviconHelper

    def show
      entry = get_published_entry_from_env
      mode = get_entry_mode_from_env

      I18n.locale = entry.locale

      render(
        locals: {
          entry:,
          entry_mode: mode,
          seed_options: seed_options(entry, mode)
        }
      )
    end

    private

    def seed_options(entry, mode)
      options = {
        embed: get_embed_from_env,
        origin_url: request.original_url
      }

      if mode == :preview
        # Published entries are cached without taking the requesting
        # user into account. Only previews may depend on their locale.
        options[:ui_locale] = get_ui_locale_from_env
        options[:load_commenting] = true if entry.feature_state('commenting')
      end

      options
    end
  end
end
