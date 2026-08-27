json.key_format!(camelize: :lower)

json.call(comment_thread,
          :id,
          :perma_id,
          :subject_type,
          :subject_id,
          :subject_range,
          :section_perma_id,
          :creator_id,
          :resolved_at,
          :resolved_by_id,
          :created_at,
          :updated_at)

json.resolver_name comment_thread.resolver&.full_name

json.comments(comment_thread.comments) do |comment|
  json.partial!('pageflow/review/comments/comment', comment:)
end
