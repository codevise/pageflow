module Pageflow
  module AssetsHelper
    def asset_exists?(path)
      if Rails.configuration.assets.compile
        Rails.application.precompiled_assets.include? path
      else
        Rails.application.assets_manifest.assets[path].present?
      end
    end

    def print_logo_path(entry)
      "pageflow/themes/#{entry.theme.directory_name}/logo_print.png"
    end
  end
end
