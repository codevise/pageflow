module Pageflow
  FactoryBot.define do
    factory :comment_thread, class: CommentThread do
      revision
      creator factory: :user
      subject_type { 'ContentElement' }
      subject_id { 1 }
    end
  end
end
