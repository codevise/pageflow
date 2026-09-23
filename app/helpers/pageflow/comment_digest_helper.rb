module Pageflow
  # @api private
  module CommentDigestHelper
    # Mail clients drop a stylesheet, so every rule travels with the
    # element it applies to.
    STYLES = {
      body: 'margin: 0; padding: 0; ' \
            "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " \
            'Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.5; ' \
            'color: #1f2328;',
      intro: 'margin: 0 0 16px;',
      summary: 'margin: 24px 0 8px; font-size: 14px; color: #62707f;',
      thread: 'padding: 16px; background: #ffffff; border: 1px solid #dfe3e8; ' \
              'border-radius: 8px;',
      author: 'margin: 0 0 4px; font-weight: 600; color: #1f2328;',
      comment_body: 'margin: 0; white-space: pre-wrap; color: #1f2328;',
      comment_spacing: 'margin-top: 16px;',
      earlier_replies: 'margin: 16px 0 0; font-size: 13px; color: #8b95a1;',
      new_replies: 'margin: 16px 0 0; padding-top: 12px; ' \
                   'border-top: 1px solid #f0b429; font-weight: 500; ' \
                   'font-size: 13px; color: #b7791f;',
      resolution: 'margin: 16px 0 0; padding-top: 12px; ' \
                  'border-top: 1px solid #eceff2; font-size: 14px; color: #62707f;',
      resolver: 'font-weight: 600; color: #1f2328;',
      greeting: 'margin: 32px 0 0;',
      footer: 'margin: 32px 0 0; padding-top: 16px; ' \
              'border-top: 1px solid #eceff2; font-size: 13px; color: #8b95a1;',
      footer_reason: 'margin: 0;',
      footer_links: 'margin: 8px 0 0;',
      footer_link: 'color: #62707f;'
    }.freeze

    def comment_digest_style(name)
      STYLES.fetch(name)
    end

    def comment_digest_summary(group)
      scope = 'pageflow.user_mailer.comment_digest.summary'

      parts = [
        (t("#{scope}.topic") if comment_digest_topic?(group)),
        (t("#{scope}.reply_count", count: comment_digest_new_replies(group).size) if
          comment_digest_new_replies(group).any?),
        (t("#{scope}.resolution") if comment_digest_resolution(group))
      ].compact

      comment_digest_join(parts, t("#{scope}.and")).upcase_first
    end

    def comment_digest_topic?(group)
      group.events.any? { |event| event.kind == :topic }
    end

    def comment_digest_new_replies(group)
      group.events.select { |event| event.kind == :reply }.map(&:comment)
    end

    def comment_digest_resolution(group)
      group.events.find { |event| event.kind == :resolution }
    end

    def comment_digest_earlier_reply_count(group)
      replies = group.comment_thread.comments.drop(1)
      first_new = comment_digest_new_replies(group).first

      first_new ? replies.index(first_new).to_i : replies.size
    end

    private

    def comment_digest_join(parts, conjunction)
      return parts.first.to_s if parts.size < 2

      [parts[0..-2].join(', '), parts.last].join(conjunction)
    end
  end
end
