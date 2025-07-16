module Pageflow
  module AssetUrlsHelper # rubocop:todo Style/Documentation
    include RenderJsonHelper

    def editor_asset_urls
      render_json_partial('pageflow/editor/asset_urls/asset_urls')
    end
  end
end
