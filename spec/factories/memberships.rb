module Pageflow
  FactoryGirl.define do
    factory :membership, class: Membership do
      user
      association :entity, factory: :entry
      role 'previewer'
    end

    factory :entry_membership, class: Membership do
      user
      association :entity, factory: :entry
      role 'previewer'
    end

    factory :account_membership, class: Membership do
      user
      association :entity, factory: :account
      role 'previewer'
    end
  end
end
