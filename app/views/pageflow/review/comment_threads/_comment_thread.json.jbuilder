json.key_format!(camelize: :lower)

json.call(comment_thread,
          :id,
          :perma_id,
          :subject_type,
          :subject_id,
          :creator_id,
          :resolved_at,
          :created_at,
          :updated_at)

json.comments(comment_thread.comments) do |comment|
  json.partial!('pageflow/review/comments/comment', comment:)
end
