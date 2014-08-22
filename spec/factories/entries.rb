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

      ignore do
        with_member nil
      end

      after(:create) do |entry, evaluator|
        create(:membership, :entry => entry, :user => evaluator.with_member) if evaluator.with_member
      end

      trait :published do
        ignore do
          published_revision_attributes({})
        end

        after(:create) do |entry, evaluator|
          create(:revision, :published, evaluator.published_revision_attributes.merge(entry: entry))
        end
      end
    end
  end
end
