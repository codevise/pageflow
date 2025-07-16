module Pageflow
  # Base class for Pageflow extensions which perform more complex
  # configuration changes.
  #
  # @since 0.7
  class Plugin
    # Override to configure Pageflow
    #
    # @param [Configuration] config
    def configure(config); end
  end
end
