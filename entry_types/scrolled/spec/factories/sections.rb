module PageflowScrolled
  FactoryBot.define do
    factory :section, class: Section do
      revision
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
