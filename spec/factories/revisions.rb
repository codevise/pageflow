module Pageflow
  FactoryGirl.define do
    factory :revision, :class => Revision do
      entry

      trait :frozen do
        frozen_at { 1.day.ago }
      end

      trait :published do
        frozen
        creator { create(:user) }
        published_at { 1.day.ago }
      end

      trait :depublished do
        published
        published_until { 1.day.ago }
      end
    end
  end
end
