module Pageflow
  FactoryGirl.define do
    factory :membership, class: Membership do
      user
      association :entity, factory: :entry
      role 'editor'
    end
  end
end
