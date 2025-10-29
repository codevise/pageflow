module Pageflow
  # Registry for oEmbed providers that can be used to resolve URLs.
  class OembedProviders
    def initialize
      @providers = {}
    end

    # Register an oEmbed provider.
    #
    # @param name [Symbol] The name of the provider
    # @param endpoint [String] The oEmbed endpoint URL with {format} placeholder
    # @param url_patterns [Array<String>] Array of URL patterns the provider can handle
    #
    # @example
    #   config.oembed_providers.register(
    #     :bluesky,
    #     endpoint: 'https://bsky.app/oembed.{format}',
    #     url_patterns: ['https://bsky.app/profile/*/post/*']
    #   )
    def register(name, endpoint:, url_patterns:)
      provider = OEmbed::Provider.new(endpoint)
      url_patterns.each { |pattern| provider << pattern }
      @providers[name.to_s] = provider
    end

    # @api private
    def find_by_name!(name)
      @providers.fetch(name.to_s) do
        raise(OembedProviderNotFoundError, "Unknown oEmbed provider '#{name}'")
      end
    end

    # @api private
    def names
      @providers.keys
    end
  end

  # Error raised when an oEmbed provider is not found
  class OembedProviderNotFoundError < StandardError
  end
end
