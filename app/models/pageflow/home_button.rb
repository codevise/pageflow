module Pageflow
  class HomeButton
    attr_reader :revision, :site

    def initialize(revision, site)
      @revision = revision
      @site = site
    end

    def url
      revision.configuration['home_url'].presence || site_home_button_url
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

    def site_home_button_url
      return unless site.home_url.present?

      options = Pageflow.config.site_url_options_for(site) || {}
      Pageflow::Engine.routes.url_for(options.merge(controller: 'pageflow/entries',
                                                    action: 'index',
                                                    only_path: !options[:host]))
    end
  end
end
