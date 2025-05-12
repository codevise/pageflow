module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_chapter, class: Chapter do
      transient do
        revision { nil }
      end

      before(:create) do |chapter, evaluator|
        if chapter.storyline.nil?
          revision = evaluator.revision || build(:revision)
          chapter.storyline = Storyline.all_for_revision(revision).first ||
                              create(:scrolled_storyline,
                                     revision:,
                                     configuration: {main: true})
        end
      end

      configuration do
        {
          title: 'chapter title'
        }
      end
    end
  end
end
