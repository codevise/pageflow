module PageflowScrolled
  # Resolves theme assets from Webpack with a Sprockets fallback for
  # backwards compatibility with existing themes.
  class ThemeAssetResolver
    def initialize(fallback = Pageflow::SprocketsThemeAssetResolver.new)
      @fallback = fallback
    end

    def preview_image_url(theme, view_context:)
      webpack_asset_url(theme, 'preview.png', view_context:) ||
        @fallback.preview_image_url(theme, view_context:)
    end

    def preview_thumbnail_url(theme, view_context:)
      webpack_asset_url(theme, 'preview_thumbnail.png', view_context:) ||
        @fallback.preview_thumbnail_url(theme, view_context:)
    end

    def publisher_logo_url(entry, view_context:)
      webpack_asset_url(entry.theme, 'logo_print.png', view_context:) ||
        @fallback.publisher_logo_url(entry, view_context:)
    end

    private

    def webpack_asset_url(theme, path, view_context:)
      logical_path = "static/pageflow-scrolled/themes/#{theme.directory_name}/#{path}"
      asset_path = view_context.current_shakapacker_instance.manifest.lookup(logical_path)

      view_context.url_to_asset(asset_path) if asset_path
    end
  end
end
