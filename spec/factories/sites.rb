module Pageflow
  FactoryBot.define do
    factory :site, :class => Pageflow::Site do
      account
    end
  end
end
