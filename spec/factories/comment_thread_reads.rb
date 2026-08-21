module Pageflow
  FactoryBot.define do
    factory :comment_thread_read, class: CommentThreadRead do
      entry
      user
      comment_thread_perma_id { 1 }
      read_at { Time.current }
    end
  end
end
