$CUSTOM_PAGEFLOW_CONFIGURE_BLOCK = nil

# This helper allows to register a custom configure block that shall
# be executed in the context of a test. This is required when testing
# functionality that calls `Pageflow.config_for`, which builds up a
# new configuration object. Simply calling `Pageflow.configure` from
# inside a test does not work since there is no easy way to tear it
# down after the test.
module PageflowGlobalConfigApiHelper
  def pageflow_configure(&block)
    $CUSTOM_PAGEFLOW_CONFIGURE_BLOCK = block
    Pageflow.configure!
  end
end

Pageflow.configure do |config|
  if $CUSTOM_PAGEFLOW_CONFIGURE_BLOCK
    $CUSTOM_PAGEFLOW_CONFIGURE_BLOCK.call(config)
  end
end

RSpec.configure do |config|
  config.include(PageflowGlobalConfigApiHelper)

  config.before do
    $CUSTOM_PAGEFLOW_CONFIGURE_BLOCK = nil
    Pageflow.configure!
  end
end
