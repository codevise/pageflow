module PageflowScrolled
  FactoryBot.define do
    factory :section, class: Section do
      chapter { create(:scrolled_chapter) }
      configuration do
        {
          transition: 'scroll',
          fullHeight: true,
          backdrop: {
            image: 'darkPattern'
          }
        }
      end
    end
  end
end
