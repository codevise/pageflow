module Pageflow
  module ThemingsHelper
    DEFAULT_PUBLIC_ENTRY_OPTIONS = lambda do |theming|
      domain = theming.primary_domain
      domain.present? ? {host: domain.name} : nil
    end

    def pretty_theming_url(theming)
      public_root_url(Pageflow.config.theming_url_options(theming))
    end
  end
end
