module PageflowScrolled
  # @api private
  module GeneratedMediaQueriesHelper
    def generated_media_queries_css_for(html)
      html.scan(/class="[^"]*aspectRatio([0-9]+)/).map { |match|
        # WARNING: This CSS snippet needs to be kept in sync with the
        # corresponding snippet in useBackdropSectionClassName hook
        <<-CSS
          @media (min-aspect-ratio: #{match[0]}/1000) {
            section.aspectRatio#{match[0]} {
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
      }.join
    end
  end
end
