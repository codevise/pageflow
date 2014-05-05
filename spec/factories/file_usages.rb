module Pageflow
  FactoryGirl.define do
    factory :file_usage, :class => FileUsage do
      revision nil
      file nil
    end
  end
end
