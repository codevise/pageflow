module Pageflow
  # A helper module that can be included in an entry type's frontend
  # app to access the {PublishedEntry}.
  #
  # @since edge
  module EntriesControllerEnvHelper
    module_function

    # Read the {PublishedEntry} from the request env. It will be
    # placed there by the Pageflow engine before delegating to the
    # entry type's frontend app.
    #
    # Use {EntriesControllerTestHelper} to set up the request
    # environment in controller tests.
    def get_published_entry_from_env(env = request.env)
      pageflow_hash = env.fetch('pageflow') do
        throw('Missing pageflow key in request env. Use Pageflow::EntriesControllerTestHelper ' \
              'to set it in controller tests.')
      end

      pageflow_hash['published_entry']
    end

    # @api private
    def add_published_entry_to_env(env, entry)
      env['pageflow'] = {'published_entry' => entry}
    end
  end
end
