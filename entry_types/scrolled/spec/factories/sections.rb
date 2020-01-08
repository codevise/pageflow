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

      transient do
        revision { nil }
      end

      before(:create) do |section, evaluator|
        if evaluator.revision
          section.chapter = create(:scrolled_chapter, revision: evaluator.revision)
        end
      end
    end
  end
end
