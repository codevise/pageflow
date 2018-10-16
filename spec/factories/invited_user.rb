module Pageflow
  FactoryBot.define do
    factory :invited_user, class: InvitedUser do
      email
      first_name { 'Edison' }
      last_name { 'Editor' }
    end
  end
end
