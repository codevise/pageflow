module PageflowScrolled
  # @api private
  module ThemesHelper
    def scrolled_theme_asset_path(theme, path, theme_file_role: nil)
      theme.files.dig(theme_file_role, :resized) ||
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
        scrolled_theme_deep_declarations(theme.options.fetch(:colors, {}), 'color')
      ].flatten

      content_tag('style', raw(<<~CSS))
        :root {
          #{declarations.join("\n")}
        }

        #{scrolled_theme_typography_rules(theme)}
      CSS
    end

    def scrolled_theme_typography_rules(theme)
      RuleSet.new(prefix: 'typography').generate(theme.options.fetch(:typography, {}))
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
      def initialize(prefix:)
        @prefix = prefix
      end

      def generate(rules)
        rules.flat_map { |rule_name, declarations|
          declarations_by_breakpoint = extract_breakpoint_declarations!(declarations)

          [
            generate_rule(rule_name, declarations),
            declarations_by_breakpoint.map do |breakpoint_name, breakpoint_declarations|
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
          "#{property.to_s.dasherize}: #{value};"
        end

        <<~CSS
          .#{@prefix}-#{rule_name.to_s.dasherize} {
            #{declarations.join("\n")}
          }
        CSS
      end
    end

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
