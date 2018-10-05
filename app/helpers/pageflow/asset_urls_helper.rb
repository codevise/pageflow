module Pageflow
  module AssetUrlsHelper
    include RenderJsonHelper

    def editor_asset_urls
      render_json_partial('pageflow/editor/asset_urls/asset_urls')
    end
  end
end
