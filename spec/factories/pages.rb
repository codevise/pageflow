module Pageflow
  FactoryBot.define do
    factory :page, class: Page do
      chapter
      template { 'background_image' }
      configuration { {} }

      transient do
        revision { nil }
      end

      before(:create) do |page, evaluator|
        if evaluator.revision
          storyline = create(:storyline, revision: evaluator.revision)
          page.chapter = create(:chapter, storyline:)
        end
      end
    end

    factory :valid_page, class: Page do
      template { 'background_image' }
      configuration { {} }
    end
  end
end
