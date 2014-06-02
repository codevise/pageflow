module Pageflow
  FactoryGirl.define do
    factory :theme, :class => Pageflow::Theme do
      css_dir "default"
    end
  end
end
