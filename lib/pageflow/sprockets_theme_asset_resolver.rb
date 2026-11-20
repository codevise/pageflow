module Pageflow
  # Resolves conventional theme assets from the Sprockets asset pipeline.
  #
  # Used as the default for backwards compatibility with entry types and
  # themes created before entry types could provide their own resolver.
  class SprocketsThemeAssetResolver
    def preview_image_url(theme, view_context:)
      view_context.image_url(theme.preview_image_path)
    end

    def preview_thumbnail_url(theme, view_context:)
      view_context.image_url(theme.preview_thumbnail_path)
    end

    def publisher_logo_url(entry, view_context:)
      view_context.asset_url(entry.theme.print_logo_path)
    end
  end
end
