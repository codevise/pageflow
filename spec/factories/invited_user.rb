module Pageflow
  FactoryGirl.define do
    factory :invited_user, class: InvitedUser do
      email
      first_name 'Edison'
      last_name 'Editor'
      initial_account { create(:account) }
    end
  end
end
