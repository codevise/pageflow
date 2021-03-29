module PageflowScrolled
  # @api private
  module ThemesHelper
    def scrolled_theme_asset_path(theme, path)
      asset_pack_path("media/pageflow-scrolled/themes/#{theme.name}/#{path}")
    end

    def scrolled_theme_stylesheet_pack_tags(theme)
      safe_join(theme.options.fetch(:stylesheet_packs, []).map do |pack|
        stylesheet_pack_tag(pack, media: 'all')
      end)
    end

    def scrolled_theme_properties_style_tag(theme)
      declarations = [
        scrolled_theme_deep_declarations(theme.options.fetch(:font_family, {}), 'font_family'),
      ].flatten

      content_tag('style', raw(":root {\n#{declarations.join("\n")}\n}\n"))
    end

    private

    def scrolled_theme_deep_declarations(hash, suffix, prefix = [])
      hash.flat_map do |key, value|
        if value.is_a?(Hash)
          scrolled_theme_deep_declarations(value, suffix, [*prefix, key])
        else
          name = [*prefix, key, suffix].join('_')
          "--theme-#{name.dasherize}: #{value};"
        end
      end
    end
  end
end
