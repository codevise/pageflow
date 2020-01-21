module Pageflow
  class HomeButton
    attr_reader :revision, :theming

    def initialize(revision, theming)
      @revision = revision
      @theming = theming
    end

    def url
      revision.configuration['home_url'].presence || theming_home_button_url
    end

    def enabled?
      revision.configuration['home_button_enabled'] &&
        revision.theme.has_home_button? &&
        url.present?
    end

    def url_value
      revision.configuration['home_url']
    end

    def enabled_value
      revision.configuration['home_button_enabled']
    end

    private

    def theming_home_button_url
      if theming.home_url.present?
        options = Pageflow.config.theming_url_options(theming) || {}
        Pageflow::Engine.routes.url_for(options.merge(controller: 'pageflow/entries',
                                                      action: 'index',
                                                      only_path: !options[:host]))
      end
    end
  end
end
