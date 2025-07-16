module Pageflow
  FactoryBot.define do
    factory :revision, class: Revision do
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
        configuration do
          {
            home_button_enabled: true,
            home_url: 'http://example.com'
          }
        end
      end

      trait :without_home_button do
        configuration do
          {
            home_button_enabled: false,
            home_url: 'http://example.com'
          }
        end
      end

      trait :with_overview_button do
        configuration do
          {
            overview_button_enabled: true
          }
        end
      end

      trait :without_overview_button do
        configuration do
          {
            overview_button_enabled: false
          }
        end
      end

      trait :with_meta_data do
        author { 'Some author' }
        publisher { 'Some publisher' }
        keywords { 'Some keywords' }
      end
    end
  end
end
