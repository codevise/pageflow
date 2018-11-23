module Pageflow
  FactoryBot.define do
    factory :text_track_file, class: TextTrackFile do
      entry
      uploader { create(:user) }
      parent_file { nil }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'sample.vtt')) }

      transient do
        used_in { nil }
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
        file.parent_file ||= create(:video_file, used_in: file.entry.draft)
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file: file, revision: evaluator.used_in) if evaluator.used_in
      end

      trait :from_srt_file do
        attachment { File.open(Engine.root.join('spec', 'fixtures', 'sample.srt')) }
      end

      trait :uploadable do
        state { 'uploadable' }
      end

      trait :uploading do
        state { 'uploading' }
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end

      trait :uploaded do
        state { 'uploaded' }
      end
    end
  end
end
