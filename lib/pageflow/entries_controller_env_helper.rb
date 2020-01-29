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

    # @api private
    def self.add_entry_info_to_env(env, entry:, mode: nil)
      env['pageflow'] = {'published_entry' => entry, 'entry_mode' => mode}
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
