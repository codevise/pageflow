module Pageflow
  FactoryBot.define do
    factory :audio_file, :class => AudioFile do
      entry
      uploader { create(:user) }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'et.ogg')) }

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
        state { 'uploading' }
      end

      trait :uploaded do
        state { 'uploaded' }
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end

      trait :waiting_for_confirmation do
        state { 'waiting_for_confirmation' }
      end

      trait :encoding_failed do
        state { 'encoding_failed' }
      end

      trait :encoded do
        state { 'encoded' }
      end
    end
  end
end
