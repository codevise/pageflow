module Pageflow
  FactoryBot.define do
    factory :image_file, class: ImageFile do
      entry
      uploader { create(:user) }
      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')) }
      state { 'processed' }

      transient do
        used_in { nil }
        with_configuration { nil }
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        if evaluator.used_in
          create(:file_usage,
                 file:,
                 revision: evaluator.used_in,
                 configuration: evaluator.with_configuration)
        end
      end

      trait :uploading do
        attachment { nil }
        file_name { 'image.jpg' }
        state { 'uploading' }

        after :create do |image_file|
          simulate_direct_upload(image_file)
        end
      end

      trait :uploaded do
        uploading
        state { 'uploaded' }
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end

      trait :processing do
        state { 'processing' }
      end

      trait :processed do
      end

      trait :processing_failed do
        state { 'processing_failed' }
      end
    end
  end
end
