module PageflowPaged
  # Render image or video loop page backgrounds
  module PageBackgroundAssetHelper
    include Pageflow::EntryJsonSeedHelper
    include ReactServerSideRenderingHelper

    def page_background_asset(page)
      render('pageflow_paged/page_background_asset/element',
             entry: @entry,
             page:)
    end
  end
end
