# Read about factories at https://github.com/thoughtbot/factory_girl

module Pageflow
  FactoryGirl.define do
    factory :chapter, :class => Chapter do
      revision

      transient do
        entry nil
      end

      before(:create) do |chapter, evaluator|
        chapter.revision = evaluator.entry.draft if evaluator.entry
      end
    end

    factory :valid_chapter, :class => Chapter do
      title "Introduction"
    end
  end
end
