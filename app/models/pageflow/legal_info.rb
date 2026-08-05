module Pageflow
  # Legal info of a site, resolved for a single locale. Each attribute
  # falls back to the value stored in the site's column when there is
  # no translation for the locale.
  #
  # @since edge
  class LegalInfo
    Link = Struct.new(:label, :url, keyword_init: true)

    def initialize(site, locale)
      @site = site
      @locale = locale
    end

    def imprint
      @imprint ||= link('imprint')
    end

    def copyright
      @copyright ||= link('copyright')
    end

    def privacy_url
      translated(:privacy_link_url)
    end

    private

    def link(kind)
      Link.new(label: translated("#{kind}_link_label"),
               url: translated("#{kind}_link_url"))
    end

    def translated(attribute)
      @site.translated(attribute, locale: @locale)
    end
  end
end
