module Pageflow
  FactoryBot.define do
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

      trait :not_yet_depublished do
        published
        published_until { 1.day.from_now }
      end

      trait :depublished do
        published
        published_until { 1.day.ago }
      end

      trait :user_snapshot do
        frozen
        snapshot_type { 'user' }
      end

      trait :auto_snapshot do
        frozen
        snapshot_type { 'auto' }
      end

      trait :with_home_button do
        home_button_enabled { true }
        home_url { 'http://example.com' }
      end

      trait :without_home_button do
        home_button_enabled { false }
        home_url { 'http://example.com' }
      end

      trait :with_overview_button do
        overview_button_enabled { true }
      end

      trait :without_overview_button do
        overview_button_enabled { false }
      end
    end
  end
end
