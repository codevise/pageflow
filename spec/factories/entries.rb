module Pageflow
  FactoryGirl.define do
    sequence :title do |n|
      "Entry #{n}"
    end

    factory :entry, :class => Entry do
      title

      account

      after(:build) do |entry|
        entry.theming ||= entry.account.default_theming
      end

      # inline membership creation

      transient do
        with_member nil
      end

      after(:create) do |entry, evaluator|
        create(:membership, :entry => entry, :user => evaluator.with_member) if evaluator.with_member
      end

      trait :published do
        transient do
          published_revision_attributes({})
        end

        after(:create) do |entry, evaluator|
          create(:revision, :published, evaluator.published_revision_attributes.merge(entry: entry))
        end
      end

      trait :published_with_password do
        after(:create) do |entry, evaluator|
          create(:revision, :published, entry: entry, password_protected: true)
        end
      end
    end
  end
end
