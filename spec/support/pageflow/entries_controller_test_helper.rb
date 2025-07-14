module Pageflow
  # Helpers to test entry type controllers.
  #
  # @since 15.1
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

    # Invoke an action of the entries controller with the request env
    # set up just like when Pageflow delegates to the entry type's
    # frontend app.
    #
    # @param action [Symbol] Name of the action to invoke
    #
    # @param entry [Entry] Entry to render.
    #
    # @param mode [:published|:preview] Whether to render the
    #   published revision or the draft.
    def get_with_entry_env(action, entry:, mode: :published, params: {})
      revision =
        if mode == :published
          entry.published_revision
        else
          entry.draft
        end

      published_entry = PublishedEntry.new(entry, revision)
      EntriesControllerEnvHelper.add_entry_info_to_env(request.env,
                                                       entry: published_entry,
                                                       mode:)
      get(action, params: {**params})
    end
  end
end
