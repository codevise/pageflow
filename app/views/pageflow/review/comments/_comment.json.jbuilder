json.key_format!(camelize: :lower)

json.call(comment,
          :id,
          :perma_id,
          :creator_id,
          :body,
          :created_at,
          :updated_at)

json.creator_name comment.creator.full_name
