module Pageflow
  FactoryGirl.define do
    factory :video_file, :class => VideoFile do
      entry
      uploader { create(:user) }

      attachment_on_s3 File.open(Engine.root.join('spec', 'fixtures', 'video.mp4'))
      state 'encoded'

      transient do
        used_in nil
        with_configuration nil
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        if evaluator.used_in
          create(:file_usage,
                 file: file,
                 revision: evaluator.used_in,
                 configuration: evaluator.with_configuration)
        end
      end

      trait :on_filesystem do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'video.mp4'))
        attachment_on_s3 nil
        state 'not_uploaded_to_s3'
      end

      trait :uploading_to_s3_failed do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'video.mp4'))
        attachment_on_s3 nil
        state 'uploading_to_s3_failed'
      end

      trait :waiting_for_confirmation do
        state 'waiting_for_confirmation'
      end

      trait :encoding_failed do
        state 'encoding_failed'
      end

      trait :encoded do
      end
    end
  end
end
