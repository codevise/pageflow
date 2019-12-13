module PageflowScrolled
  FactoryBot.define do
    factory :content_element, class: ContentElement do
      section
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
      section
      type_name { 'textBlock' }
      configuration do
        {
          children: 'Some sample text with <b>HTML</b>'
        }
      end
    end
  end
end
