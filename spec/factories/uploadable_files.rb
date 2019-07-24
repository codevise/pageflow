module Pageflow
  FactoryBot.define do
    factory :uploadable_file, class: 'Pageflow::TestUploadableFile' do
      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
      state { 'uploaded' }

      transient do
        used_in { nil }
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file: file, revision: evaluator.used_in) if evaluator.used_in
      end

      trait :uploading do
        attachment { nil }
        file_name { 'image.jpg' }
        state { 'uploading' }

        after :create do |uploadable_file|
          simulate_direct_upload(uploadable_file)
        end
      end

      trait :uploaded do
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end
    end
  end
end
