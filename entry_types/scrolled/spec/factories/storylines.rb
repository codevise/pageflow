module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_storyline, class: Storyline do
      revision
      role { 'main' }
    end
  end
end
