module Pageflow
  FactoryBot.define do
    factory :video_file, class: VideoFile do
      entry
      uploader { create(:user) }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'video.mp4')) }
      state { 'encoded' }

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
        file_name { 'video.mp4' }
        state { 'uploading' }

        after :create do |video_file|
          simulate_direct_upload(video_file)
        end
      end

      trait :uploaded do
        uploading
        state { 'uploaded' }
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end

      trait :waiting_for_confirmation do
        state { 'waiting_for_confirmation' }
      end

      trait :fetching_meta_data_failed do
        state { 'fetching_meta_data_failed' }
      end

      trait :encoding_failed do
        state { 'encoding_failed' }
      end

      trait :encoded do
      end

      trait :with_highdef_encoding do
        association :entry, :with_highdef_video_encoding
      end
    end
  end
end
