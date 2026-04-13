module Pageflow
  FactoryBot.define do
    factory :comment, class: Comment do
      comment_thread
      creator factory: :user
      body { 'A comment' }
    end
  end
end
