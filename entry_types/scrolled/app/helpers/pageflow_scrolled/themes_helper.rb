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
        #{scrolled_theme_font_face_rules(theme)}
        :root {
          #{declarations.join("\n")}
        }

        #{scrolled_theme_typography_rules(theme)}
        #{scrolled_theme_properties_rules(theme)}
      CSS
    end

    def scrolled_theme_font_face_rules(theme)
      theme.options.fetch(:font_faces, []).filter_map { |face|
        FontFaceRule.new(face, theme:) { |path| scrolled_theme_asset_path(theme, path) }.generate
      }.join("\n")
    end

    def scrolled_theme_typography_rules(theme)
      RuleSet.new(prefix: 'typography').generate(theme.options.fetch(:typography, {}))
    end

    def scrolled_theme_properties_rules(theme)
      RuleSet.new(prefix: 'scope',
                  custom_properties: true).generate(theme.options.fetch(:properties, {}))
    end

    private

    # @api private
    class FontFaceRule
      FORMATS = {
        '.woff2' => 'woff2',
        '.woff' => 'woff',
        '.ttf' => 'truetype',
        '.otf' => 'opentype'
      }.freeze

      WEIGHT_PATTERN = /\A(normal|bold|\d{1,4}( \d{1,4})?)\z/
      STYLE_PATTERN = /\A(normal|italic)\z/
      FORMAT_PATTERN = /\A(woff2?|truetype|opentype|embedded-opentype|svg)(-variations)?\z/
      UNICODE_RANGE_PATTERN = /\A\s*U\+[0-9a-f?]{1,6}(-[0-9a-f]{1,6})?
                               (\s*,\s*U\+[0-9a-f?]{1,6}(-[0-9a-f]{1,6})?)*\s*\z/xi

      # Quotes and backslashes would allow breaking out of the quoted
      # strings family names and urls are interpolated into.
      UNSAFE_IN_FAMILY = /["'\\[[:cntrl:]]]/
      UNSAFE_IN_URL = /["'\\\s]/

      ABSOLUTE_URL = %r{\A((https?:)?//|/|data:)}

      def initialize(face, theme:, &resolve_path)
        @face = face
        @theme = theme
        @resolve_path = resolve_path
      end

      def generate
        return if family.blank? || source_values.empty?

        <<~CSS
          @font-face {
            #{declarations.join("\n  ")}
          }
        CSS
      end

      private

      attr_reader :face, :theme

      def declarations
        [
          %(font-family: "#{family}";),
          "src: #{source_values.join(', ')};",
          'font-display: swap;',
          *descriptors
        ]
      end

      def family
        @family ||= face[:family].to_s.gsub(UNSAFE_IN_FAMILY, '').strip
      end

      def source_values
        @source_values ||=
          sources
          .reject { |source| source[:url].match?(UNSAFE_IN_URL) }
          .map { |source| source_value(source[:url], source[:format]) }
      end

      def sources
        if face[:file_role]
          sources_from_files
        else
          sources_from_src
        end
      end

      def sources_from_files
        Array(face[:file_role]).compact.filter_map do |role|
          url = theme.files.dig(role.to_sym, :original)
          {url: url.to_s, format: face[:format]} if url
        end
      end

      def sources_from_src
        Array(face[:src]).filter_map do |src|
          src = {url: src} unless src.is_a?(Hash)
          next if src[:url].blank?

          {url: resolve_url(src[:url]), format: src.fetch(:format, face[:format])}
        end
      end

      def resolve_url(url)
        return url.to_s if url.to_s.match?(ABSOLUTE_URL)

        @resolve_path.call(url).to_s
      end

      def source_value(url, format)
        format = [format, FORMATS[extension(url)]].find do |candidate|
          candidate.to_s.match?(FORMAT_PATTERN)
        end

        return %(url("#{url}")) unless format

        %(url("#{url}") format("#{format}"))
      end

      def extension(url)
        File.extname(url.split(/[?#]/).first.to_s).downcase
      end

      def descriptors
        [
          ['font-weight', face[:weight], WEIGHT_PATTERN],
          ['font-style', face[:style], STYLE_PATTERN],
          ['unicode-range', face[:unicode_range], UNICODE_RANGE_PATTERN]
        ].filter_map do |property, value, pattern|
          "#{property}: #{value.to_s.strip};" if value.to_s.match?(pattern)
        end
      end
    end

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
        BREAKPOINTS.keys.to_h { |breakpoint_name|
          [breakpoint_name, declarations.delete(breakpoint_name)]
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
        ['shared', path.sub('../shared/', '')]
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
