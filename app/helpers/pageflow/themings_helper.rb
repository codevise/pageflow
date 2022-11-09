module Pageflow
  module ThemingsHelper
    DEFAULT_PUBLIC_ENTRY_OPTIONS = lambda do |theming|
      theming.cname.present? ? {host: theming.cname} : nil
    end

    def pretty_theming_url(theming)
      pageflow.public_root_url(Pageflow.config.theming_url_options(theming))
    end
  end
end
