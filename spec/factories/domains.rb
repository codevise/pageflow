module Pageflow
  FactoryGirl.define do
    factory :domain, class: Domain do
      primary true
      name 'stories.example.com'
      theming
    end
  end
end
