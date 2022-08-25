module PageflowScrolled
  # @api private
  module GeneratedMediaQueriesHelper
    def generated_media_queries_tags_for(html)
      safe_join(
        [
          content_tag(:script,
                      'window.pageflowScrolledSSRAspectRatioMediaQueries = true;'),
          content_tag(:style,
                      generated_media_queries_css_for(html))
        ]
      )
    end

    def generated_media_queries_css_for(html)
      aspect_ratio_class_strings = html.scan(/class="[^"]*aspectRatio[^"]*"/)

      ratio_classes =
        aspect_ratio_class_strings
        .flat_map { |s| s.scan(/aspectRatio(Mobile)?([0-9]+)/) }
        .uniq

      ratio_classes.map { |match|
        generated_aspec_ratio_media_query(
          mobile_suffix: match[0],
          numerator: match[1]
        )
      }.join
    end

    private

    def generated_aspec_ratio_media_query(numerator:, mobile_suffix:)
      orientation = mobile_suffix ? '(orientation: portrait) and ' : ''

      # WARNING: This CSS snippet needs to be kept in sync with the
      # corresponding snippet in useBackdropSectionClassName hook
      <<-CSS
        @media #{orientation}(min-aspect-ratio: #{numerator}/1000) {
          section.aspectRatio#{mobile_suffix}#{numerator} {
             --backdrop-positioner-transform: var(--backdrop-positioner-min-ar-transform);
             --backdrop-positioner-width: var(--backdrop-positioner-min-ar-width);
             --backdrop-positioner-height: var(--backdrop-positioner-min-ar-height);

             --motif-placeholder-width: var(--motif-placeholder-min-ar-width);

             --motif-display-top: var(--motif-display-min-ar-top);
             --motif-display-bottom: var(--motif-display-min-ar-bottom);
             --motif-display-height: var(--motif-display-min-ar-height);
          }
        }
      CSS
    end
  end
end
