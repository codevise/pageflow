module Pageflow
  module PageBackgroundAssetHelper
    include EntryJsonSeedHelper
    include ReactServerSideRenderingHelper

    def page_background_asset(page)
      render('pageflow/page_background_asset/element',
             entry: @entry,
             page: page)
    end
  end
end
