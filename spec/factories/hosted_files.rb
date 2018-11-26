module Pageflow
  FactoryBot.define do
    factory :hosted_file, class: 'Pageflow::TestHostedFile' do
      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
      state { 'uploaded' }

      transient do
        used_in { nil }
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file: file, revision: evaluator.used_in) if evaluator.used_in
      end

      trait :uploading do
        state { 'uploading' }
      end

      trait :uploaded do
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end
    end
  end
end
