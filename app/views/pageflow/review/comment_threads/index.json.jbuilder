json.key_format!(camelize: :lower)

json.current_user do
  json.id current_user.id
  json.name current_user.full_name
end

json.comment_threads(@comment_threads) do |comment_thread|
  json.partial!('pageflow/review/comment_threads/comment_thread', comment_thread:)
end

json.comment_thread_reads(@read_at_by_perma_id.transform_keys(&:to_s))
