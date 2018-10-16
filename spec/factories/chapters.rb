module Pageflow
  FactoryBot.define do
    factory :chapter, :class => Chapter do
      storyline

      transient do
        in_main_storyline_of { nil }
      end

      before(:create) do |chapter, evaluator|
        if revision = evaluator.in_main_storyline_of
          chapter.storyline = revision.storylines.first ||
            fail('Expected revision to have a main storyline.')
        end
      end
    end

    factory :valid_chapter, :class => Chapter do
      title { 'Introduction' }
    end
  end
end
