module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_storyline, class: Storyline do
      revision
      role { configuration.to_h.with_indifferent_access[:main] ? 'main' : 'excursions' }
      configuration do
        {
          main: true
        }
      end
    end
  end
end
