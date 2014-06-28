module Pageflow
  FactoryGirl.define do
    factory :theming, :class => Pageflow::Theming do
      theme_name 'default'
    end
  end
end
