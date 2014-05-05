module Pageflow
  FactoryGirl.define do
    factory :membership, :class => Membership do
      user
      entry
    end
  end
end
