module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_chapter, class: Chapter do
      revision
      configuration do
        {
          title: 'chapter title'
        }
      end
    end
  end
end
