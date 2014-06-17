module Pageflow
  FactoryGirl.define do
    factory :theming, :class => Pageflow::Theming do
      theme
    end
  end
end