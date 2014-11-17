module Pageflow
  FactoryGirl.define do
    factory :image_file, :class => ImageFile do
      entry
      uploader { create(:user) }

      attachment File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))
      state 'processed'

      transient do
        used_in nil
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        create(:file_usage, :file => file, :revision => evaluator.used_in) if evaluator.used_in
      end

      trait :unprocessed do
        unprocessed_attachment File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))
        processed_attachment nil
        state 'not_processed'
      end

      trait :failed do
        unprocessed_attachment File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))
        processed_attachment nil
        state 'processing_failed'
      end

      trait :encoded do
      end
    end
  end
end
