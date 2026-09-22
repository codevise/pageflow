module Pageflow
  FactoryBot.define do
    factory :account_member_comment_settings, class: AccountMemberCommentSettings do
      account
      user
    end
  end
end
