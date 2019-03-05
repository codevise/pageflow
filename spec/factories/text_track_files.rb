module Pageflow
  FactoryBot.define do
    factory :text_track_file, class: TextTrackFile do
      entry
      uploader { create(:user) }
      parent_file { nil }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'sample.vtt')) }
      state { 'processed' }

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
        file_name { 'sample.srt' }
      end

      trait :uploading do
        attachment { nil }
        file_name { 'sample.vtt' }
        state { 'uploading' }

        after :create do |text_track_file|
          simulate_direct_upload(text_track_file)
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
