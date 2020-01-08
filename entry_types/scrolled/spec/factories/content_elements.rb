module PageflowScrolled
  FactoryBot.define do
    factory :content_element, class: ContentElement do
      section

      transient do
        revision { nil }
      end

      before(:create) do |content_element, evaluator|
        if evaluator.revision
          chapter = create(:scrolled_chapter, revision: evaluator.revision)
          content_element.section = create(:section, chapter: chapter)
        end
      end
    end

    trait :heading do
      type_name { 'heading' }
      configuration do
        {
          children: 'A headline'
        }
      end
    end

    trait :text_block do
      type_name { 'textBlock' }
      configuration do
        {
          children: 'Some sample text with <b>HTML</b>'
        }
      end
    end
  end
end
