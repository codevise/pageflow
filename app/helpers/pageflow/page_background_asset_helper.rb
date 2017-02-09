module Pageflow
  module PageBackgroundAssetHelper
    def page_background_asset(configuration)
      render('pageflow/page_background_asset/element',
             configuration: configuration)
    end
  end
end
