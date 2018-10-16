module Pageflow
  FactoryBot.define do
    factory :page, :class => Page do
      chapter
      template { 'background_image' }
      configuration { {} }
    end

    factory :valid_page, :class => Page do
      template { 'background_image' }
      configuration { {} }
    end
  end
end
