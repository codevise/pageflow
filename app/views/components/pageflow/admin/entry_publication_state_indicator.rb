module Pageflow
  module Admin
    # @api private
    class EntryPublicationStateIndicator < ViewComponent
      builder_method :entry_publication_state_indicator

      def build(entry)
        return unless entry.published?

        span(class: css_class(entry)) do
          span(tooltip_text(entry), class: 'tooltip_bubble')
        end
      end

      private

      def css_class(entry)
        ['publication_state_indicator', entry.publication_state].join(' ')
      end

      def tooltip_text(entry)
        I18n.t(entry.publication_state,
               scope: 'activerecord.values.pageflow/entry.publication_states')
      end
    end
  end
end
