module Pageflow
  # This helper allows to register a custom configure block that shall
  # be executed in the context of a test. This is required when testing
  # functionality that calls `Pageflow.config_for`, which builds up a
  # new configuration object. Simply calling `Pageflow.configure` from
  # inside a test does not work since there is no easy way to tear it
  # down after the test.
  #
  # @since 13.0
  module GlobalConfigApiTestHelper
    mattr_accessor :custom_configure_block

    # Call as part of test setup to add fixture configuration. Can be
    # thought of as a test specific `Pageflow.configure`. Can only be
    # used once per spec (including `before` blocks etc.)
    #
    # @example
    #
    #   it 'works when the page type is registered'
    #     pageflow_configure do |config|
    #       config.page_types.register(Some.page_type)
    #     end
    #
    #     # ...
    #   end
    def pageflow_configure(&block)
      GlobalConfigApiTestHelper.custom_configure_block = block
      Pageflow.configure!
    end

    # Call from plugin test suite to make the `pageflow_configure`
    # helper available and RSpec hooks to apply configuration changes.
    def self.setup
      return if @setup
      @setup = true

      RSpec.configure do |config|
        config.include(GlobalConfigApiTestHelper)

        config.before(:suite) do
          Pageflow.configure do |pageflow_config|
            GlobalConfigApiTestHelper.custom_configure_block&.call(pageflow_config)
          end
        end

        config.before do
          GlobalConfigApiTestHelper.custom_configure_block = nil
          Pageflow.configure!
        end
      end
    end
  end
end
