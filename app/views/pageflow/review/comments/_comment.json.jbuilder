json.key_format!(camelize: :lower)

json.call(comment,
          :id,
          :perma_id,
          :creator_id,
          :body,
          :quote,
          :created_at,
          :updated_at,
          :edited_at)

json.creator_name comment.creator.full_name
