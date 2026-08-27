module Pageflow
  module Admin
    module EntriesHelper # rubocop:todo Style/Documentation
      def admin_entry_title(entry)
        if entry.title.blank?
          I18n.t('pageflow.admin.entries.default_title', id: entry.id)
        else
          entry.title
        end
      end

      def collection_for_entry_publication_states
        [
          'published_without_password_protection',
          'published_with_password_protection',
          'not_published'
        ].index_by do |state|
          I18n.t(state, scope: 'activerecord.values.pageflow/entry.publication_states')
        end
      end

      def entry_comments_indicator(entry, summaries: entry_comment_summaries)
        summary = summaries[entry.id]
        return unless summary&.any?

        content_tag(:span,
                    class: 'entry_comments_indicator',
                    data: {tooltip: entry_comments_tooltip(summary)}) do
          safe_join([summary.topic_count.to_s,
                     (content_tag(:span, '', class: 'unread_dot') if summary.unread?)].compact)
        end
      end

      # Built for the whole page at once, so that rendering a row does
      # not query. Views without an index table collection pass their own
      # summaries instead.
      def entry_comment_summaries
        @entry_comment_summaries ||=
          EntryCommentSummary.for_entries(collection, user: current_user)
      end

      def entry_comments_tooltip(summary)
        scope = 'pageflow.admin.entries.comments'

        parts = [t("#{scope}.topic_count", count: summary.topic_count)]

        if summary.unread_topic_count.positive?
          parts << t("#{scope}.unread_topic_count", count: summary.unread_topic_count)
        end

        if summary.unread_reply_count.positive?
          parts << t("#{scope}.unread_reply_count", count: summary.unread_reply_count)
        end

        if summary.unread_resolution_count.positive?
          parts << t("#{scope}.unread_resolution_count", count: summary.unread_resolution_count)
        end

        t("#{scope}.tooltip", summary: parts.join(', '))
      end

      def entry_type_collection(entry_types = Pageflow.config.entry_types)
        entry_types.map(&:name).index_by do |type|
          I18n.t(type, scope: 'activerecord.values.pageflow/entry.type_names')
        end
      end
    end
  end
end
