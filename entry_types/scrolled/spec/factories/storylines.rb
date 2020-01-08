module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_storyline, class: Storyline do
      revision
      configuration do
        {
          main: true
        }
      end
    end
  end
end
