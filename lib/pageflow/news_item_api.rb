module Pageflow
  # Api for plugins to contribute news items for the news collection
  # configured via `config.news`.  Included in the Pageflow module to
  # provide `news_item` class method.
  module NewsItemApi
    # Add a item to the news collection configured via
    # `Configuration#news`. Intended to be used with Krant (see
    # https://github.com/codevise/krant). See Krant's readme for
    # details on the supported parameters.
    #
    # @since 12.2
    def news_item(name, options)
      after_global_configure do |config|
        config.news.item(name, options) if config.news
      end
    end
  end
end
