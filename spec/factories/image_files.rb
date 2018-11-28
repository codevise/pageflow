module Pageflow
  FactoryBot.define do
    factory :image_file, :class => ImageFile do
      entry
      uploader { create(:user) }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')) }
      state { 'processed' }

      transient do
        used_in { nil }
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        create(:file_usage, :file => file, :revision => evaluator.used_in) if evaluator.used_in
      end

      trait :uploading do
        attachment { nil }
        attachment_on_s3_file_name { 'image.jpg' }
        state { 'uploading' }

        after :create do |image_file|
          simulate_direct_upload(image_file)
        end
      end

      trait :uploaded do
        uploading
        state { 'uploaded' }
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
