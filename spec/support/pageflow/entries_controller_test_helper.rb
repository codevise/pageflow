module Pageflow
  # Helpers to test entry type controllers.
  #
  # @since edge
  module EntriesControllerTestHelper
    extend ActiveSupport::Concern

    included do
      # Entry type controllers are delegated to by
      # `Pagefow::EntriesController`. Therefore they do not have their
      # own routes. Controller specs only allow calling actions that
      # have a route. So we create a fake route to work aroung this.

      controller_name = described_class.name.sub(/Controller$/, '').underscore

      routes do
        ActionDispatch::Routing::RouteSet.new.tap do |routes|
          routes.draw do
            get '/test/entry', to: "#{controller_name}#show"
          end
        end
      end
    end

    # Invoke the show action of the entries controller with the
    # request env set up just like when Pageflow calls the
    # controller as a .
    def get_with_entry_env(action, entry:, params: {})
      published_entry = PublishedEntry.new(entry, entry.published_revision)
      EntriesControllerEnvHelper.add_published_entry_to_env(request.env, published_entry)

      get(action, params: {**params})
    end
  end
end
