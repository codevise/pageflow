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
        after(:create) do |entry|
          create(:revision, :published, :entry => entry)
        end
      end
    end
  end
end
