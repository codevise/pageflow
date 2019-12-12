module PageflowScrolled
  FactoryBot.define do
    factory :text_block, class: ContentElement do
      section
      type_name { 'TextBlock' }
      configuration do
        {
          children: 'Some sample text with <b>HTML</b>'
        }
      end
    end
  end
end
