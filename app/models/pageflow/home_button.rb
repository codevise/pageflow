module Pageflow
  class HomeButton
    attr_reader :revision, :theming

    def initialize(revision, theming)
      @revision = revision
      @theming = theming
    end

    def url
      revision.home_url.presence || theming_home_button_url
    end

    def enabled?
      revision.home_button_enabled? &&
        revision.theme.has_home_button? &&
        url.present?
    end

    def url_value
      revision.home_url
    end

    def enabled_value
      revision.home_button_enabled?
    end

    private

    def theming_home_button_url
      if theming.home_url.present?
        options = Pageflow.config.theming_url_options(theming) || {}
        options.merge(controller: 'entries', action: 'index')
      end
    end
  end
end
