module Pageflow
  FactoryBot.define do
    factory :theming, :class => Pageflow::Theming do
      account
    end
  end
end
