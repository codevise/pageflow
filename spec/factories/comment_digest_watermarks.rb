module Pageflow
  FactoryBot.define do
    factory :comment_digest_watermark, class: CommentDigestWatermark do
      entry
      considered_up_to { Time.current }
    end
  end
end
