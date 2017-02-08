module Pageflow
  FactoryGirl.define do
    factory :text_track_file, class: TextTrackFile do
      entry
      uploader { create(:user) }
      parent_file { nil }

      attachment_on_s3 File.open(Engine.root.join('spec', 'fixtures', 'sample.vtt'))

      transient do
        used_in nil
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
        file.parent_file ||= create(:video_file, used_in: file.entry.draft)
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file: file, revision: evaluator.used_in) if evaluator.used_in
      end

      trait :from_srt_file do
        attachment_on_s3 File.open(Engine.root.join('spec', 'fixtures', 'sample.srt'))
      end

      trait :on_filesystem do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'et.ogg'))
        attachment_on_s3 nil
        state 'not_uploaded_to_s3'
      end

      trait :uploading_to_s3_failed do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'et.ogg'))
        attachment_on_s3 nil
        state 'uploading_to_s3_failed'
      end
    end
  end
end
