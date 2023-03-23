module Pageflow
  FactoryBot.define do
    factory :site, class: Pageflow::Site do
      feeds_enabled { true }

      after(:build) do |site|
        site.account ||= build(:account, default_site: site)
      end
    end
  end
end
