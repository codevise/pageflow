module Pageflow
  # A helper module that can be included in an entry type's frontend
  # app to access the {PublishedEntry}.
  #
  # @since 15.1
  module EntriesControllerEnvHelper
    module_function

    # Read the {PublishedEntry} from the request env. It will be
    # placed there by the Pageflow engine before delegating to the
    # entry type's frontend app.
    #
    # Use {EntriesControllerTestHelper} to set up the request
    # environment in controller tests.
    def get_published_entry_from_env(env = request.env)
      EntriesControllerEnvHelper.get_pageflow_hash(env)['published_entry']
    end

    # Returns `:preview` if a signed in user is currently viewing the
    # entry via the preview feature. Returns `:published` if the entry
    # is rendered on a publicly available site.  The information will
    # be placed in the request env by the Pageflow engine before
    # delegating to the entry type's frontend app.
    #
    # Use {EntriesControllerTestHelper} to set up the request
    # environment in controller tests.
    def get_entry_mode_from_env(env = request.env)
      EntriesControllerEnvHelper.get_pageflow_hash(env)['entry_mode']
    end

    # Returns `true` if the entry is being rendered as an embed. The
    # information will be placed in the request env by the Pageflow
    # engine before delegating to the entry type's frontend app.
    #
    # Use {EntriesControllerTestHelper} to set up the request
    # environment in controller tests.
    def get_embed_from_env(env = request.env)
      EntriesControllerEnvHelper.get_pageflow_hash(env)['embed']
    end

    # Returns the locale of the signed in user, i.e. the locale any
    # user interface displayed on top of the entry shall use. Returns
    # `nil` for published entries since those are not rendered for a
    # specific user. Entry types are expected to render the entry
    # itself in the locale of the entry, no matter which locale is
    # returned here.
    #
    # Use {EntriesControllerTestHelper} to set up the request
    # environment in controller tests.
    #
    # @since 17.2
    def get_ui_locale_from_env(env = request.env)
      EntriesControllerEnvHelper.get_pageflow_hash(env)['ui_locale']
    end

    # @api private
    def self.add_entry_info_to_env(env, entry:, mode: nil, embed: false, ui_locale: nil)
      env['pageflow'] = {
        'published_entry' => entry,
        'entry_mode' => mode,
        'embed' => embed,
        'ui_locale' => ui_locale
      }
    end

    # @api private
    def self.get_pageflow_hash(env)
      env.fetch('pageflow') do
        throw('Missing pageflow key in request env. Use Pageflow::EntriesControllerTestHelper ' \
              'to set it in controller tests.')
      end
    end
  end
end
