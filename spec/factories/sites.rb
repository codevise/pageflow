module Pageflow
  FactoryBot.define do
    factory :site, class: Pageflow::Site do
      feeds_enabled { true }
      sitemap_enabled { true }

      after(:build) do |site|
        site.account ||= build(:account, default_site: site)
      end

      trait(:with_root_permalink_directory) do
        after(:build) do |site|
          site.permalink_directories.build(path: '')
        end
      end
    end
  end
end
