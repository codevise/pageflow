module Pageflow
  FactoryBot.define do
    factory :file_usage, class: FileUsage do
      revision { nil }
      file { nil }
      display_name { nil }
    end
  end
end
