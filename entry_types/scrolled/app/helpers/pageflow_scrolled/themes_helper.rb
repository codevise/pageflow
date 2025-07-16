module PageflowScrolled
  # @api private
  module ThemesHelper
    def scrolled_theme_asset_path(theme,
                                  path,
                                  theme_file_role: nil,
                                  theme_file_style: :resized,
                                  relative_url: false)
      theme_directory, path = extract_theme_directory_from_scrolled_theme_asset_path(theme, path)

      path =
        theme.files.dig(theme_file_role, theme_file_style) ||
        asset_pack_path("static/pageflow-scrolled/themes/#{theme_directory}/#{path}")

      if relative_url
        URI.parse(path).path
      else
        path
      end
    end

    def scrolled_theme_stylesheet_pack_tags(theme)
      safe_join(theme.options.fetch(:stylesheet_packs, []).map do |pack|
        stylesheet_pack_tag(pack, media: 'all', data: {theme: ''})
      end)
    end

    def scrolled_theme_properties_style_tag(theme)
      declarations = [
        scrolled_theme_deep_declarations(theme.options.fetch(:font_family, {}), 'font_family'),
        scrolled_theme_deep_declarations(theme.options.fetch(:colors, {}), 'color')
      ].flatten

      content_tag('style', raw(<<~CSS), data: {theme: ''})
        :root {
          #{declarations.join("\n")}
        }

        #{scrolled_theme_typography_rules(theme)}
        #{scrolled_theme_properties_rules(theme)}
      CSS
    end

    def scrolled_theme_typography_rules(theme)
      RuleSet.new(prefix: 'typography').generate(theme.options.fetch(:typography, {}))
    end

    def scrolled_theme_properties_rules(theme)
      RuleSet.new(prefix: 'scope',
                  custom_properties: true).generate(theme.options.fetch(:properties, {}))
    end

    private

    BREAKPOINTS = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }.freeze

    # @api private
    class RuleSet
      def initialize(prefix:, custom_properties: false)
        @prefix = prefix
        @property_prefix = custom_properties ? '--theme-' : ''
      end

      def generate(rules)
        rules.flat_map { |rule_name, declarations|
          declarations = declarations.dup
          declarations_by_breakpoint = extract_breakpoint_declarations!(declarations)

          [
            generate_rule(rule_name, declarations),
            *declarations_by_breakpoint.map do |breakpoint_name, breakpoint_declarations|
              generate_media_query_rule(breakpoint_name, rule_name, breakpoint_declarations)
            end
          ]
        }.join("\n")
      end

      private

      def extract_breakpoint_declarations!(declarations)
        BREAKPOINTS.keys.each_with_object({}) { |breakpoint_name, result|
          result[breakpoint_name] = declarations.delete(breakpoint_name)
        }.compact
      end

      def generate_media_query_rule(breakpoint_name, rule_name, declarations)
        <<~CSS
          @media (min-width: #{BREAKPOINTS[breakpoint_name]}) {
          #{generate_rule(rule_name, declarations)}
          }
        CSS
      end

      def generate_rule(rule_name, declarations)
        declarations = declarations.map do |property, value|
          "#{@property_prefix}#{property.to_s.dasherize}: #{value};"
        end

        <<~CSS
          #{selector(rule_name)} {
            #{declarations.join("\n")}
          }
        CSS
      end

      def selector(rule_name)
        return ':root' if rule_name == :root

        ".#{@prefix}-#{rule_name.to_s.camelize(:lower)}"
      end
    end

    def scrolled_theme_deep_declarations(hash, suffix = nil, prefix = [])
      hash.flat_map do |key, value|
        if value.is_a?(Hash)
          scrolled_theme_deep_declarations(value, suffix, [*prefix, key])
        else
          name = [*prefix, key, suffix].compact.join('_')
          "--theme-#{name.dasherize}: #{value};"
        end
      end
    end

    def extract_theme_directory_from_scrolled_theme_asset_path(theme, path)
      if path.starts_with?('../shared/')
        ['shared', path.gsub!('../shared/', '')]
      elsif path.starts_with?('../')
        raise(ArgumentError,
              'Upward navigation to other directory than the shared ' \
              'theme directory not allowed in theme asset path.')
      else
        [theme.name, path]
      end
    end
  end
end
