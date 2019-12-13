module PageflowScrolled
  FactoryBot.define do
    factory :heading, class: ContentElement do
      section
      type_name { 'heading' }
      configuration do
        {
          children: 'A headline'
        }
      end
    end

    factory :text_block, class: ContentElement do
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
