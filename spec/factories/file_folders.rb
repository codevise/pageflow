module Pageflow
  FactoryBot.define do
    factory :file_folder, class: FileFolder do
      revision
      name { 'Some folder' }
    end
  end
end
