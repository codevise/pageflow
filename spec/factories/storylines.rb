module Pageflow
  FactoryBot.define do
    factory :storyline, class: Storyline do
      revision
    end

    factory :valid_storyline, class: Storyline do
      configuration do
        {}
      end
    end
  end
end
